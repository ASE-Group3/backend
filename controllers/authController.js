// import {createRequire} from 'module';
// const require = createRequire(import.meta.url);
const dotenv =require( 'dotenv');
const jwt =require( 'jsonwebtoken');
const bcrypt =require( 'bcryptjs');
const User =require( '../models/userModel');
const {createError} =require( "../utils/error");
const { v4 : uuidv4 } =require( 'uuid');
const nodemailer =require( 'nodemailer');
const UserVerification =require( '../models/userVerification.js');
const path = require("path");
const PasswordReset = require('../models/ResetPassword');


dotenv.config();

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

transporter.verify((error, success)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log('Ready for messages');
        console.log(success);
    }
})
const registerUser = async(req, res, next)=>{
    try {
        const {email, username} = req.body;
        const user = await User.find({email});
        if(user.length){
            return next(createError(422, 'User email already taken'));
        }
        else{
            const user = await User.find({username});
            if(user.length){
               return next(createError(422, 'Username already taken'));
           }
           else{
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync( req.body.password, salt);
                const newUser = new User({
                    ...req.body,
                    password:hash,
                    verified:false
                });

                const savedUser =  await newUser.save();
                sendVerificationEmail(savedUser, res);
                // res.status(200).json('Registered successfully');
            }
        }
    } catch (err) {
        next(err)
    }
}

const sendVerificationEmail = async ({_id, email}, res, next)=>{
    const currentUrl = 'https://ase.onrender.com/';
    const uniqueString = uuidv4() + _id;

    
    const mailOptions = {
        from: process.env.EMAIL,
        to:email,
        subject: 'Email Verification',
        html: `
        <div style=" background: teal; display:flex; align-items:center; justify-content:center, width:30rem; height:30rem; padding:1rem; border-radius:1rem " >
            <h1 style="width:90%; color:white; font-weight: 600; text-align:center; margin-bottom:1rem" >Verify email to complete registration</h1>
            <p style="width:80%; color:gainsboro">This link <b>expires in 6 hours </b> </p>
            <p style="width:80%; color:gainsboro">
            Click <a href=${currentUrl + "api/users/verify/" + _id + "/" + uniqueString } > here </a> to proceed
            </p>
        </div>    
       ` 
    }
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedUniquePassword = bcrypt.hashSync(uniqueString, salt);

        try {
            const newVerification = new UserVerification({
                userId:_id,
                uniqueString:hashedUniquePassword,
                createdAt: Date.now(),
                expiresAt:Date.now() + 21600000,
            });
    
            const savedVerfication = await newVerification.save();

            try {
                await transporter.sendMail(mailOptions);
                res.status(200).json('Verification link sent');
            } catch (err) {
                next(err)
            }
        } catch (err) {
            next(err)
        }
    } catch (err) {
        next(err)
    }
}

const verify = async(req, res, next)=>{
    try {
        let {userId, uniqueString} = req.params;
        const user = await UserVerification.find({userId});
        if(user.length > 0){
            const {expiresAt} = user[0];
            const hashedUniqueString = user[0].uniqueString;

            if(expiresAt < Date.now()){
                try {
                    const deletUser = await UserVerification.deleteOne({userId});
                    await User.deleteOne({_id:userId});
                    let message = 'Verification link expired. Pleasse sign up again';
                    res.redirect(`/api/users/verified/?error=true&message=${message}`)
                } catch (err) {
                    next(err)
                }
            }
            else{
                const isUser = await  bcrypt.compare(uniqueString, hashedUniqueString);
                if(isUser){
                    try {
                        const updateUser = await User.updateOne({_id:userId}, {verified:true});
                        await UserVerification.deleteOne({userId});
                        res.sendFile(path.join(__dirname, "./../views/verified.html"));
                    } catch (err) {
                        next(err)
                    }
                }
                else{
                    let message = 'Incorrect verification details passed. Check your inbox for the orginal link';
                    res.redirect(`/api/users/verified/?error=true&message=${message}`)
                }
            }
        }
        else{
            let message = 'Error occured. Either account has been verified already or does not exist. Please login or sign up';
            res.redirect(`/api/users/verified/?error=true&message=${message}`)
        }
        } catch (err) {
            next(err)
        }
}


