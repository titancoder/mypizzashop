const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../controllers/authController");

const {
	renderHomePage,
	loginUser,
	createPizza,
} = require("../controllers/viewController");

router.route("/").get(isLoggedIn, renderHomePage);

router.route("/login").post(loginUser);

router.route("/pizza").get(isLoggedIn, createPizza);

module.exports = router;
