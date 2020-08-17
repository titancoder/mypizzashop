const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			trim: true,
			unique: true,
		},

		password: {
			type: String,
			required: [true, "Please enter a password"],
			select: false,
		},
		image: {
			type: String,
			// unique: true,
			default: "/images/thumbnails/_t5065548f1fed45385254b6545c0d.jpg",
		},

		resetToken: {
			type: String,
			select: false,
		},
		hashedResetToken: {
			type: String,
			select: false,
		},
		passwordUpdatedAt: {
			type: Date,
			select: false,
		},
		passwordResetExpiresAt: {
			type: Date,
			select: false,
		},
		role: {
			type: String,
			enum: ["alpha", "delta"],
			select: false,
			default: "delta",
		},
		orders: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
