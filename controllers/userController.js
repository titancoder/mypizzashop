const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email-sender");
const createError = require("http-errors");

/* -------------------------------------------------------------------------- */
/*                                GET ALL USERS                               */
/* -------------------------------------------------------------------------- */

// Method    GET
// Endpoint  /users

/*---------*
|ADMIN ONLY|
*----------*/

exports.getAllUsers = async (req, res) => {
	const allUsers = await User.find({});
	//console.log(req.headers.authorization.split(" ")[1]);
	try {
		res.status(200).json({
			success: true,
			count: allUsers.length,
			data: allUsers,
		});
	} catch (err) {
		console.log(err.message);
	}
};

/* -------------------------------------------------------------------------- */
/*                         CREATE NEW USER === SIGNUP                         */
/* -------------------------------------------------------------------------- */

//Method    POST
//Endpoint  /users/signup

/*-------------*
|GENERAL ACCESS|
*--------------*/

exports.signUp = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			throw createError(400, "Email must be unique");
		}

		req.body.password = bcrypt.hashSync(req.body.password, 10);
		const newUser = new User(req.body);

		const result = await newUser.save();
		const token = jwt.sign(
			{ id: result._id, role: result.role },
			process.env.JWT_SECRET
		);
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

/* -------------------------------------------------------------------------- */
/*                                 UPDATE USER                                */
/* -------------------------------------------------------------------------- */

//Method    PATCH
//Endpoint  /users/:id

/*----------------*
|PROTECTED & ADMIN|
*-----------------*/

exports.editUser = async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(200).json({
			success: true,
			data: updatedUser,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

/* -------------------------------------------------------------------------- */
/*                                 DELETE USER                                */
/* -------------------------------------------------------------------------- */
//Method    DELETE
//Endpoint  /users/:id

/*----------------*
|PROTECTED & ADMIN|
*-----------------*/

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

/* -------------------------------------------------------------------------- */
/*                           GET SINGLE USER DETAILS                          */
/* -------------------------------------------------------------------------- */
//Method    GET
//Endpoint  /users/:id

/*----------------*
|PROTECTED & ADMIN|
*-----------------*/

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
