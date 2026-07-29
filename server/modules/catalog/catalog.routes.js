const express = require("express");
const mongoose = require("mongoose");
const Product = require("#modules/catalog/product.model");
const User = require("#modules/users/user.model");
const Order = require("#modules/orders/order.model");
const auth = require("#modules/auth/auth.middleware");
const asyncHandler = require("#shared/http/asyncHandler");
const HttpError = require("#shared/errors/HttpError");
const { asObjectId, pagination } = require("#shared/validation/index");
const {
  DATA_IMAGE_PATTERN,
  parseProductInput,
  parseReviewInput,
} = require("#modules/catalog/product.input");
const {
  destroyProductImages,
  uploadProductImage,
} = require("#infrastructure/media/cloudinary");

const router = express.Router();
const NO_MATCH = ";0.hjgbhj";
const listProjection = {
  _id: 1,
  name: 1,
  price: 1,
  stock: 1,
  createdAt: 1,
  averageRating: { $avg: "$reviews.rating" },
  totalRatings: { $size: { $ifNull: ["$reviews", []] } },
};

const productImages = (product) =>
  (product.stock || []).flatMap((stock) => stock.images || []);

async function materializeStock(stock, uploadedImages) {
  const result = [];
  for (const variant of stock) {
    const images = [];
    for (const image of variant.images) {
      if (!DATA_IMAGE_PATTERN.test(image)) {
        images.push(image);
        continue;
      }
      const uploaded = await uploadProductImage(image);
      uploadedImages.push(uploaded);
      images.push(uploaded);
    }
    result.push({ ...variant, images });
  }
  return result;
}

