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
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "user",
  },
  phone: [],
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
  tokens: [String],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat(token);
  await this.save();
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
