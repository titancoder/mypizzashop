const Order = require("../models/order");

/* -------------------------------------------------------------------------- */
/*                               GET ALL ORDERS                               */
/* -------------------------------------------------------------------------- */
// Method    GET
// Endpoint  /orders

/*-----------------*
|ALL ORDERS - ADMIN|    
*------------------*/
/*-----------------*
|USER ORDERS - USER|
*------------------*/

exports.getAllOrders = async (req, res) => {
  const query = {};
  if (req.role === "user") {
    query.orderedBy = req.user;
  }
  try {
    const allOrders = await Order.find(query);
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
//Endpoint  /orders

/*--------*
|AUTHORIZE|
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
/*                                UPDATE ORDER                                */
/* -------------------------------------------------------------------------- */

//Method    PATCH
//Endpoint  /orders/:id

/*--------*
|AUTHORIZE|
*---------*/

exports.editOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // const order = await Order.findOne({ _id: req.params.id });

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
//Endpoint  /orders/:id

/*-------*
|RESTRICT|
*--------*/

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
|AUTHORIZE|
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
