const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true
    },
    address: {
      type: String,
      required: [true, "Please enter your address"]
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm your password"],
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
    passwordResetExpiresAt: {
      type: Date,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"]
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
