const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getFallbackMode } = require('../config/db');
const mockDb = require('../utils/mockDb');
const { uploadToCloudinary } = require('../utils/cloudinary');
const OTP = require('../models/OTP');
const { sendEmail } = require('../services/emailService');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eventsphere_secret_key_12345', {
    expiresIn: '30d'
  });
};

const register = async (req, res) => {
  const { name, email, password, role, otp } = req.body;
  
  if (!otp) {
    return res.status(400).json({ success: false, message: 'Verification code is required.' });
  }

  try {
    // Validate OTP
    if (getFallbackMode()) {
      let otps = mockDb.getOtps();
      const otpRecord = otps.find(
        (o) => o.email === email.toLowerCase() && o.otp === otp && new Date(o.expiresAt) > Date.now()
      );

      if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
      }

      // Delete OTP
      mockDb.setOtps(otps.filter((o) => o !== otpRecord));
    } else {
      const otpRecord = await OTP.findOne({ email: email.toLowerCase(), otp });
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
      }

      // Delete OTP
      await OTP.deleteOne({ _id: otpRecord._id });
    }

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

const sendOTP = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  try {
    // Check if user already exists
    if (getFallbackMode()) {
      const users = mockDb.getUsers();
      if (users.find(u => u.email === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Email is already registered.' });
      }
    } else {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already registered.' });
      }
    }

    // Generate a 6-digit random number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // Save OTP
    if (getFallbackMode()) {
      let otps = mockDb.getOtps();
      // Remove any existing OTP for this email
      otps = otps.filter(o => o.email !== email.toLowerCase());
      otps.push({ email: email.toLowerCase(), otp, expiresAt });
      mockDb.setOtps(otps);
    } else {
      await OTP.findOneAndDelete({ email: email.toLowerCase() });
      await OTP.create({ email: email.toLowerCase(), otp, expiresAt });
    }

    // Send Email via Brevo
    const emailHtml = `
      <div style="font-family: 'Poppins', sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #E5D3B3; border-radius: 20px; background-color: #FCFAF6; color: #231C1A;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="font-family: 'Playfair Display', serif; letter-spacing: 2px; color: #C5A880; margin: 0;">EVENTSPHERE</h2>
          <span style="font-size: 9px; letter-spacing: 1px; color: #6E635D; text-transform: uppercase;">Premium Gatherings</span>
        </div>
        <p style="font-size: 13px; line-height: 1.6; color: #231C1A;">Hello,</p>
        <p style="font-size: 13px; line-height: 1.6; color: #231C1A;">Thank you for registering with EventSphere. To verify your email address, please use the following One-Time Password (OTP):</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 26px; font-weight: bold; letter-spacing: 5px; color: #C5A880; padding: 10px 25px; border: 1px dashed #C5A880; border-radius: 12px; background-color: #FFF;">${otp}</span>
        </div>
        <p style="font-size: 11px; color: #6E635D; line-height: 1.6; text-align: center; margin-top: 25px;">
          This OTP is valid for 5 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Verify your EventSphere Credentials',
      text: `Your EventSphere verification OTP is: ${otp}`,
      html: emailHtml
    });

    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code.' });
  }
};

module.exports = { register, login, getMe, updateProfile, sendOTP };
