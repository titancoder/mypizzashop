const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      select: false
    },
    resetToken: {
      type: String,
      select: false
    },
    resetHashedPassword: {
      type: String,
      select: false
    },
    passwordUpdatedAt: {
      type: Date,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      select: false
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