const verificationFile = (req, res, next)=>{
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
}


const login = async(req, res, next)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(createError(404, "Incorrect email or password!"))
        }
        
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) {
            return next(createError(400, "Incorrect email or password!"));
        }
        else if(!user.verified){
            return next(createError(400, "Email not verified yet. Check your mailbox"));
        }
        else{
            const token = jwt.sign({id:user._id, isAdmin: user.isAdmin}, process.env.JWT);
            const { password, verified, isAdmin, ...otherDetails} = user._doc;
            res.cookie("access_token", token, {
                httpOnly:true,
            })
            .status(200).json({details:{...otherDetails}, isAdmin});
        }
        

    } catch (err) {
        console.log(err)
        res.status(400).json("Error occured loggin you in. Try again")
    }
}

const requestPasswordReset = async(req, res, next)=>{
    const {email, redirectUrl} = req.body;
    try {
        const user = await User.find({email});
        // console.log(user)
        if(user.length){
            if(!user[0].verified){
                return next(createError(403, 'Email not verified yet'));
            }
            else{
                sendResetEmail(user[0], redirectUrl, res)
            }
        }
        else{
            return next(createError(404, 'No user bears the email provided'));
        }
    } catch (err) {
        next(err)
    }
}

const sendResetEmail = async({_id, email}, redirectUrl, res, next)=>{
    try {
        const resetString = uuidv4() + _id;

        await PasswordReset.deleteMany({userId:_id});
        const mailOptions = {

        from: process.env.EMAIL,
        to:email,
        subject: 'Reset Password',
        html: `<p>A request received to reset your password. Ignore this message if you are not the one who made the request.</p> <p>This link <b>expires in an hour </b>
        <p>Click <a href=${redirectUrl + "/" + _id + "/" + resetString } > here</a> to proceed</p>
        </p>`,
    };

       try {
            const salt = bcrypt.genSaltSync(10);
            const hashedResetString = bcrypt.hashSync(resetString, salt);

            const newPasswordReset = new PasswordReset({
                userId: _id,
                resetString: hashedResetString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000
            });

            await newPasswordReset.save();
            transporter.sendMail(mailOptions);
            res.status(200).json('Password reset email sent');
       } catch (err) {
           next(err)
       }
    } catch (err) {
        next(err)
    }

}

const resetPass = async(req, res, next)=>{
    let {userId, resetSting, newPassword} = req.body;
    try {
        const pwdreset = await PasswordReset.find({userId});
        if(pwdreset.length){
            const expiresAt = pwdreset[0];
            const hashedResetString = pwdreset[0].resetString;

            if(expiresAt < Date.now()){
                try {
                    await PasswordReset.deleteOne({userId});
                } catch (err) {
                    next(err)
                }
                return next(createError(400, 'Reset status expired'));
            }
            else{
                try {
                    const verifyString = await bcrypt.compare(resetSting, hashedResetString);
                    if(verifyString){
                        try {
                            const salt = bcrypt.genSaltSync(10);
                            const hashedNewPassword =  bcrypt.hashSync(newPassword, salt);
                            try {
                                await User.updateOne({_id: userId}, {password:hashedNewPassword});
                                await PasswordReset.deleteOne({userId});
                            } catch (err) {
                                next(err)
                            }
                        } catch (err) {
                            next(err)
                        }

                        res.status(201).json('Password reset successfully');
                    }
                    else{
                        return next(createError(400, 'Invalid reset details provided'));
                    }
                } catch (err) {
                    next(err)
                }
            }
        }
        else{
            return next(createError(400, 'Password reset request not found'));
        }
    } catch (err) {
        next(err)
    }
}

const logout = (req, res, next)=>{
    try {
        res.cookie('access_token', '', {maxAge:1});
        // res.redirect('/login');
        res.send('');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerUser,
    verify,
    verificationFile,
    login,
    resetPass,
    sendResetEmail,
    requestPasswordReset,
    logout
}