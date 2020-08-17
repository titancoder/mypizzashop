const Pizza = require("../models/pizza");
const createError = require("http-errors");
const { update } = require("../models/pizza");

exports.getAllPizzas = async (req, res) => {
	try {
		const allPizzas = await Pizza.find({});

		res.status(200).json({
			success: true,
			count: allPizzas.length,
			data: allPizzas,
		});
	} catch (err) {
		console.log(err.message);
	}
};

exports.addNewPizza = async (req, res, next) => {
	try {
		if (!req.body) {
			console.log("New Pizza could not be created");
			throw createError(400, "Bad Request");
		}
		const newPizza = await Pizza.create(req.body);

		if (!newPizza) {
			throw createError(400, "New Pizza could not be added");
		}
		res.status(200).json({
			success: true,
			data: newPizza,
		});
	} catch (err) {
		next(err);
	}
};

exports.editPizza = async (req, res, next) => {
	try {
		if (!req.params.id || !req.body) {
			console.log("Parameter ID and pizza details empty");
			throw createError(400, "Pizza could not be updated");
		}
		const updatedPizza = await Pizza.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		if (!updatedPizza) {
			console.log("Order could not be updated");
			throw createError(400, "Pizza could not be updated");
		}
		res.status(200).json({
			success: true,
			data: updatedPizza,
		});
	} catch (err) {
		next(err);
	}
};

exports.deletePizza = async (req, res) => {
	try {
		await Pizza.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

exports.getPizza = async (req, res) => {
	try {
		const pizza = await Pizza.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: pizza,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err,
		});
	}
};
