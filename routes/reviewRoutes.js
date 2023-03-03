const { createGeRating, getAllGeRatings, getGeRating, updateGeRating, deleteGeRating } = require('../controllers/generalRatingController');
const { verifyUser } = require('../utils/verifyToken');

const router  = require('express').Router();

router.post('/', verifyUser, createGeRating);
router.get('/', getAllGeRatings);
router.get('/:ratingid', getGeRating);
router.put('/:ratingid', verifyUser, updateGeRating);
router.delete('/:ratingid', verifyUser, deleteGeRating);

module.exports = router;