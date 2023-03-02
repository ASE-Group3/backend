const express =require( 'express');
const cors =require( 'cors');
const dotenv =require( 'dotenv');
const mongoose =require( 'mongoose');
const Connect =require( './Db');
const authRoutes =require( './routes/authRoutes')
const userRoutes =require( './routes/userRoutes');
const productRoutes =require( './routes/productRoutes');
const cartRoutes =require( './routes/cartRoutes');


dotenv.config();

const app = express();
Connect();
mongoose.connection.on('connected', ()=>{
    console.log('Mongo is back')
})
mongoose.connection.on('disconnected', ()=>{
    console.log('Mongo is disconnected')
})

app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/profiles', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


app.use((err, req, res, next)=>{
    const errorStatus = err.status ||500;
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack: err.stack
    });
})

const PORT = 8000 || process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})