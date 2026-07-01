const Notification = require('../models/Notification');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');

const getNotifications = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const myNotifs = mockDb.getNotifications().filter(n => n.recipient === req.user._id);
      // Sort desc by date
      myNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, notifications: myNotifs });
    }

    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const notifications = mockDb.getNotifications();
      const updatedNotifs = notifications.map(n => {
        if (n.recipient === req.user._id) {
          return { ...n, isRead: true };
        }
        return n;
      });
      mockDb.setNotifications(updatedNotifs);
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
