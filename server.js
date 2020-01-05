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

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                   */
/* -------------------------------------------------------------------------- */

app.listen("3000", () => {
  console.log("Listening on port 3000");
});

const User = require("./models/user");

// Order.create(
//   {
//     order: [
//       {
//         "Super Pizza": 1,
//         onion: 1,
//         tomato: 1
//       },
//       {
//         "Super Pizza": 3,
//         onion: 1,
//         mushroom: 1
//       }
//     ],
//     amount: "400"
//   },
//   (err, docs) => {
//     console.log(docs);
//   }
// );
