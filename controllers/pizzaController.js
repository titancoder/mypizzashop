exports.getAllPizzas = (req, res) => {
  res.status(200).json({
    message: "Get All Pizzas",
    success: true
  });
};

exports.addNewPizza = (req, res) => {
  res.status(200).json({
    message: "Add Pizza",
    success: true
  });
};

exports.editPizza = (req, res) => {
  res.status(200).json({
    message: "Edit Pizza",
    success: true
  });
};

exports.deletePizza = (req, res) => {
  res.status(200).json({
    message: "Delete Pizza",
    success: true
  });
};

exports.getPizza = (req, res) => {
  res.status(200).json({
    message: "Get Pizza",
    params: req.params.id,
    success: true
  });
};
