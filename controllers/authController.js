const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
			throw new Error("User not found");
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
				"thisismysecrettoken"
			);

			res.status(200).json({
				message: "Login Success",
				success: true,
				token: token,
			});

			next();
		} else throw new Error("Password Incorrect");
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

/* -------------------------------------------------------------------------- */
/*                               FORGOT PASSWORD                              */
/* -------------------------------------------------------------------------- */

exports.forgotPassword = async (req, res) => {
	const enteredEmail = req.body.username;
	const user = await User.findOne({ email: enteredEmail });
	if (user) {
		const resetToken = await crypto.randomBytes(64).toString("base64");
		const hasedResetPassword = await bcrypt.hash(resetToken, 10);
		user.resetHashedPassword = hasedResetPassword;
		user.resetToken = resetToken;
		user.passwordResetExpiresAt = Date.now() + 2 * 60 * 1000;

		await user.save();
	}
	res.status(200).json({
		message: "Forgot Password",
		success: true,
	});
};

/* -------------------------------------------------------------------------- */
/*                               RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */

exports.resetPassword = async (req, res) => {
	const enteredToken = req.body.token;
	const enteredPassword = req.body.password;

	//FIND USER BASED ON THE RESET TOKEN
	try {
		const user = await User.findOne({ resetToken: enteredToken }).select(
			"+resetHashedPassword +passwordResetExpiresAt"
		);

		if (Date.now() > user.passwordResetExpiresAt) {
			user.resetHashedPassword = undefined;
			user.resetToken = undefined;
			user.passwordResetExpiresAt = undefined;
			await user.save();
			throw new Error("Token has expired");
		}

		// COMPARE THE RESET HASHED PASSWORD STORED IN DB

		const result = await bcrypt.compare(enteredToken, user.resetHashedPassword);
		if (result) {
			//IF SUCCESSFUL, UPDATE PASSWORD AND REMOVE THE UNNECESSARY FIELDS

			const updatedPassword = await bcrypt.hash(enteredPassword, 10);
			user.password = updatedPassword;
			user.passwordUpdatedAt = Date.now();
			user.resetHashedPassword = undefined;
			user.resetToken = undefined;
			const updatedUser = await user.save();

			res.status(200).json({
				success: true,
				data: updatedUser,
			});
		}
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
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

	jwt.verify(token, "thisismysecrettoken", (err, decoded) => {
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
	} else
		res.status(403).json({
			success: false,
			message: "Forbidden",
		});
};

/* -------------------------------------------------------------------------- */
/*                    PARTIAL RESTRICT (BOTH ADMIN & USER)                    */
/* -------------------------------------------------------------------------- */

exports.partialRestrict = async (req, res, next) => {
	const { role } = await User.findById(req.user);
	if (role === "alpha") {
		req.role = "alpha";
	} else req.role = "delta";
	next();
};

exports.isLoggedIn = (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		return next();
	}

	jwt.verify(token, "thisismysecrettoken", (err, decoded) => {
		if (err) {
			return next();
		}
		res.locals.role = decoded.role;
		req.role = decoded.role;
	});
	next();
};
