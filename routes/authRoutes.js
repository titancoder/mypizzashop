const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  forgotPassword
} = require("../controllers/authController");

router.route("/signup").get(signUp);

router.route("/login").get(login);

router.route("/forgotpassword").get(forgotPassword);

module.exports = router;
