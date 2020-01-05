const express = require("express");
const { authorize } = require("../controllers/authController");
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
  .get(authorize, getAllPizzas)
  .post(addNewPizza);

router
  .route("/:id")
  .get(getPizza)
  .patch(editPizza)
  .delete(deletePizza);

module.exports = router;
