const GeRating = require("../models/generalRating");
const User = require("../models/userModel");

const createGeRating = async(req, res, next)=>{
    const user = req.params.userid
    try {
        const rater = await User.findById(user);
        const newGeRating = new GeRating({
            ...req.body,
            rater:rater.fullname
        });
        try {
            const saveGeRating = await newGeRating.save();
            try {
                await User.findByIdAndUpdate(user, {
                    $push:{reviews:saveGeRating._id}
                })
            } catch (err) {
                next(err)
            }
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
    const user = req.params.userid;
    try {
        await GeRating.findByIdAndDelete(ratingid);
        try {
            await User.findByIdAndUpdate(user, {
                $pull:{reviews:ratingid}
            })
        } catch (err) {
            next(err)
        }
        res.status(200).json('GeRating Deleted Successfully');
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