function commaList(value) {
  return typeof value === "string" ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function validObjectIds(value) {
  return commaList(value).filter((id) => mongoose.isObjectIdOrHexString(id));
}

function stockMatch(query, { color = true, size = true } = {}) {
  const colors = color ? commaList(query.color).map((value) => value.startsWith("#") ? value : `#${value}`) : [];
  const sizes = size ? commaList(query.size) : [];
  if (!colors.length && !sizes.length) return {};

  const variant = {};
  if (colors.length) variant.color = { $in: colors };
  if (sizes.length) variant.sizeRemaining = { $elemMatch: { size: { $in: sizes }, remaining: { $gt: 0 } } };
  return { stock: { $elemMatch: variant } };
}

function categoryMatch(catagory, type) {
  const categories = commaList(catagory);
  const types = commaList(type);
  const match = {};
  if (categories[0] && categories[0] !== NO_MATCH) match.catagory = { $in: [...categories, "both"] };
  if (types[0] && types[0] !== NO_MATCH) match.type = { $in: types };
  return match;
}

function exclusions(query) {
  const ids = validObjectIds(query.except);
  return ids.length ? { _id: { $nin: ids.map((id) => new mongoose.Types.ObjectId(id)) } } : {};
}

function sortFrom(query, fallback) {
  if (query.sort === "asc") return { price: 1, _id: 1 };
  if (query.sort === "desc") return { price: -1, _id: 1 };
  if (query.sort === "new") return { createdAt: -1, _id: 1 };
  return fallback;
}

async function catalogResponse({ match, query, sort, projection = listProjection }) {
  const { limit, skip } = pagination(query);
  const includeFilters = query.includeFilters !== "false";
  const facets = {
    products: [
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      { $project: projection },
    ],
    metadata: [{ $count: "count" }],
  };
  if (includeFilters) {
    facets.filterValues = [
      { $unwind: "$stock" },
      { $unwind: "$stock.sizeRemaining" },
      { $match: { "stock.sizeRemaining.remaining": { $gt: 0 } } },
      {
        $group: {
          _id: null,
          colors: { $addToSet: "$stock.color" },
          sizes: { $addToSet: "$stock.sizeRemaining.size" },
        },
      },
    ];
  }

  const [result] = await Product.aggregate([
    { $match: match },
    { $facet: facets },
  ]);
  let filters;
  if (includeFilters) {
    const available = result.filterValues[0] || { colors: [], sizes: [] };
    const selectedDimension =
      typeof query.filter === "string" ? query.filter : "";
    filters = {};
    if (!selectedDimension.includes("color") || !commaList(query.color).length) {
      filters.colors = available.colors.sort();
    }
    if (!selectedDimension.includes("size") || !commaList(query.size).length) {
      filters.sizes = available.sizes.sort();
    }
  }
  return {
    products: result.products,
    count: result.metadata[0]?.count || 0,
    ...(filters ? { filters } : {}),
  };
}

function currentMonth() {
  const now = new Date();
  return Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}`);
}

router.get("/best-seller", asyncHandler(async (req, res) => {
  const match = { sales: { $gte: 1 }, ...stockMatch(req.query) };
  res.json(await catalogResponse({
    match,
    query: req.query,
    sort: sortFrom(req.query, { sales: -1, _id: 1 }),
    projection: { ...listProjection, sales: 1 },
  }));
}));

router.get("/trending", asyncHandler(async (req, res) => {
  const month = currentMonth();
  const match = {
    salesPerMonth: { $elemMatch: { month, sales: { $gte: 1 } } },
    ...stockMatch(req.query),
  };
  res.json(await catalogResponse({
    match,
    query: req.query,
    sort: sortFrom(req.query, { "salesPerMonth.sales": -1, _id: 1 }),
    projection: {
      ...listProjection,
      salesPerMonth: {
        $filter: { input: "$salesPerMonth", as: "entry", cond: { $eq: ["$$entry.month", month] } },
      },
    },
  }));
}));

router.get("/reviews", auth, asyncHandler(async (req, res) => {
  const productId = asObjectId(req.query.productId, "product id");
  const { page, limit, skip } = pagination(req.query);
  const [product] = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productId) } },
    { $project: { _id: 0, reviews: { $slice: ["$reviews", skip, limit] } } },
  ]);
  if (!product) throw new HttpError(404, "Product not found");

  let reviewed = [];
  let purchased = false;
  if (page === 1 && req.userId) {
    const user = await User.findById(req.userId, "orders").lean();
    reviewed = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },
      { $project: { reviews: { $filter: { input: "$reviews", as: "review", cond: { $eq: ["$$review.user", new mongoose.Types.ObjectId(req.userId)] } } } } },
    ]).then((rows) => rows[0]?.reviews || []);
    purchased = Boolean(user && await Order.exists({ _id: { $in: user.orders }, "items._id": productId }));
  }

  const allReviews = [...product.reviews, ...reviewed];
  const users = await User.find(
    { _id: { $in: allReviews.map((review) => review.user) } },
    "name email"
  ).lean();
  const byId = new Map(users.map((user) => [String(user._id), user]));
  const decorate = (review) => {
    const user = byId.get(String(review.user));
    const { user: _userId, ...rest } = review;
    return { ...rest, userName: user?.name || "deleted", email: user?.email || "deleted" };
  };

  const response = { reviews: product.reviews.map(decorate) };
  if (page === 1 && req.userId) {
    response.reviewed = reviewed.map(decorate);
    response.purchased = purchased;
  }
  res.json(response);
}));

router.post("/", auth.requireAdmin, asyncHandler(async (req, res) => {
  const input = parseProductInput(req.body.product);
  const uploadedImages = [];
  try {
    const stock = await materializeStock(input.stock, uploadedImages);
    const product = await Product.create({
      ...input,
      stock,
      createdAt: String(Date.now()),
    });
    res.status(201).json(product);
  } catch (error) {
    await destroyProductImages(uploadedImages);
    throw error;
  }
}));

router.put("/:id", auth.requireAdmin, asyncHandler(async (req, res) => {
  const id = asObjectId(req.params.id, "product id");
  const product = await Product.findById(id);
  if (!product) throw new HttpError(404, "Product not found");

  const input = parseProductInput(req.body.product);
  const previousImages = productImages(product);
  const previousImageSet = new Set(previousImages);
  for (const image of productImages(input)) {
    if (!DATA_IMAGE_PATTERN.test(image) && !previousImageSet.has(image)) {
      throw new HttpError(400, "Product contains an unknown image");
    }
  }

  const uploadedImages = [];
  try {
    const stock = await materializeStock(input.stock, uploadedImages);
    product.set({ ...input, stock });
    await product.save();

    const retainedImages = new Set(productImages(product));
    await destroyProductImages(
      previousImages.filter((image) => !retainedImages.has(image)),
    );
    res.json(product);
  } catch (error) {
    await destroyProductImages(uploadedImages);
    throw error;
  }
}));

router.delete("/:id", auth.requireAdmin, asyncHandler(async (req, res) => {
  const id = asObjectId(req.params.id, "product id");
  const product = await Product.findById(id);
  if (!product) throw new HttpError(404, "Product not found");

  const images = productImages(product);
  await product.deleteOne();
  await destroyProductImages(images);
  res.status(204).end();
}));

router.put("/:id/review", auth.requireAuth, asyncHandler(async (req, res) => {
  const id = asObjectId(req.params.id, "product id");
  const reviewInput = parseReviewInput(req.body);
  const user = await User.findById(req.userId, "name email orders").lean();
  if (!user) throw new HttpError(401, "Authentication required");

  const purchased = await Order.exists({
    _id: { $in: user.orders || [] },
    "items._id": id,
  });
  if (!purchased) {
    throw new HttpError(403, "Purchase this product before reviewing it");
  }

  const product = await Product.findById(id);
  if (!product) throw new HttpError(404, "Product not found");
  const existing = product.reviews.find(
    (review) => String(review.user) === String(req.userId),
  );
  if (existing) {
    existing.set(reviewInput);
  } else {
    product.reviews.push({ user: req.userId, ...reviewInput });
  }
  await product.save();

  const saved = product.reviews.find(
    (review) => String(review.user) === String(req.userId),
  );
  res.json({
    ...saved.toObject(),
    user: undefined,
    userName: user.name,
    email: user.email,
  });
}));

router.delete("/:id/review", auth.requireAuth, asyncHandler(async (req, res) => {
  const id = asObjectId(req.params.id, "product id");
  const result = await Product.updateOne(
    { _id: id },
    { $pull: { reviews: { user: req.userId } } },
  );
  if (!result.matchedCount) throw new HttpError(404, "Product not found");
  res.status(204).end();
}));

router.get("/:catagory/:type", asyncHandler(async (req, res) => {
  const categories = categoryMatch(req.params.catagory, req.params.type);
  if (Object.keys(categories).length === 0) {
    return res.json({
      products: [],
      count: 0,
      filters: { colors: [], sizes: [] },
    });
  }
  const match = { ...categories, ...exclusions(req.query), ...stockMatch(req.query) };
  return res.json(await catalogResponse({
    match,
    query: req.query,
    sort: sortFrom(req.query, { createdAt: -1, _id: 1 }),
  }));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = asObjectId(req.params.id, "product id");
  const [product] = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    { $project: { ...listProjection, catagory: 1, type: 1 } },
  ]);
  if (!product) throw new HttpError(404, "Product not found");
  res.json(product);
}));

module.exports = router;
module.exports.helpers = {
  catalogResponse,
  categoryMatch,
  commaList,
  currentMonth,
  stockMatch,
};
