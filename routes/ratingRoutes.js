const { createRaing, getAllRatings, getRating, updateRaing, deleteRaing } = require('../controllers/ratingController');
const { verifyUser } = require('../utils/verifyToken');

const router  = require('express').Router();

router.post('/', verifyUser, createRaing);
router.get('/', getAllRatings);
router.get('/:ratingid', getRating);
router.put('/:ratingid', verifyUser, updateRaing);
router.delete('/:ratingid', verifyUser, deleteRaing);

module.exports = router;