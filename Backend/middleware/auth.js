const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventsphere_secret_key_12345');
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      // Fallback/mock check in case DB not connected and running in mock environment
      // We'll create a fake user object for debugging if needed
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    if (req.user.isBlocked) {
      return res.status(403).json({ success: false, message: 'This user account has been suspended.' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user ? req.user.role : 'guest'} is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
