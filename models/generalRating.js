const mongoose = require('mongoose');

const generalRatingSchema = new mongoose.Schema({
    rater:String,
    raterid:String,
    stars:Number,
    review:String
}, {timestamps:true});

const GeRating = mongoose.model('generalrating', generalRatingSchema);

module.exports = GeRating