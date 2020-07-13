const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images/pizza");
	},
	filename: function (req, file, cb) {
		//console.log(file);
		const randomBytes = crypto.randomBytes(14).toString("hex");
		const mimetype = file.originalname.split(".")[1];
		cb(null, randomBytes + "." + mimetype); //Appending extension
	},
});
exports.upload = multer({ storage: storage });
