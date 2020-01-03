exports.signUp = (req, res) => {
  res.status(200).json({
    message: "Sign Up",
    success: true
  });
};

exports.login = (req, res) => {
  res.status(200).json({
    message: "Login",
    success: true
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).json({
    message: "Forgot Password",
    success: true
  });
};
