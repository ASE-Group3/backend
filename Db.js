const mongoose =require( "mongoose");
const dotenv =require( 'dotenv');

dotenv.config();

const Connect = async()=>{
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('MongoDB is green');
    })
    .catch(err=>{
        console.log(err)
    })
}

module.exports =  Connect