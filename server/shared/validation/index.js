const mongoose = require("mongoose");
const HttpError = require("#shared/errors/HttpError");

function asNonEmptyString(value, field, { max = 255 } = {}) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new HttpError(400, `Invalid ${field}`);
  }
  return value.trim();
}

function asEmail(value) {
  const email = asNonEmptyString(value, "email", { max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Invalid email");
  }
  return email;
}

function asObjectId(value, field = "id") {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new HttpError(400, `Invalid ${field}`);
  }
  return value;
}

function asBoolean(value, field) {
  if (typeof value !== "boolean") {
    throw new HttpError(400, `Invalid ${field}`);
  }
  return value;
}

function pagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { asBoolean, asEmail, asNonEmptyString, asObjectId, pagination };
