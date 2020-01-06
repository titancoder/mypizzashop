const express = require("express");
const { authorize, restrict } = require("../controllers/authController");
const router = express.Router();

const {
  getAllPizzas,
  getPizza,
  addNewPizza,
  deletePizza,
  editPizza
} = require("../controllers/pizzaController");

router
  .route("/")
  .get(getAllPizzas)
  .post(authorize, restrict, addNewPizza);

router
  .route("/:id")
  .get(getPizza)
  .patch(authorize, restrict, editPizza)
  .delete(authorize, restrict, deletePizza);

module.exports = router;
