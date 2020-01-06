const mongoose = require("mongoose");

const pizzaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    hotness: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      unique: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Veg", "Non-Veg"]
    },
    tag: {
      type: String,
      trim: true
    },
    toppings: [String],
    totalOrders: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
