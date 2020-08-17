const multer = require("multer");
const crypto = require("crypto");
const sharp = require("sharp");
const fs = require("fs");

class ImageUtlity {
	constructor(type) {
		this.type = type;
		this.storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, `./public/images/${type}`);
			},
			filename: function (req, file, cb) {
				const randomBytes = crypto.randomBytes(14).toString("hex");
				const mimetype = file.originalname.split(".")[1];
				cb(null, randomBytes + "." + mimetype); //Appending extension
			},
		});

		this.uploadImage = multer({ storage: this.storage }).single("photo");
		this.resizeImage = this.resizeImage.bind(this);
	}

	async resizeImage(req, res, next) {
		if (req.file) {
			await sharp(`./public/images/${this.type}/${req.file.filename}`)
				.resize(500, 400)
				.jpeg({ quality: 70 })
				.toFile(`./public/images/${this.type}/_${req.file.filename}`);
			await sharp(`./public/images/${this.type}/${req.file.filename}`)
				.resize(170, 170)
				.jpeg({ quality: 60 })
				.toFile(
					`./public/images/thumbnails/${this.type}/_t${req.file.filename}`
				);
			//fs.unlinkSync(`./public/images/${this.type}/${req.file.filename}`);

			req.body.image = `images/${this.type}/_${req.file.filename}`;
		}
		next();
	}
}

exports.pizzaImageUtility = new ImageUtlity("pizza");
exports.userImageUtility = new ImageUtlity("user");
