const mongoose = require('mongoose');

const generalRatingSchema = new mongoose.Schema({
    rater:String,
    raterid:{type:String, required:true},
    stars:Number,
    review:String
}, {timestamps:true});

const GeRating = mongoose.model('generalrating', generalRatingSchema);

module.exports = GeRating