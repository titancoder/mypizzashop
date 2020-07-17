const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../controllers/authController");
const { uploadImage, resizeImage } = require("../utils/image-utility");

const {
	renderHomePage,
	loginUser,
	signUpUser,
	renderPizzaPage,
	createPizza,
	renderEditPizzaPage,
	updatePizza,
	deletePizza,
	placeOrder,
	renderOrdersPage,
	renderOrderDetailPage,
	renderCartPage,
	renderProfilePage,
	renderUsersPage,
	renderEditProfilePage,
	updateUser,
} = require("../controllers/viewController");

router.route("/").get(isLoggedIn, renderHomePage);

router.route("/login").post(loginUser);
router.route("/signup").post(signUpUser);

router
	.route("/pizza")
	.get(isLoggedIn, renderPizzaPage)
	.post(isLoggedIn, uploadImage, resizeImage, createPizza);

router
	.route("/pizza/:id")
	.get(isLoggedIn, renderEditPizzaPage)
	.post(isLoggedIn, uploadImage, resizeImage, updatePizza);
router.route("/pizza/:id/del").get(isLoggedIn, deletePizza);

router.route("/cart").get(isLoggedIn, renderCartPage);
router
	.route("/orders")
	.get(isLoggedIn, renderOrdersPage)
	.post(isLoggedIn, placeOrder);
router.route("/orders/:id").get(isLoggedIn, renderOrderDetailPage);
router.route("/profile").get(isLoggedIn, renderProfilePage);
router.route("/users").get(isLoggedIn, renderUsersPage);
router
	.route("/users/:id")
	.get(isLoggedIn, renderEditProfilePage)
	.post(isLoggedIn, uploadImage, resizeImage, updateUser);

module.exports = router;
