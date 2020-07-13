const mongoose = require("mongoose");

const pizzaSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		hotness: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			// unique: true,
			default: "images/pizza.jpg",
		},
		category: {
			type: String,
			required: true,
			enum: ["veg", "non-veg"],
		},
		tag: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
