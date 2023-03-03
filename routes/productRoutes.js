const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyAdmin } = require('../utils/verifyToken');

const router = require('express').Router();

router.post('/', verifyAdmin, createProduct)
router.get('/', getAllProducts)
router.get('/:productid', getProduct)
router.put('/:productid', verifyAdmin, updateProduct)
router.delete('/:productid', verifyAdmin, deleteProduct)

module.exports = router