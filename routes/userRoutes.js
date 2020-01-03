const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  addNewUser,
  deleteUser,
  editUser
} = require("../controllers/userController");

router
  .route("/")
  .get(getAllUsers)
  .post(addNewUser);

router
  .route("/:id")
  .get(getUser)
  .patch(editUser)
  .delete(deleteUser);

module.exports = router;
