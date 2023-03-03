const { 
        updateUser,
        deleteUser,
        getUser,
        getAllUser,
} = require('../controllers/userControllers');
const { verifyUser, verifyAdmin } = require('../utils/verifyToken');

const router =  require('express').Router();

router.put('/:id', verifyUser, updateUser);
router.get('/:id', verifyUser, getUser);
router.delete('/:id', verifyUser, deleteUser);
router.get('/', verifyAdmin, getAllUser);

module.exports =router;