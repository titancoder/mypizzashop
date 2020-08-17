const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const createError = require("http-errors");
const { sendEmail } = require("../utils/email-sender");

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */

exports.login = async (req, res, next) => {
	const enteredEmail = req.body.username;
	const enteredPassword = req.body.password;

	try {
		/*---------------------------------*
    |CHECK IF USER WITH THE EMAIL EXITS|
    *----------------------------------*/
		const user = await User.findOne({ email: enteredEmail }).select(
			"+password +role"
		);
		if (!user) {
			throw createError(400, "User not found");
		}

		/*-----------------------------------------------*
    |IF USER EXISTS, CHECK IF THE PASSWORD IS CORRECT|
    *------------------------------------------------*/
		const result = await bcrypt.compare(enteredPassword, user.password);

		/*--------------------------------------*
    |IF PASSWORD CORRECT, GENERATE JWT TOKEN|
    *---------------------------------------*/
		if (result) {
			const token = jwt.sign(
				{ id: user._id, role: user.role },
				process.env.JWT_SECRET
			);

			res.status(200).json({
				message: "Login Success",
				success: true,
				token: token,
			});

			next();
		} else {
			throw createError(400, "Invalid username or password");
		}
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                               FORGOT PASSWORD                              */
/* -------------------------------------------------------------------------- */

exports.forgotPassword = async (req, res) => {
	const enteredEmail = req.body.email;
	const user = await User.findOne({ email: enteredEmail });
	if (user) {
		const resetToken = await crypto.randomBytes(64).toString("base64");
		const hasedResetToken = await bcrypt.hash(resetToken, 10);
		user.hashedResetToken = hasedResetToken;
		user.resetToken = resetToken;
		user.passwordResetExpiresAt = Date.now() + 60 * 60 * 1000;

		await user.save();

		sendEmail("reset-password", {
			name: user.name,
			customerEmail: user.email,
			subject: "Reset Password",
			resetToken: encodeURIComponent(resetToken),
		});
	}

	res.status(200).json({
		message: "Forgot Password",
		success: true,
	});
};

/* -------------------------------------------------------------------------- */
/*                               RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */

exports.resetPassword = async (req, res, next) => {
	const enteredToken = req.body.token;
	const enteredPassword = req.body.password;

	//FIND USER BASED ON THE RESET TOKEN
	try {
		const user = await User.findOne({ resetToken: enteredToken }).select(
			"+hashedResetToken +passwordResetExpiresAt"
		);

		if (Date.now() > user.passwordResetExpiresAt) {
			user.hashedResetToken = undefined;
			user.resetToken = undefined;
			user.passwordResetExpiresAt = undefined;
			await user.save();
			throw createError(401, "Token expired");
		}

		// COMPARE THE RESET HASHED PASSWORD STORED IN DB

		const result = await bcrypt.compare(enteredToken, user.hashedResetToken);
		if (result) {
			//IF SUCCESSFUL, UPDATE PASSWORD AND REMOVE THE UNNECESSARY FIELDS

			const updatedPassword = await bcrypt.hash(enteredPassword, 10);
			user.password = updatedPassword;
			user.passwordUpdatedAt = Date.now();
			user.hashedResetToken = undefined;
			user.resetToken = undefined;
			user.passwordResetExpiresAt = undefined;
			const updatedUser = await user.save();

			res.status(200).json({
				success: true,
				data: updatedUser,
			});
		}
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                              JWT AUTHORIZATION                             */
/* -------------------------------------------------------------------------- */

exports.authorize = (req, res, next) => {
	// if (req.headers.authorization) {
	// 	res.status(400).json({
	// 		success: false,
	// 		message: "No Authorization Token",
	// 	});
	// }

	// if (req.headers.authorization) {
	// 	token = req.headers.authorization.split(" ")[1];
	// } else {
	let token = req.headers.cookie;

	/* -------------------------------------------------------------------------- */
	/*             IF JWT VERIFIED, ATTACH USER ID TO REQUEST OBEJECT             */
	/* -------------------------------------------------------------------------- */

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.status(400).json({
				success: false,
				message: err.message,
			});
		}
		req.user = decoded.id;
		req.role = decoded.role;
	});
	next();
};

/* -------------------------------------------------------------------------- */
/*                           RESTRICT TO ADMIN ONLY                           */
/* -------------------------------------------------------------------------- */

exports.restrict = async (req, res, next) => {
	const { role } = await User.findById(req.user).select("+role");

	if (role === "alpha") {
		next();
	} else {
		next(createError(403, "Forbidden"));
	}
};

/* -------------------------------------------------------------------------- */
/*                    PARTIAL RESTRICT (BOTH ADMIN & USER)                    */
/* -------------------------------------------------------------------------- */

exports.partialRestrict = async (req, res, next) => {
	const { role } = await User.findById(req.user).select("+role");

	if (role === "alpha") {
		req.role = "alpha";
	} else req.role = "delta";
	next();
};

exports.isLoggedIn = async (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		return next();
	}

	let id;

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return next();
		}

		id = decoded.id;

		req.user = decoded.id;
		res.locals.role = decoded.role;
		req.role = decoded.role;
	});

	try {
		const user = await User.findById(id).select("+role");
		req.user = user;
		res.locals.name = user.name;
		res.locals.img = user.image;
	} catch (err) {
		if (err) {
			console.log(err.message);
		}
	}
	next();
};
