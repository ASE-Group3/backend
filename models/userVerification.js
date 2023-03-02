const mongoose =require( "mongoose");

const userVerificationSchema = new mongoose.Schema({
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
},
    {minimize:false, timestamps:true}
);

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);
module.exports =  UserVerification;