exports.getAllToppings = (req, res) => {
  res.status(200).json({
    message: "Get All Toppings",
    success: true
  });
};

exports.addNewTopping = (req, res) => {
  res.status(200).json({
    message: "Add Topping",
    success: true
  });
};

exports.editTopping = (req, res) => {
  res.status(200).json({
    message: "Edit Topping",
    success: true
  });
};

exports.deleteTopping = (req, res) => {
  res.status(200).json({
    message: "Delete Topping",
    success: true
  });
};

exports.getTopping = (req, res) => {
  res.status(200).json({
    message: "Get Topping",
    params: req.params.id,
    success: true
  });
};
