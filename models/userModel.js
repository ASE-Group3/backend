const mongoose =require( "mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    fullname:{type:String},
    bio:{type:String},
    phone:{type:String},
    location:{type:String},
    password:{type:String},
    pic:{
        type:String,
        default:'https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
    },
    verified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    reviews:[String],
    rated:[String],
    cart:[String]
    
}, {timestamps:true})

const User = mongoose.model('User', userSchema);
module.exports = User;