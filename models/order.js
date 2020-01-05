const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    order: [{}],
    amount: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
