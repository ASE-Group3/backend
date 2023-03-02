const Order = require("../models/orderModel");
const User = require("../models/userModel");

const createOrder = async(req, res, next)=>{
    const newOrder = new Order(req.body)

    try {
       const savedOrder = await newOrder.save();
       res.status(200).json(savedOrder);
    } catch (err) {
        next(err)
    }
    
}

const updateOrder = async(req, res, next)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderid,
            {$set:req.body}, {new:true}
        )

        res.status(200).json(updatedOrder);
    } catch (err) {
        next(err)
    }
}

const deleteOrder = async(req, res, next)=>{
    try {
        await Order.findByIdAndDelete(req.params.orderid)

        res.status(200).json('Order deleted...');
    } catch (err) {
        next(err)
    }
}

const getOrder = async(req, res, next)=>{
    try {
        const order = await Order.findOne({userId:req.params.userId})
        res.status(200).json(order);
    } catch (err) {
        next(err)
    }
}

const getAllOrders = async(req, res, next)=>{
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    getAllOrders
}