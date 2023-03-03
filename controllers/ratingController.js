const Product = require("../models/productModel");
const Rating = require("../models/productRating");
const User = require("../models/userModel");

const createRaing = async(req, res, next)=>{
    const {raterid} = req.body;
    try {
        const user = await User.findById(raterid);
        const newRating = new Rating({
            ...req.body,
            rater:user.fullname? user.fullname : user.username,
        })
        const savedRating = await newRating.save();
        
        res.status(200).json(savedRating);
    } catch (err) {
        next(err)
    }
}


const updateRaing = async(req, res, next)=>{
    const {ratingid} = req.params;
    try {
        const updatedRating = await Rating.findByIdAndUpdate(ratingid, {
            $set:req.body
        }, {new:true})
        res.status(200).json(updatedRating)
    } catch (err) {
        next(err)
    }
}


const deleteRaing = async(req, res, next)=>{
    const {ratingid, productid} = req.params;
    try {
        await Rating.findByIdAndDelete(ratingid);
        res.status(200).json('Rating deleted successfully')
    } catch (err) {
        next(err)
    }
}

const getRating = async(req, res, next)=>{
    const {ratingid} = req.params;
    try {
        const rating = await Rating.findById(ratingid);
        res.status(200).json(rating)
    } catch (err) {
        next(err)
    }
}

const getAllRatings = async(req, res, next)=>{
    try {
        const rating = await Rating.find();
        res.status(200).json(rating)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createRaing,
    updateRaing,
    getRating,
    getAllRatings,
    deleteRaing
}