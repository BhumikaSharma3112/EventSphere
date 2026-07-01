const express = require('express');
const { getEventReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/event/:eventId', getEventReviews);
router.post('/', protect, addReview);

module.exports = router;
