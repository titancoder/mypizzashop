const express = require("express");
const router = express.Router();
const { authorize, restrict } = require("../controllers/authController");

const {
  getAllUsers,
  getUser,
  signUp,
  deleteUser,
  editUser
} = require("../controllers/userController");

router.route("/").get(authorize, restrict, getAllUsers);

router.route("/signup").post(signUp);
router
  .route("/:id")
  .get(authorize, getUser)
  .patch(authorize, editUser)
  .delete(authorize, deleteUser);

module.exports = router;
