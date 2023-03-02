const { createProduct } = require('../controllers/productController');

const router = require('express').Router();

router.post('/', createProduct)

module.exports = router