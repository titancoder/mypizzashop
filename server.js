const express = require("express");
const app = express();
const pizzaRoutes = require("./routes/pizzaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const toppingRoutes = require("./routes/toppingRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/pizza", pizzaRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/toppings", toppingRoutes);
app.use("/orders", orderRoutes);

app.listen("3000", () => {
  console.log("Listening on port 3000");
});
