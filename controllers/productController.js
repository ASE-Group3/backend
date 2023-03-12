const Product = require("../models/productModel");
const Rating = require("../models/productRating");

const createProduct = async(req, res, next)=>{
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (err) {
        next(err)
    }
}


const updateProduct = async(req, res, next)=>{
    const {productid} = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productid, {
            $set:req.body
        },
        {new:true}
        )
        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err)
    }
}


const deleteProduct = async(req, res, next)=>{
    const {productid} = req.params;
    try {
        await Product.findByIdAndDelete(productid);
        res.status(200).json('Product Deleted Successfully');
    } catch (err) {
        next(err)
    }
}


const getProduct = async(req, res, next)=>{
    const {productid} = req.params;
    try {
        const product = await Product.findById(productid);
        res.status(200).json(product);
    } catch (err) {
        next(err)
    }
}


const getAllProducts = async(req, res, next)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        }
        else if(qCategory){
            products = await Product.find({categories:{
                $in:[qCategory]
            }})
        }
        else{

            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        next(err)
    }
}



module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts
}