const axios = require("axios");

exports.renderHomePage = async (req, res) => {
	const { data } = await axios.get("http://localhost:3000/api/v1/pizza");

	res.render("home", { pizzaData: data.data });
};

exports.loginUser = (req, res) => {
	console.log(req.body);
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

exports.createPizza = async (req, res) => {
	//const { data } = await axios.get("http://localhost:3000/api/v1/pizza");

	res.render("create-pizza");
};
