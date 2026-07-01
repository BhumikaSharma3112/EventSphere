const express = require('express');
const {
  bookTicket,
  checkInTicket,
  getMyTickets,
  getEventAttendees,
  downloadPDFTicket
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/book', protect, bookTicket);
router.post('/check-in', protect, authorize('organizer', 'admin'), checkInTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventAttendees);
router.get('/download/:ticketId', protect, downloadPDFTicket);

module.exports = router;
