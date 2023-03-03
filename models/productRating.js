const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rater:String,
    raterid:{type:String, required:true},
    productid:{type:String, required:true},
    stars:Number,
    review:String
}, {timestamps:true});

const Rating = mongoose.model('productrating', ratingSchema);

module.exports = Rating