const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email-sender");
const createError = require("http-errors");

exports.getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find({});

		res.status(200).json({
			success: true,
			count: allUsers.length,
			data: allUsers,
		});
	} catch (err) {
		console.log(err.message);
	}
};

exports.signUp = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			throw createError(400, "Email must be unique");
		}

		req.body.password = bcrypt.hashSync(req.body.password, 10);
		if (!req.body.password) {
			console.log("Password not found or undefined");
			throw createError(500, "Something went wrong!");
		}
		const newUser = new User(req.body);

		const result = await newUser.save();

		if (!result) {
			console.log("New user could not be saved");
			throw createError(500, "Something went wrong!");
		}
		const token = jwt.sign(
			{ id: result._id, role: result.role },
			process.env.JWT_SECRET
		);

		if (!token) {
			console.log("JWT Token could not be signed");
			throw createError(500, "Something went wrong!");
		}

		res.cookie("jwt", token, {
			maxAge: 30 * 60 * 1000,
		});

		res.status(200).json({
			success: true,
			data: result,
			token: token,
		});
		sendEmail("signup-email", {
			name: result.name,
			customerEmail: result.email,
			subject: "Welcome to Yum Yum Pizza!",
		});
	} catch (err) {
		next(err);
	}
};

exports.editUser = async (req, res, next) => {
	try {
		if (!req.body) {
			throw createError(400, "Details could not be updated");
		}
		await User.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).json({
			success: true,
			message: "Details updated successfully",
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err,
		});
	}
};
