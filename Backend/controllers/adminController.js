const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Report = require('../models/Report');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');

// Get Platform Analytics
const getAnalytics = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      const events = mockDb.getEvents();
      const registrations = mockDb.getRegistrations();
      
      const totalUsers = users.filter(u => u.role === 'user').length;
      const totalOrganizers = users.filter(u => u.role === 'organizer').length;
      const totalEvents = events.length;
      
      // Sum total sales in registrations
      const totalRevenue = registrations.reduce((sum, reg) => sum + reg.totalPrice, 0);

      // Distribution by category
      const categoryDistribution = {};
      events.forEach(e => {
        categoryDistribution[e.category] = (categoryDistribution[e.category] || 0) + 1;
      });

      const chartsData = Object.keys(categoryDistribution).map(name => ({
        name,
        value: categoryDistribution[name]
      }));

      // Sales over time (last 7 days simulation)
      const salesData = [
        { date: 'Mon', sales: Math.round(totalRevenue * 0.1) },
        { date: 'Tue', sales: Math.round(totalRevenue * 0.15) },
        { date: 'Wed', sales: Math.round(totalRevenue * 0.12) },
        { date: 'Thu', sales: Math.round(totalRevenue * 0.18) },
        { date: 'Fri', sales: Math.round(totalRevenue * 0.22) },
        { date: 'Sat', sales: Math.round(totalRevenue * 0.15) },
        { date: 'Sun', sales: Math.round(totalRevenue * 0.08) }
      ];

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalOrganizers,
          totalEvents,
          totalRevenue
        },
        charts: {
          categories: chartsData,
          sales: salesData
        }
      });
    }

    // Mongoose implementation
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    
    // Aggregation for revenue
    const revenueAggregation = await Registration.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Aggregation for category distribution
    const categoryAggregation = await Event.aggregate([
      { $group: { _id: '$category', value: { $sum: 1 } } }
    ]);
    const categoriesData = categoryAggregation.map(cat => ({
      name: cat._id,
      value: cat.value
    }));

    // Mock sales graph for standard charts
    const salesData = [
      { date: 'Mon', sales: Math.round(totalRevenue * 0.1) },
      { date: 'Tue', sales: Math.round(totalRevenue * 0.15) },
      { date: 'Wed', sales: Math.round(totalRevenue * 0.12) },
      { date: 'Thu', sales: Math.round(totalRevenue * 0.18) },
      { date: 'Fri', sales: Math.round(totalRevenue * 0.22) },
      { date: 'Sat', sales: Math.round(totalRevenue * 0.15) },
      { date: 'Sun', sales: Math.round(totalRevenue * 0.08) }
    ];

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrganizers,
        totalEvents,
        totalRevenue
      },
      charts: {
        categories: categoriesData,
        sales: salesData
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all users
const getUsers = async (req, res) => {
  try {
    if (getFallbackMode()) {
      return res.json({ success: true, users: mockDb.getUsers() });
    }
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Block status
const toggleBlockUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      const userIndex = users.findIndex(u => u._id === userId);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (users[userIndex].role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot block an administrator' });
      }

      users[userIndex].isBlocked = !users[userIndex].isBlocked;
      mockDb.setUsers(users);
      
      return res.json({
        success: true,
        message: `User has been ${users[userIndex].isBlocked ? 'suspended' : 'activated'} successfully`,
        user: users[userIndex]
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block administrators' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User has been ${user.isBlocked ? 'suspended' : 'activated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve Organizer documents
const approveOrganizer = async (req, res) => {
  const { userId } = req.params;

  try {
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      const userIndex = users.findIndex(u => u._id === userId);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

      users[userIndex].isVerifiedOrganizer = true;
      mockDb.setUsers(users);

      return res.json({
        success: true,
        message: 'Organizer credentials approved successfully',
        user: users[userIndex]
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isVerifiedOrganizer = true;
    await user.save();

    res.json({
      success: true,
      message: 'Organizer credentials approved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get platform reports
const getReports = async (req, res) => {
  try {
    if (getFallbackMode()) {
      return res.json({ success: true, reports: mockDb.getReports() });
    }
    const reports = await Report.find().populate('reporter', 'name email').populate('reportedEvent', 'title');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  toggleBlockUser,
  approveOrganizer,
  getReports
};
