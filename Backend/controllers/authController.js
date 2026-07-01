const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');
const { uploadToCloudinary } = require('../utils/cloudinary');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eventsphere_secret_key_12345', {
    expiresIn: '30d'
  });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      if (users.find(u => u.email === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'user',
        isVerifiedOrganizer: false,
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        wishlist: [],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      users.push(newUser);
      mockDb.setUsers(users);
      
      const token = signToken(newUser._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerifiedOrganizer: newUser.isVerifiedOrganizer
        }
      });
    }

    // Mongoose implementation
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    const token = signToken(user._id);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerifiedOrganizer: user.isVerifiedOrganizer
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Register Error: ${error.message}. (Tip: If local MongoDB is in an unwriteable state, stop the service to activate the automatic In-Memory database mode).` 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === email.toLowerCase());
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'This user account has been suspended.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = signToken(user._id);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerifiedOrganizer: user.isVerifiedOrganizer,
          profilePicture: user.profilePicture
        }
      });
    }

    // Mongoose implementation
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'This user account has been suspended.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerifiedOrganizer: user.isVerifiedOrganizer,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Login Error: ${error.message}. (Tip: If local MongoDB is in an unwriteable state, stop the service to activate the automatic In-Memory database mode).` 
    });
  }
};

const getMe = async (req, res) => {
  try {
    if (getFallbackMode()) {
      const user = mockDb.getUsers().find(u => u._id === req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    }
    
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, bio, instagram, twitter, website } = req.body;
  const updates = {
    name,
    phone,
    bio,
    socials: { instagram, twitter, website }
  };

  try {
    if (getFallbackMode()) {
      let users = mockDb.getUsers();
      const userIndex = users.findIndex(u => u._id === req.user._id);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });
      
      users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        phone: phone || users[userIndex].phone,
        bio: bio || users[userIndex].bio,
        socials: {
          instagram: instagram || (users[userIndex].socials && users[userIndex].socials.instagram),
          twitter: twitter || (users[userIndex].socials && users[userIndex].socials.twitter),
          website: website || (users[userIndex].socials && users[userIndex].socials.website)
        },
        profilePicture: req.file ? await uploadToCloudinary(req.file.path) : users[userIndex].profilePicture,
        updatedAt: new Date()
      };
      
      mockDb.setUsers(users);
      return res.json({ success: true, user: users[userIndex] });
    }

    if (req.file) {
      updates.profilePicture = await uploadToCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
