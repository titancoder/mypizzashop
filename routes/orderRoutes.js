const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrder,
  addNewOrder,
  deleteOrder,
  editOrder
} = require("../controllers/orderController");

router
  .route("/")
  .get(getAllOrders)
  .post(addNewOrder);

router
  .route("/:id")
  .get(getOrder)
  .patch(editOrder)
  .delete(deleteOrder);

module.exports = router;
