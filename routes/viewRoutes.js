const express = require("express");
const router = express.Router();

const { renderHomePage } = require("../controllers/viewController");

router.route("/").get(renderHomePage);

module.exports = router;
