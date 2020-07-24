const axios = require("axios");
const Razorpay = require("razorpay");

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

exports.signUpUser = (req, res) => {
	axios
		.post("http://localhost:3000/api/v1/users/signup", req.body)
		.then(({ data }) => {
			res.cookie("jwt", data.token, {
				maxAge: 30 * 60 * 1000,
			});
			res.redirect("/");
		})
		.catch((err) => console.log(err.message));
};

exports.renderPizzaPage = (req, res) => {
	if (!req.user || req.user.role === "delta") {
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

exports.placeOrder = async (req, res, next) => {
	const instance = new Razorpay({
		key_id: process.env.RAZORPAY_ID,
		key_secret: process.env.RAZORPAY_SECRET,
	});
	const options = {
		amount: `${req.body.amount * 100}`, // amount in the smallest currency unit
		currency: "INR",
		receipt: "receipt_177",
		payment_capture: "0",
	};
	const orderData = await instance.orders.create(options);
	console.log(orderData);

	req.body.orderedBy = req.user;
	req.body.gatewayOrderId = orderData.id;
	req.body.status = orderData.status;
	await axios
		.post(`http://localhost:3000/api/v1/orders`, req.body, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		})
		.then(({ data }) => {
			res.render("payment", { orderData: orderData });
		})
		.catch((err) => console.log(err.message));
};

exports.renderOrdersPage = async (req, res) => {
	try {
		const { data } = await axios.get(`http://localhost:3000/api/v1/orders`, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		});

		data.data.forEach((order) => {
			order.createdAt = new Date(order.createdAt).toLocaleDateString("de-DE");
		});

		res.render("orders", { data: data.data });
	} catch (err) {
		console.log(err.message);
	}
};
exports.renderOrderDetailPage = async (req, res) => {
	const id = req.params.id;

	try {
		const { data } = await axios.get(
			`http://localhost:3000/api/v1/orders/${id}`,
			{
				headers: {
					Cookie: `${req.cookies.jwt}`,
				},
			}
		);
		console.log(data);

		res.render("order-detail", { data: data.data });
	} catch (err) {
		console.log(err.message);
	}
};

exports.renderCartPage = (req, res) => {
	res.render("cart", { role: req.user ? req.user.role : "" });
};

exports.renderProfilePage = (req, res) => {
	res.render("profile", { data: req.user });
};

exports.renderUsersPage = async (req, res) => {
	try {
		const { data } = await axios.get(`http://localhost:3000/api/v1/users`, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		});

		res.render("users", { data: data.data });
	} catch (err) {
		console.log(err.message);
	}
};

exports.renderEditProfilePage = async (req, res) => {
	const id = req.params.id;

	try {
		const { data } = await axios.get(
			`http://localhost:3000/api/v1/users/${id}`,
			{
				headers: {
					Cookie: `${req.cookies.jwt}`,
				},
			}
		);
		res.render("edit-profile", { data: data.data });
	} catch (err) {
		console.log(err.message);
	}
};

exports.updateUser = async (req, res) => {
	const id = req.params.id;

	await axios
		.patch(`http://localhost:3000/api/v1/users/${id}`, req.body, {
			headers: {
				Cookie: `${req.cookies.jwt}`,
			},
		})
		.then(({ data }) => {
			res.redirect(`/users/${id}`);
		})
		.catch((err) => console.log(err.message));
};

exports.renderForgotPassword = async (req, res) => {
	console.log(req.body);
	await axios
		.post(`http://localhost:3000/api/v1/auth/forgotpassword`, req.body)
		.then(({ data }) => {
			res.redirect(`/`);
		})
		.catch((err) => console.log(err.message));
};

exports.renderResetPassword = async (req, res) => {
	console.log(req.params.token);

	const token = encodeURIComponent(req.params.token);
	res.render("reset-password", { token: token });

	// await axios
	// 	.post(`http://localhost:3000/api/v1/auth/forgotpassword`, req.body)
	// 	.then(({ data }) => {
	// 		res.redirect(`/`);
	// 	})
	// 	.catch((err) => console.log(err.message));
};

exports.resetPassword = async (req, res) => {
	req.body.token = req.params.token;

	await axios
		.patch(`http://localhost:3000/api/v1/auth/resetpassword`, req.body)
		.then(({ data }) => {
			res.redirect(`/`);
		})
		.catch((err) => console.log(err.message));
};
