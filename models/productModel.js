const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:String,
    price:Number,
    size:String,
    picture:String,
    colour:String,
    description:String,
    categories:{type:Array},
}, {timestamps:true});

const Product = mongoose.model('product', productSchema);

module.exports = Product