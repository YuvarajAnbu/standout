const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("./middleWares/auth");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const { clearAuthCookies, setAuthCookie } = require("../utils/cookies");
const { asBoolean, asEmail, asNonEmptyString, asObjectId } = require("../utils/validation");

const router = express.Router();
const hashRounds = Math.min(14, Math.max(10, Number(process.env.BCRYPT_ROUNDS) || 12));
const publicUserFields = "name email addresses phone type";

function serializeUser(user) {
  return {
    name: user.name,
    email: user.email,
    addresses: user.addresses || [],
    phone: user.phone || [],
    type: user.type,
  };
}

router.post("/signup", asyncHandler(async (req, res) => {
  const firstName = asNonEmptyString(req.body.firstName, "first name", { max: 80 });
  const lastName = asNonEmptyString(req.body.lastName, "last name", { max: 80 });
  const email = asEmail(req.body.email);
  const password = asNonEmptyString(req.body.password, "password", { max: 200 });
  if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters");

  try {
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash(password, hashRounds),
    });
    const token = await user.generateToken();
    setAuthCookie(res, token);
    res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    if (error?.code === 11000) throw new HttpError(409, "An account with this email already exists");
    throw error;
  }
}));

router.post("/login", asyncHandler(async (req, res) => {
  const email = asEmail(req.body.email);
  const password = asNonEmptyString(req.body.password, "password", { max: 200 });
  const user = await User.findOne({ email }).select(`+password +tokens ${publicUserFields}`);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = await user.generateToken();
  setAuthCookie(res, token);
  res.json({ user: serializeUser(user) });
}));

router.get("/authenticate", auth, asyncHandler(async (req, res) => {
  if (!req.userId) return res.json({ user: {} });

  const user = await User.findOne(
    { _id: req.userId, tokens: req.token },
    publicUserFields
  ).lean();
  if (!user) {
    clearAuthCookies(res);
    return res.json({ user: {} });
  }
  return res.json({ user: serializeUser(user) });
}));

router.put("/logout", auth.requireAuth, asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.userId }, { $pull: { tokens: req.token } });
  clearAuthCookies(res);
  res.json({ success: true });
}));

router.put("/logout-all", auth.requireAuth, asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.userId }, { $set: { tokens: [] } });
  clearAuthCookies(res);
  res.json({ success: true });
}));

router.get("/is-admin", auth.requireAdmin, (req, res) => res.json("admin"));

router.put("/update", auth.requireAuth, asyncHandler(async (req, res) => {
  const input = req.body.data;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new HttpError(400, "Invalid user data");
  }

  const update = {};
  if (input.name !== undefined) update.name = asNonEmptyString(input.name, "name", { max: 160 });
  if (input.email !== undefined) update.email = asEmail(input.email);
  if (input.password !== undefined) {
    const password = asNonEmptyString(input.password, "password", { max: 200 });
    if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters");
    update.password = await bcrypt.hash(password, hashRounds);
  }
  if (input.phone !== undefined) {
    if (!Array.isArray(input.phone) || input.phone.length > 5) throw new HttpError(400, "Invalid phone numbers");
    update.phone = input.phone.map((phone) => asNonEmptyString(phone, "phone", { max: 40 }));
  }
  if (input.addresses !== undefined) {
    if (!Array.isArray(input.addresses) || input.addresses.length > 10) throw new HttpError(400, "Invalid addresses");
    update.addresses = input.addresses;
  }
  if (Object.keys(update).length === 0) throw new HttpError(400, "No supported fields to update");

  try {
    await User.updateOne({ _id: req.userId }, { $set: update }, { runValidators: true });
  } catch (error) {
    if (error?.code === 11000) throw new HttpError(409, "An account with this email already exists");
    throw error;
  }
  res.json({ success: true });
}));

router.post("/check-user", auth.requireAuth, asyncHandler(async (req, res) => {
  const password = asNonEmptyString(req.body.password, "password", { max: 200 });
  const user = await User.findById(req.userId).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, "Invalid password");
  }
  res.json({ valid: true });
}));

router.get("/orders", auth.requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId, "orders").lean();
  if (!user) throw new HttpError(404, "User not found");
  const orders = await Order.find(
    { _id: { $in: user.orders } },
    "items delivered amount shippingAddress billingAddress customer date"
  ).sort({ date: -1 }).lean();
  res.json(orders);
}));

router.get("/guest-order", asyncHandler(async (req, res) => {
  const orderId = asObjectId(req.query.orderId, "order id");
  const order = await Order.findById(
    orderId,
    "items delivered amount shippingAddress billingAddress customer date"
  ).lean();
  if (!order) throw new HttpError(404, "Order not found");
  res.json(order);
}));

router.get("/delivered/:id", auth.requireAdmin, asyncHandler(async (req, res) => {
  const order = await Order.findById(asObjectId(req.params.id, "order id"), "delivered").lean();
  if (!order) throw new HttpError(404, "Order not found");
  res.json(order);
}));

router.put("/order", auth.requireAdmin, asyncHandler(async (req, res) => {
  const order = req.body.order;
  if (!order || typeof order !== "object") throw new HttpError(400, "Invalid order");
  const updated = await Order.findByIdAndUpdate(
    asObjectId(order._id, "order id"),
    { $set: { delivered: asBoolean(order.delivered, "delivered") } },
    { new: true, runValidators: true }
  ).select("delivered").lean();
  if (!updated) throw new HttpError(404, "Order not found");
  res.json(updated);
}));

module.exports = router;
