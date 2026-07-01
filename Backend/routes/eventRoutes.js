const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getCategories,
  createCategory
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getEvents);
router.get('/categories', getCategories);
router.get('/organizer/:organizerId', getOrganizerEvents);
router.get('/:id', getEventById);

// Protected routes
router.post(
  '/',
  protect,
  authorize('organizer', 'admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 }
  ]),
  createEvent
);

router.put(
  '/:id',
  protect,
  authorize('organizer', 'admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 6 }
  ]),
  updateEvent
);

router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

// Admin-only Category routes
router.post('/categories', protect, authorize('admin'), upload.single('image'), createCategory);

module.exports = router;
