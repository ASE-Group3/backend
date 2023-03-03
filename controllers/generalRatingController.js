const GeRating = require("../models/generalRating");
const User = require("../models/userModel");

const createGeRating = async(req, res, next)=>{
    const user = req.body.raterid
    try {
        const rater = await User.findById(user);
        console.log(rater)
        const newGeRating = new GeRating({
            ...req.body,
            rater:rater.fullname? rater.fullname : rater.username
        });
        try {
            const saveGeRating = await newGeRating.save();
            res.status(200).json(saveGeRating);
        } catch (err) {
            next(err)
        }
    } catch (err) {
        next(err)
    }
}


const updateGeRating = async(req, res, next)=>{
    const {ratingid} = req.params;
    try {
        const updatedGeRating = await GeRating.findByIdAndUpdate(ratingid, {
            $set:req.body
        },
        {new:true}
        )
        res.status(200).json(updatedGeRating);
    } catch (err) {
        next(err)
    }
}


const deleteGeRating = async(req, res, next)=>{
    const {ratingid} = req.params;
    try {
        await GeRating.findByIdAndDelete(ratingid);
        res.status(200).json('Review Deleted Successfully');
    } catch (err) {
        next(err)
    }
}


const getGeRating = async(req, res, next)=>{
    const {ratingid} = req.params;
    try {
        const rating = await GeRating.findById(ratingid);
        res.status(200).json(rating);
    } catch (err) {
        next(err)
    }
}


const getAllGeRatings = async(req, res, next)=>{
    try {
        const ratings = await GeRating.find();
        res.status(200).json(ratings);
    } catch (err) {
        next(err)
    }
}




module.exports = {
    createGeRating,
    updateGeRating,
    deleteGeRating,
    getGeRating,
    getAllGeRatings
}