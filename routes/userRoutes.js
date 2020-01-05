const express = require("express");
const router = express.Router();
const { authorize } = require("../controllers/authController");

const {
  getAllUsers,
  getUser,
  signUp,
  deleteUser,
  editUser
} = require("../controllers/userController");

router.route("/").get(authorize, getAllUsers);

router.route("/signup").post(signUp);
router
  .route("/:id")
  .get(getUser)
  .patch(editUser)
  .delete(deleteUser);

module.exports = router;
