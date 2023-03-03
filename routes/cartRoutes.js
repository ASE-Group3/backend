const { createCart, getAllCarts, getCart, updateCart, deleteCart } = require('../controllers/cartController');
const { verifyUser } = require('../utils/verifyToken');

const router = require('express').Router();

router.post('/', verifyUser, createCart);
router.get('/', verifyUser, getAllCarts);
router.get('/:userId', verifyUser, getCart);
router.put('/:cartid', verifyUser, updateCart);
router.delete('/:cartid', verifyUser, deleteCart);

module.exports = router