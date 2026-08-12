const mongoose = require("mongoose");
const HttpError = require("#shared/errors/HttpError");
const { asNonEmptyString } = require("#shared/validation/index");

const DATA_IMAGE_PATTERN =
  /^data:image\/(?:jpeg|png|webp|avif);base64,[a-z0-9+/=\s]+$/i;
const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const CATEGORIES = new Set(["women", "men", "both"]);

function asPrice(value) {
  const price = Number(value);
  if (!Number.isSafeInteger(price) || price < 0 || price > 100_000_000) {
    throw new HttpError(400, "Invalid price");
  }
  return price;
}

function asImages(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) {
    throw new HttpError(400, "Each stock item needs between 1 and 8 images");
  }

  return value.map((image) => {
    if (typeof image !== "string" || image.length > 8 * 1024 * 1024) {
      throw new HttpError(400, "Invalid product image");
    }
    const trimmed = image.trim();
    if (!DATA_IMAGE_PATTERN.test(trimmed) && !/^[a-z0-9_./-]{1,500}$/i.test(trimmed)) {
      throw new HttpError(400, "Invalid product image");
    }
    return trimmed;
  });
}

function asStock(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) {
    throw new HttpError(400, "A product needs between 1 and 20 stock items");
  }

  return value.map((stock) => {
    if (!stock || typeof stock !== "object" || !COLOR_PATTERN.test(stock.color)) {
      throw new HttpError(400, "Invalid stock color");
    }
    if (
      !Array.isArray(stock.sizeRemaining) ||
      stock.sizeRemaining.length < 1 ||
      stock.sizeRemaining.length > 30
    ) {
      throw new HttpError(400, "Invalid product sizes");
    }

    const sizeRemaining = stock.sizeRemaining.map((entry) => {
      const size = asNonEmptyString(entry?.size, "size", { max: 30 }).toLowerCase();
      const remaining = Number(entry?.remaining);
      if (!Number.isSafeInteger(remaining) || remaining < 0 || remaining > 1_000_000) {
        throw new HttpError(400, "Invalid remaining stock");
      }
      return { size, remaining };
    });

    const parsed = {
      color: stock.color.toLowerCase(),
      images: asImages(stock.images),
      sizeRemaining,
    };
    if (stock._id !== undefined && stock._id !== "") {
      if (!mongoose.isObjectIdOrHexString(stock._id)) {
        throw new HttpError(400, "Invalid stock id");
      }
      parsed._id = stock._id;
    }
    return parsed;
  });
}

function parseProductInput(value) {
  if (!value || typeof value !== "object") {
    throw new HttpError(400, "Invalid product");
  }
  const catagory = asNonEmptyString(value.catagory, "category", {
    max: 20,
  }).toLowerCase();
  if (!CATEGORIES.has(catagory)) {
    throw new HttpError(400, "Invalid category");
  }

  return {
    name: asNonEmptyString(value.name, "product name", { max: 200 }),
    price: asPrice(value.price),
    catagory,
    type: asNonEmptyString(value.type, "product type", {
      max: 100,
    }).toLowerCase(),
    stock: asStock(value.stock),
  };
}

function parseReviewInput(value) {
  const rating = Number(value?.rating);
  if (
    !Number.isFinite(rating) ||
    rating < 1 ||
    rating > 5 ||
    rating * 2 !== Math.round(rating * 2)
  ) {
    throw new HttpError(400, "Rating must be between 1 and 5 in half-star steps");
  }
  return {
    rating,
    review: asNonEmptyString(value?.review, "review", { max: 2_000 }),
  };
}

module.exports = {
  DATA_IMAGE_PATTERN,
  parseProductInput,
  parseReviewInput,
};
