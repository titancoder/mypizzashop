const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/* -------------------------------------------------------------------------- */
/*                    LOGIN === GET SINGLE USER & JWT AUTH                    */
/* -------------------------------------------------------------------------- */

exports.login = async (req, res, next) => {
  const enteredEmail = req.body.username;
  const enteredPassword = req.body.password;

  try {
    /*---------------------------------*
    |CHECK IF USER WITH THE EMAIL EXITS|
    *----------------------------------*/
    const user = await User.findOne({ email: enteredEmail }).select(
      "+password"
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
      const token = jwt.sign({ id: user._id }, "thisismysecrettoken");
      res.status(200).json({
        message: "Login Success",
        success: true,
        token: token
      });

      /*---------------------------------------------------------------------------*
      |AFTER TOKEN GENERATION, ATTACH USER TO REQUEST OBJECT AND FORWARD IT TO NEXT|
      *----------------------------------------------------------------------------*/

      next();
    } else throw new Error("Password Incorrect");
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
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
    const result = await User.findByIdAndUpdate(user._id, {
      resetHashedPassword: hasedResetPassword,
      resetToken: resetToken
    });
    console.log(result);
  }
  res.status(200).json({
    message: "Forgot Password",
    success: true
  });
};

/* -------------------------------------------------------------------------- */
/*                               RESET PASSWORD                               */
/* -------------------------------------------------------------------------- */

exports.resetPassword = async (req, res) => {
  const enteredToken = req.body.token;
  const enteredPassword = req.body.password;
  console.log(enteredToken);
  console.log(enteredPassword);
  try {
    const user = await User.findOne({ resetToken: enteredToken }).select(
      "+resetHashedPassword"
    );
    console.log(user);
    const result = await bcrypt.compare(enteredToken, user.resetHashedPassword);
    if (result) {
      const updatedPassword = await bcrypt.hash(enteredPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        password: updatedPassword,
        resetToken: undefined,
        resetHashedPassword: undefined,
        passwordUpdatedAt: Date.now()
      });
      res.status(200).json({
        success: true,
        data: updatedUser
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              JWT AUTHORIZATION                             */
/* -------------------------------------------------------------------------- */

exports.authorize = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "thisismysecrettoken", (err, decoded) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  });
  next();
};
