const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  catagory: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: String,
    trim: true,
  },
  stock: [
    {
      images: [String],
      color: String,
      sizeRemaining: [
        {
          size: {
            type: String,
            lowercase: true,
          },

          remaining: Number,
        },
      ],
    },
  ],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      review: {
        type: String,
        trim: true,
      },
    },
  ],
  sales: {
    type: Number,
    default: 0,
    min: 0,
  },
  salesPerMonth: [
    {
      sales: {
        type: Number,
        default: 0,
      },
      month: { type: Number, default: 0 },
    },
  ],
}, { timestamps: { createdAt: false, updatedAt: true } });

productSchema.index({ catagory: 1, type: 1, createdAt: -1 });
productSchema.index({ sales: -1 });
productSchema.index({ "salesPerMonth.month": 1, "salesPerMonth.sales": -1 });
productSchema.index({ "stock.color": 1 });
productSchema.index({ "stock.sizeRemaining.size": 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
