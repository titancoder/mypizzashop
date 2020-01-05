const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
/*        FORGOT PASSWORD === PATCH USER DETAILS - RESET PASSSORD FIELD       */
/* -------------------------------------------------------------------------- */

exports.forgotPassword = (req, res) => {
  res.status(200).json({
    message: "Forgot Password",
    success: true
  });
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
