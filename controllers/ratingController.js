const Product = require("../models/productModel");
const Rating = require("../models/productRating");
const User = require("../models/userModel");

const createRaing = async(req, res, next)=>{
    const {userid, productid} = req.params;
    try {
        const user = await User.findById(userid);
        const newRating = new Rating({
            ...req.body,
            rater:user.fullname
        })
        try {
            const savedRating = await newRating.save();
            try {
                await User.findByIdAndUpdate(userid, {
                    $push:{rated:savedRating._id}
                })
                await Product.findByIdAndUpdate(productid, {
                    $push:{ratings:savedRating._id}
                })
            } catch (err) {
                next(err)
            }
        } catch (err) {
            next(err)
        }
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
        await Rating.findByIdAndUpdate(ratingid);
        try {
            await Product.findByIdAndUpdate(productid, {
                $pull:{ratings:ratingid}
            })
        } catch (err) {
            next(err)
        }
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