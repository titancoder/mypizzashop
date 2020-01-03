exports.getAllOrders = (req, res) => {
  res.status(200).json({
    message: "Get All Orders",
    success: true
  });
};

exports.addNewOrder = (req, res) => {
  res.status(200).json({
    message: "Add Order",
    success: true
  });
};

exports.editOrder = (req, res) => {
  res.status(200).json({
    message: "Edit Order",
    success: true
  });
};

exports.deleteOrder = (req, res) => {
  res.status(200).json({
    message: "Delete Order",
    success: true
  });
};

exports.getOrder = (req, res) => {
  res.status(200).json({
    message: "Get Order",
    params: req.params.id,
    success: true
  });
};
