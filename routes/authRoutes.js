const express = require("express");
const router = express.Router();

const { login, forgotPassword } = require("../controllers/authController");

router.route("/login").post(login);

router.route("/forgotpassword").get(forgotPassword);

module.exports = router;
