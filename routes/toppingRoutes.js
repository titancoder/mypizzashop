const express = require("express");
const router = express.Router();

const {
  getAllToppings,
  getTopping,
  addNewTopping,
  deleteTopping,
  editTopping
} = require("../controllers/toppingController");

router
  .route("/")
  .get(getAllToppings)
  .post(addNewTopping);

router
  .route("/:id")
  .get(getTopping)
  .patch(editTopping)
  .delete(deleteTopping);

module.exports = router;
