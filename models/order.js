const mongoose = require("mongoose");
const { strategy } = require("sharp");

const orderSchema = mongoose.Schema(
	{
		order: [{}],
		amount: Number,
		orderedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		gatewayOrderId: String,
		status: String,
		gatewayPaymentId: String,
		gatewaySignature: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
