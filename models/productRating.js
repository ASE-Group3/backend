const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rater:String,
    rater:String,
    stars:Number,
    review:String
}, {timestamps:true});

const Rating = mongoose.model('productrating', ratingSchema);

module.exports = Rating