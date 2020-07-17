const express = require("express");
const router = express.Router();
const {
	authorize,
	restrict,
	partialRestrict,
} = require("../controllers/authController");

const {
	getAllUsers,
	getUser,
	signUp,
	deleteUser,
	editUser,
} = require("../controllers/userController");

router.route("/").get(authorize, restrict, getAllUsers);

router.route("/signup").post(signUp);
router
	.route("/:id")
	.get(authorize, partialRestrict, getUser)
	.patch(authorize, partialRestrict, editUser)
	.delete(authorize, partialRestrict, deleteUser);

module.exports = router;
