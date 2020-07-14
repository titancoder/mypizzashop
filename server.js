const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const cookieParser = require("cookie-parser");
const pizzaRoutes = require("./routes/pizzaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const toppingRoutes = require("./routes/toppingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const viewRoutes = require("./routes/viewRoutes");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public", { maxAge: 3600000 }));
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
/*                                 MIDDLEWARES                                */
/* -------------------------------------------------------------------------- */

//app.use(bodyParser.urlencoded({ extended: false }));

/* -------------------------------------------------------------------------- */
/*                                MOUNT ROUTES                                */
/* -------------------------------------------------------------------------- */

app.use("/api/v1/pizza", pizzaRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/toppings", toppingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/", viewRoutes);

// app.post("/test", upload.single("photo"), (req, res) => {
// 	console.log(req.body);
// 	console.log(req.file);
// });

// app.use((err, req, res, next) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                   */
/* -------------------------------------------------------------------------- */

app.listen("3000", () => {
	console.log("Listening on port 3000");
});
