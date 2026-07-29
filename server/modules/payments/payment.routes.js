const express = require("express");
const gateway = require("#infrastructure/payments/braintree");
const Product = require("#modules/catalog/product.model");
const Order = require("#modules/orders/order.model");
const User = require("#modules/users/user.model");
const auth = require("#modules/auth/auth.middleware");
const asyncHandler = require("#shared/http/asyncHandler");
const HttpError = require("#shared/errors/HttpError");
const { asObjectId } = require("#shared/validation/index");

const router = express.Router();
const TAX_RATE = 0.02;

function createClientToken() {
  return new Promise((resolve, reject) => {
    gateway.clientToken.generate({}, (error, response) => {
      if (error) reject(error);
      else resolve(response.clientToken);
    });
  });
}

function sanitizeAddress(address = {}) {
  const allowed = ["extendedAddress", "firstName", "lastName", "locality", "postalCode", "region", "streetAddress"];
  return Object.fromEntries(
    allowed
      .filter((key) => typeof address[key] === "string")
      .map((key) => [key, address[key].trim().slice(0, 255)])
  );
}

async function priceCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 100) {
    throw new HttpError(400, "Cart must contain between 1 and 100 items");
  }

  const requested = cart.map((item) => ({
    id: asObjectId(item._id, "product id"),
    quantity: Number.parseInt(item.quantity, 10),
    color: typeof item.color === "string" ? item.color : "",
    size: typeof item.size === "string" ? item.size : "",
    image: typeof item.image === "string" ? item.image : "",
  }));
  if (requested.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
    throw new HttpError(400, "Invalid item quantity");
  }

  const products = await Product.find(
    { _id: { $in: requested.map((item) => item.id) } },
    "name price stock"
  ).lean();
  const byId = new Map(products.map((product) => [String(product._id), product]));

  let subtotalCents = 0;
  const items = requested.map((item) => {
    const product = byId.get(String(item.id));
    if (!product) throw new HttpError(400, "A cart item is no longer available");
    const stock = product.stock.find((entry) => entry.color === item.color);
    const size = stock?.sizeRemaining.find((entry) => entry.size === item.size);
    if (!size || size.remaining < item.quantity) {
      throw new HttpError(409, `${product.name} does not have enough stock`);
    }
    subtotalCents += product.price * item.quantity;
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image: stock?.images?.includes(item.image) ? item.image : stock?.images?.[0],
    };
  });

  return {
    items,
    subtotalCents,
    totalCents: subtotalCents + Math.round(subtotalCents * TAX_RATE),
  };
}

async function recordOrder({ pricedCart, transaction, userId }) {
  const order = await Order.create({
    items: pricedCart.items,
    transactionId: transaction.id,
    customer: transaction.customer,
    amount: Number(transaction.amount),
    shippingAddress: transaction.shipping,
    billingAddress: transaction.billing || transaction.shipping,
  });

  const month = Number(`${new Date().getUTCFullYear()}${new Date().getUTCMonth() + 1}`);
  await Promise.all(pricedCart.items.map((item) => Product.updateOne(
    {
      _id: item._id,
      stock: { $elemMatch: { color: item.color, sizeRemaining: { $elemMatch: { size: item.size, remaining: { $gte: item.quantity } } } } },
    },
    {
      $inc: {
        sales: item.quantity,
        "stock.$[stock].sizeRemaining.$[size].remaining": -item.quantity,
      },
    },
    { arrayFilters: [{ "stock.color": item.color }, { "size.size": item.size }] }
  )));

  await Promise.all(pricedCart.items.map(async (item) => {
    const updated = await Product.updateOne(
      { _id: item._id, "salesPerMonth.month": month },
      { $inc: { "salesPerMonth.$.sales": item.quantity } }
    );
    if (updated.matchedCount === 0) {
      await Product.updateOne(
        { _id: item._id, "salesPerMonth.month": { $ne: month } },
        { $push: { salesPerMonth: { month, sales: item.quantity } } }
      );
    }
  }));

  if (userId) await User.updateOne({ _id: userId }, { $addToSet: { orders: order._id } });
  return order;
}

router.get("/client_token", auth, asyncHandler(async (req, res) => {
  try {
    res.type("text/plain").send(await createClientToken());
  } catch (error) {
    throw new HttpError(503, "Payment provider is unavailable", error.message);
  }
}));

router.post("/checkout", auth, asyncHandler(async (req, res) => {
  const nonce = req.body.payload?.nonce;
  if (typeof nonce !== "string" || !nonce) throw new HttpError(400, "Missing payment nonce");
  const pricedCart = await priceCart(req.body.cart);
  const details = req.body.billingDetails || {};
  const shipping = sanitizeAddress(details.address?.shipping);
  const billing = sanitizeAddress(details.address?.billing || details.address?.shipping);

  const result = await gateway.transaction.sale({
    amount: (pricedCart.totalCents / 100).toFixed(2),
    paymentMethodNonce: nonce,
    options: { submitForSettlement: true },
    customer: details.user,
    shipping: { ...shipping, countryCodeAlpha2: "US" },
    billing: { ...billing, countryCodeAlpha2: "US" },
  });
  if (!result.success) throw new HttpError(402, result.message || "Payment was declined");

  const order = await recordOrder({ pricedCart, transaction: result.transaction, userId: req.userId });
  res.status(201).json({ order });
}));

router.post("/paypal", auth, asyncHandler(async (req, res) => {
  const payload = req.body.payload;
  if (typeof payload?.nonce !== "string" || !payload.nonce) throw new HttpError(400, "Missing payment nonce");
  const pricedCart = await priceCart(req.body.cart);
  const paypalAddress = payload.details?.shippingAddress || {};
  const address = sanitizeAddress({
    firstName: payload.details?.firstName,
    lastName: payload.details?.lastName,
    locality: paypalAddress.city,
    postalCode: paypalAddress.postalCode,
    region: paypalAddress.state,
    streetAddress: paypalAddress.line1,
    extendedAddress: paypalAddress.line2,
  });

  const result = await gateway.transaction.sale({
    amount: (pricedCart.totalCents / 100).toFixed(2),
    paymentMethodNonce: payload.nonce,
    options: { submitForSettlement: true },
    shipping: address,
    customer: {
      firstName: payload.details?.firstName,
      lastName: payload.details?.lastName,
      email: payload.details?.email,
    },
  });
  if (!result.success) throw new HttpError(402, result.message || "Payment was declined");

  const order = await recordOrder({ pricedCart, transaction: result.transaction, userId: req.userId });
  res.status(201).json({ order });
}));

module.exports = router;
module.exports.priceCart = priceCart;
