const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const pizzaRoutes = require("./routes/pizzaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const toppingRoutes = require("./routes/toppingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const mongoose = require("mongoose");

/* -------------------------------------------------------------------------- */
/*                                DB CONNECTION                               */
/* -------------------------------------------------------------------------- */

mongoose.connect("mongodb://localhost:27017/mypizzashop", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

/* -------------------------------------------------------------------------- */
/*                                 MIDDLEWARES                                */
/* -------------------------------------------------------------------------- */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* -------------------------------------------------------------------------- */
/*                                MOUNT ROUTES                                */
/* -------------------------------------------------------------------------- */

app.use("/pizza", pizzaRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/toppings", toppingRoutes);
app.use("/orders", orderRoutes);

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
