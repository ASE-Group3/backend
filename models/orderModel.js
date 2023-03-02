const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type:String
    },

    products:[
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    amount:{type:Number}
}, {timestamps:true});

const Cart = mongoose.model('order', orderSchema);

module.exports = Order