const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../controllers/authController");
const { uploadImage, resizeImage } = require("../utils/image-utility");

const {
	renderHomePage,
	loginUser,
	renderPizzaPage,
	createPizza,
	renderEditPizzaPage,
	updatePizza,
	deletePizza,
} = require("../controllers/viewController");

router.route("/").get(isLoggedIn, renderHomePage);

router.route("/login").post(loginUser);

router
	.route("/pizza")
	.get(isLoggedIn, renderPizzaPage)
	.post(isLoggedIn, uploadImage, resizeImage, createPizza);

router
	.route("/pizza/:id")
	.get(isLoggedIn, renderEditPizzaPage)
	.post(isLoggedIn, uploadImage, resizeImage, updatePizza);
router.route("/pizza/:id/del").get(isLoggedIn, deletePizza);

module.exports = router;
