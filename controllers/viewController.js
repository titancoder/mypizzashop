const axios = require("axios");

exports.renderHomePage = async (req, res) => {
	const { data } = await axios.get("http://localhost:3000/api/v1/pizza");
	res.render("home", { pizzaData: data.data });
};
