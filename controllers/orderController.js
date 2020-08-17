const Order = require("../models/order");
const createError = require("http-errors");

exports.getAllOrders = async (req, res, next) => {
	try {
		const query = {};

		if (!req.role || req.role === "delta") {
			query.orderedBy = req.user;
		}
		const allOrders = await Order.find(query);
		res.status(200).json({
			success: true,
			count: allOrders.length,
			data: allOrders,
		});
	} catch (err) {
		console.log(err.message);
	}
};

exports.addNewOrder = async (req, res, next) => {
	try {
		if (!req.body) {
			throw createError(400, "Order could not be processed");
		}

		const newOrder = await Order.create(req.body);

		if (!newOrder) {
			console.log("New order creation problem");
			throw createError(500, "Something went wrong");
		}
		res.status(200).json({
			success: true,
			data: newOrder,
		});
	} catch (err) {
		next(err);
	}
};

exports.editOrder = async (req, res, next) => {
	try {
		if (!req.params.id || !req.body) {
			console.log("Parameter ID and order body empty");
			throw createError(400, "Order could not be updated");
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		if (!updatedOrder) {
			console.log("Order could not be updated");
			throw createError(400, "Order could not be updated");
		}

		res.status(200).json({
			success: true,
			data: updatedOrder,
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteOrder = async (req, res, next) => {
	try {
		if (!req.params.id) {
			console.log("Order ID not given");
			throw createError(400, "Bad Request");
		}
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch {
		next(err);
	}
};

exports.getOrder = async (req, res, next) => {
	try {
		if (!req.params.id) {
			throw createError(404, "Order ID not found");
		}
		const order = await Order.findById(req.params.id);

		if (!order) {
			throw createError(404, "Order not found");
		}

		res.status(200).json({
			success: true,
			data: order,
		});
	} catch (err) {
		next(err);
	}
};
