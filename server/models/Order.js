const mongoose = require("mongoose");
const { transaction } = require("../config/braintree");

const orderSchema = new mongoose.Schema({
  items: [{}],
  transactionId: String,
  amount: Number,
  customer: {
    firstName: String,
    lastName: String,
    email: String,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    extendedAddress: String,
    firstName: String,
    lastName: String,
    locality: String,
    postalCode: String,
    region: String,
    streetAddress: String,
  },
  billingAddress: {
    extendedAddress: String,
    firstName: String,
    lastName: String,
    locality: String,
    postalCode: String,
    region: String,
    streetAddress: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
