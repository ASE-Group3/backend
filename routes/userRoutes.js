const { 
        updateUser,
        deleteUser,
        getUser,
        getAllUser,
} = require('../controllers/userControllers');

const router =  require('express').Router();

router.put('/update/:userid', updateUser);
router.get('/:userid', getUser);
router.get('/', getAllUser);

module.exports =router;