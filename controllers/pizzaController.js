const Pizza = require("../models/pizza");

/* -------------------------------------------------------------------------- */
/*                                GET ALL PIZZAS                              */
/* -------------------------------------------------------------------------- */
// Method    GET
// Endpoint  /pizza

/*-------------*
|GENERAL ACCESS|
*--------------*/

exports.getAllPizzas = async (req, res) => {
	const allPizzas = await Pizza.find({});
	try {
		res.status(200).json({
			success: true,
			count: allPizzas.length,
			data: allPizzas,
		});
	} catch (err) {
		console.log(err.message);
	}
};

/* -------------------------------------------------------------------------- */
/*                              CREATE NEW PIZZA                              */
/* -------------------------------------------------------------------------- */
//Method    POST
//Endpoint  /pizza

/*-------*
|RESTRICT|
*--------*/

exports.addNewPizza = async (req, res) => {
	try {
		const newPizza = await Pizza.create(req.body);
		res.status(200).json({
			success: true,
			data: newPizza,
		});
	} catch (err) {
		console.log(err.message);
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

/* -------------------------------------------------------------------------- */
/*                                UPDATE PIZZA                                */
/* -------------------------------------------------------------------------- */

//Method    PATCH
//Endpoint  /pizza/:id

/*-------*
|RESTRICT|
*--------*/

exports.editPizza = async (req, res) => {
	try {
		const updatedPizza = await Pizza.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json({
			success: true,
			data: updatedPizza,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

/* -------------------------------------------------------------------------- */
/*                                DELETE PIZZA                                */
/* -------------------------------------------------------------------------- */
//Method    DELETE
//Endpoint  /pizza/:id

/*-------*
|RESTRICT|
*--------*/

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

/* -------------------------------------------------------------------------- */
/*                          GET SINGLE PIZZA DETAILS                          */
/* -------------------------------------------------------------------------- */
//Method    GET
//Endpoint  /pizza/:id

/*-------------*
|GENERAL ACCESS|
*--------------*/

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
