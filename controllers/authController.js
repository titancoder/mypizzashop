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
	try {
		const enteredEmail = req.body.username;
		const enteredPassword = req.body.password;
		if (!enteredEmail || !enteredPassword) {
			throw createError(400, "Please provide valid username and password");
		}
		const user = await User.findOne({ email: enteredEmail }).select(
			"+password +role"
		);
		if (!user) {
			throw createError(403, "Invalid username or password");
		}

		const result = await bcrypt.compare(enteredPassword, user.password);

		if (!result) {
			throw createError(
				500,
				"Something went wrong! Please try after sometime."
			);
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET
		);

		if (!token) {
			throw createError(
				500,
				"Something went wrong! Please try after sometime."
			);
		}

		res.status(200).json({
			message: "Login Success",
			success: true,
			token: token,
		});
		next();
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                               FORGOT PASSWORD                              */
/* -------------------------------------------------------------------------- */

exports.forgotPassword = async (req, res, next) => {
	try {
		const enteredEmail = req.body.email;
		if (!enteredEmail) {
			throw createError(400, "Please provide a valid email");
		}
		const user = await User.findOne({ email: enteredEmail });

		if (user) {
			const resetToken = crypto.randomBytes(64).toString("base64");
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
			message:
				"If any account is associated with the email, you will receive instructions to reset your password",
			success: true,
		});
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                               RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */

exports.resetPassword = async (req, res, next) => {
	try {
		const enteredToken = req.body.token;
		const enteredPassword = req.body.password;

		if (!enteredToken || !enteredPassword) {
			throw createError(400, "Invalid Token or password");
		}

		const user = await User.findOne({ resetToken: enteredToken }).select(
			"+hashedResetToken +passwordResetExpiresAt"
		);

		if (Date.now() > user.passwordResetExpiresAt) {
			user.hashedResetToken = undefined;
			user.resetToken = undefined;
			user.passwordResetExpiresAt = undefined;
			await user.save();
			throw createError(
				401,
				"Token has expired. Kindly request again to reset password"
			);
		}

		const result = await bcrypt.compare(enteredToken, user.hashedResetToken);

		if (!result) {
			console.log("Unable to match password");
			throw createError(
				500,
				"Something went wrong! Please try again after sometime"
			);
		}

		const updatedPassword = await bcrypt.hash(enteredPassword, 10);
		user.password = updatedPassword;
		user.passwordUpdatedAt = Date.now();
		user.hashedResetToken = undefined;
		user.resetToken = undefined;
		user.passwordResetExpiresAt = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password has been changed successfully.",
		});
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                              JWT AUTHORIZATION                             */
/* -------------------------------------------------------------------------- */

exports.authorize = (req, res, next) => {
	try {
		let token = req.headers.cookie;
		if (!token) {
			throw createError(401, "Unauthorized");
		}
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				console.log("Error processing JWT token");
				throw createError(
					500,
					"Something went wrong. Please try again after sometime"
				);
			}
			req.user = decoded.id;
			req.role = decoded.role;
			next();
		});
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                           RESTRICT TO ADMIN ONLY                           */
/* -------------------------------------------------------------------------- */

exports.restrict = async (req, res, next) => {
	try {
		const { role } = await User.findById(req.user).select("+role");

		if (!role) {
			console.log("Role not found on User");
			throw createError(
				500,
				"Something went wrong. Please try again after sometime"
			);
		}
		if (role === "alpha") {
			next();
		} else {
			next(createError(403, "Forbidden"));
		}
	} catch (err) {
		next(err);
	}
};

/* -------------------------------------------------------------------------- */
/*                    PARTIAL RESTRICT (BOTH ADMIN & USER)                    */
/* -------------------------------------------------------------------------- */

exports.partialRestrict = async (req, res, next) => {
	try {
		const { role } = await User.findById(req.user).select("+role");

		if (!role) {
			console.log("Role not found on User");
			throw createError(
				500,
				"Something went wrong. Please try again after sometime"
			);
		}

		if (role === "alpha") {
			req.role = "alpha";
		} else req.role = "delta";
		next();
	} catch (err) {
		next(err);
	}
};

exports.isLoggedIn = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return next();
		}

		let id;

		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) {
				console.log("Error processing JWT token");
				throw createError(
					500,
					"Something went wrong. Please try again after sometime"
				);
			}

			id = decoded.id;
			req.user = decoded.id;
			res.locals.role = decoded.role;
			req.role = decoded.role;

			const user = await User.findById(id).select("+role");
			req.user = user;
			res.locals.name = user.name;
			res.locals.img = user.image;

			next();
		});
	} catch (err) {
		next(err);
	}
};
