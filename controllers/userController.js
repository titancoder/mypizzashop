exports.getAllUsers = (req, res) => {
  res.status(200).json({
    message: "Get All Users",
    success: true
  });
};

exports.addNewUser = (req, res) => {
  res.status(200).json({
    message: "Add User",
    success: true
  });
};

exports.editUser = (req, res) => {
  res.status(200).json({
    message: "Edit User",
    success: true
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    message: "Delete User",
    success: true
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    message: "Get User",
    params: req.params.id,
    success: true
  });
};
