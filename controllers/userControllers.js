
const User =require( "../models/userModel")

const updateUser = async(req, res, next)=>{
    const userid = req.params.userid;
    try {
        const updatedUser = await User.findByIdAndUpdate(userid,
            {$set:req.body}, {new:true}
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err)
    }
}

const deleteUser = async(req, res, next)=>{
    const userid = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userid);
        res.status(200).json('User deleted successfully');
    } catch (err) {
        next(err)
    }
}
const getUser = async(req, res, next)=>{
    const userid = req.params.userid;
    try {
        const user = await User.findById(userid);
        res.status(200).json(user);
    } catch (err) {
        next(err)
    }
}
const getAllUser = async(req, res, next)=>{
    const query = req.query.new;
    
    try {
        const users = query ? 
        await User.find().sort({_id:-1}).limit(5)
        :
        await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err)
    }
}



// create contact

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    getAllUser,
}