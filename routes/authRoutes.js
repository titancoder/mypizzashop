const express = require("express");
const router = express.Router();

const {
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword").post(resetPassword);

module.exports = router;
