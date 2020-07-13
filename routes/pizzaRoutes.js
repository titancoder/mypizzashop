const express = require("express");
const { authorize, restrict } = require("../controllers/authController");
const router = express.Router();

const { upload } = require("../utils/image-uploader");
// const multer = require("multer");
// const upload = multer({ dest: "./public/images/pizza" });

const {
	getAllPizzas,
	getPizza,
	addNewPizza,
	deletePizza,
	editPizza,
} = require("../controllers/pizzaController");

router
	.route("/")
	.get(getAllPizzas)
	.post(authorize, restrict, upload.single("photo"), addNewPizza);

router
	.route("/:id")
	.get(getPizza)
	.patch(upload.single("photo"), authorize, restrict, editPizza)
	.delete(authorize, restrict, deletePizza);

module.exports = router;
