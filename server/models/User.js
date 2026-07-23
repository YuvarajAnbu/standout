const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  type: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  phone: [{ type: String, trim: true }],
  addresses: [
    {
      extendedAddress: String,
      firstName: String,
      lastName: String,
      locality: String,
      postalCode: String,
      region: String,
      streetAddress: String,
    },
  ],
  tokens: { type: [String], select: false, default: [] },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
}, { timestamps: true });

UserSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  this.tokens = this.tokens.concat(token).slice(-5);
  await this.save();
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
