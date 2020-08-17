const multer = require("multer");
const crypto = require("crypto");
const sharp = require("sharp");
const fs = require("fs");

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
exports.uploadImage = multer({ storage: storage }).single("photo");

exports.resizeImage = async (req, res, next) => {
	if (req.file) {
		await sharp(`./public/images/pizza/${req.file.filename}`)
			.resize(500, 400)
			.jpeg({ quality: 70 })
			.toFile(`./public/images/pizza/_${req.file.filename}`);
		await sharp(`./public/images/pizza/${req.file.filename}`)
			.resize(170, 170)
			.jpeg({ quality: 60 })
			.toFile(`./public/images/thumbnails/_t${req.file.filename}`);
		fs.unlinkSync(`./public/images/pizza/${req.file.filename}`);

		req.body.image = `images/pizza/_${req.file.filename}`;
	}
	next();
};

const userStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images/users");
	},
	filename: function (req, file, cb) {
		//console.log(file);
		const randomBytes = crypto.randomBytes(14).toString("hex");
		const mimetype = file.originalname.split(".")[1];
		cb(null, randomBytes + "." + mimetype); //Appending extension
	},
});
exports.uploadUserImage = multer({ storage: userStorage }).single("avatar");

exports.resizeUserImage = async (req, res, next) => {
	if (req.file) {
		await sharp(`./public/images/users/${req.file.filename}`)
			.resize(500, 400)
			.jpeg({ quality: 70 })
			.toFile(`./public/images/users/_${req.file.filename}`);
		await sharp(`./public/images/users/${req.file.filename}`)
			.resize(170, 170)
			.jpeg({ quality: 60 })
			.toFile(`./public/images/thumbnails/_t${req.file.filename}`);
		fs.unlinkSync(`./public/images/users/${req.file.filename}`);

		req.body.image = `images/thumbnails/_t${req.file.filename}`;
	}
	next();
};
