const axios = require("axios");

const fs = require("fs");
const path = require("path");

exports.renderHomePage = async (req, res) => {
	const { data } = await axios.get("http://localhost:3000/api/v1/pizza");

	res.render("home", { pizzaData: data.data });
};

exports.loginUser = (req, res) => {
	axios
		.post("http://localhost:3000/api/v1/auth/login", req.body)
		.then(({ data }) => {
			res.cookie("jwt", data.token, {
				maxAge: 30 * 60 * 1000,
			});
			res.redirect("/");
		})
		.catch((err) => console.log(err.message));
};

exports.renderPizzaPage = (req, res) => {
	console.log(req.role);
	if (!req.role || req.role === "delta") {
		//console.log("yoyo");
		res.redirect("/");
	}
	res.render("create-pizza");
};

exports.createPizza = async (req, res) => {
	axios
		.post("http://localhost:3000/api/v1/pizza", req.body, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		})
		.then(({ data }) => {
			res.redirect("/");
		})
		.catch((err) => console.log(err.message));
};

exports.renderEditPizzaPage = async (req, res) => {
	const id = req.params.id;
	// console.log(id);
	try {
		const { data } = await axios.get(
			`http://localhost:3000/api/v1/pizza/${id}`
		);
		res.render("edit-pizza", { pizza: data.data });
	} catch (err) {
		console.log(err.message);
	}
};

exports.updatePizza = async (req, res) => {
	const id = req.params.id;
	await axios
		.patch(`http://localhost:3000/api/v1/pizza/${id}`, req.body, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		})
		.then(({ data }) => {
			res.redirect("/");
		})
		.catch((err) => console.log(err.message));
};

exports.deletePizza = async (req, res) => {
	const id = req.params.id;
	await axios
		.delete(`http://localhost:3000/api/v1/pizza/${id}`, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		})
		.then(({ data }) => {
			res.redirect("/");
		})
		.catch((err) => console.log(err.message));
};
