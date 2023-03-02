const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const createCart = async(req, res, next)=>{
    const newCart = new Cart(req.body)

    try {
       const savedCart = await newCart.save();
       res.status(200).json(savedCart);
    } catch (err) {
        next(err)
    }
    
}

const updateCart = async(req, res, next)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cartid,
            {$set:req.body}, {new:true}
        )

        res.status(200).json(updatedCart);
    } catch (err) {
        next(err)
    }
}

const deleteCart = async(req, res, next)=>{
    try {
        await Cart.findByIdAndDelete(req.params.cartid)

        res.status(200).json('Cart deleted...');
    } catch (err) {
        next(err)
    }
}

const getCart = async(req, res, next)=>{
    try {
        const cart = await Cart.findOne({userId:req.params.userId})
        res.status(200).json(cart);
    } catch (err) {
        next(err)
    }
}

const getAllCarts = async(req, res, next)=>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createCart,
    updateCart,
    deleteCart,
    getCart,
    getAllCarts
}