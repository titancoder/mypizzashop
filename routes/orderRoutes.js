const express = require("express");
const router = express.Router();
const {
  authorize,
  restrict,
  partialRestrict
} = require("../controllers/authController");

const {
  getAllOrders,
  getOrder,
  addNewOrder,
  deleteOrder,
  editOrder
} = require("../controllers/orderController");

router
  .route("/")
  .get(authorize, partialRestrict, getAllOrders)
  .post(authorize, addNewOrder);

router
  .route("/:id")
  .get(authorize, getOrder)
  .patch(authorize, editOrder)
  .delete(authorize, restrict, deleteOrder);

module.exports = router;
