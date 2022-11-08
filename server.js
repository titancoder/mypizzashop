require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const cookieParser = require("cookie-parser");
const pizzaRoutes = require("./routes/pizzaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const viewRoutes = require("./routes/viewRoutes");
const mongoose = require("mongoose");
const Order = require("./models/order");
const cors = require("cors");

app.use(cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* -------------------------------------------------------------------------- */
/*                                DB CONNECTION                               */
/* -------------------------------------------------------------------------- */

mongoose.connect("mongodb://localhost:27017/mypizzashop", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

/* -------------------------------------------------------------------------- */
/*                                MOUNT ROUTES                                */
/* -------------------------------------------------------------------------- */

app.use("/api/v1/pizza", pizzaRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/", viewRoutes);
app.post("/payments/status", async function (req, res) {
	console.log(req.body);
	const result = crypto
		.createHmac("sha256", process.env.RAZORPAY_SECRET)
		.update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`)
		.digest("hex");
	if (result === req.body.razorpay_signature) {
		const updatedOrder = await Order.findOneAndUpdate(
			{ gatewayOrderId: `${req.body.razorpay_order_id}` },
			{
				status: "success",
				gatewayPaymentId: req.body.razorpay_payment_id,
				gatewaySignature: req.body.razorpay_signature,
			}
		);
		res.status(200);
		res.redirect("http://localhost:3000/orders");
	}
});

app.use("*", (req, res) => {
	res.status(404).render("404");
});

// app.use((err, req, res, next) => {
// 	res.status(err.status || 500);
// 	res.send({
// 		error: {
// 			status: err.status || 500,
// 			message: err.message,
// 		},
// 	});
// });

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                   */
/* -------------------------------------------------------------------------- */

app.listen("3000", () => {
	//Server
	console.log("Listening on port 3000");
});
