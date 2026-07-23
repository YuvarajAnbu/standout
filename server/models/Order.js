const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  extendedAddress: { type: String, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  locality: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  region: { type: String, trim: true },
  streetAddress: { type: String, trim: true },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  color: String,
  size: String,
  image: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  transactionId: { type: String, required: true, unique: true, sparse: true },
  amount: { type: Number, required: true, min: 0 },
  customer: {
    firstName: String,
    lastName: String,
    email: String,
  },
  delivered: { type: Boolean, default: false, index: true },
  date: { type: Date, default: Date.now, index: true },
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
