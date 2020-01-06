const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    order: [{}],
    amount: Number,
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
