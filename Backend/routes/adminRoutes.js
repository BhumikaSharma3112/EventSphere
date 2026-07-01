const express = require('express');
const {
  getAnalytics,
  getUsers,
  toggleBlockUser,
  approveOrganizer,
  getReports
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/block/:userId', protect, authorize('admin'), toggleBlockUser);
router.put('/approve/:userId', protect, authorize('admin'), approveOrganizer);
router.get('/reports', protect, authorize('admin'), getReports);

module.exports = router;
