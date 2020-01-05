const User = require("../models/user");

/* -------------------------------------------------------------------------- */
/*                               GET ALL ORDERS                               */
/* -------------------------------------------------------------------------- */
// Method    GET
// Endpoint  /users

/*----------------*
|PROTECTED & ADMIN|
*-----------------*/

exports.getAllOrders = async (req, res) => {
  const allOrders = await Order.find({});

  try {
    res.status(200).json({
      success: true,
      count: allOrders.length,
      data: allOrders
    });
  } catch (err) {
    console.log(err.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                              CREATE NEW ORDER                              */
/* -------------------------------------------------------------------------- */
//Method    POST
//Endpoint  /Orders

/*--------*
|PROTECTED|
*---------*/

exports.addNewOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(200).json({
      success: true,
      data: newOrder
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 EDIT ORDER                                 */
/* -------------------------------------------------------------------------- */
//Method    PATCH
//Endpoint  /Orders/:id

/*--------*
|PROTECTED|
*---------*/

exports.editOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                DELETE ORDER                                */
/* -------------------------------------------------------------------------- */
//Method    DELETE
//Endpoint  /Orders/:id

/*---------*
|ADMIN ONLY|
*----------*/

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          GET SINGLE ORDER DETAILS                          */
/* -------------------------------------------------------------------------- */
//Method    GET
//Endpoint  /Orders/:id

/*--------*
|PROTECTED|
*---------*/

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};
