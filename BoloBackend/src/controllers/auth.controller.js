const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Log = require('../models/Log');
const sendOTP = require('../utils/sendOTP');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const response = require('../utils/response');

// Request OTP: POST /api/auth/request-otp { phone, name? }
exports.requestOTP = async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return response.error(res, 'Phone is required', 400);

    // create or find user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: name || 'Unknown' });
    }

    // create OTP and log
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const log = await Log.create({ userID: user._id, otp, status: 'pending', expiresAt });

    // send OTP via provider (mockable)
    await sendOTP(phone, otp);

    return response.success(res, { message: 'OTP sent', logId: log._id });
  } catch (err) {
    console.error(err);
    return response.error(res, 'Failed to send OTP');
  }
};

// Verify OTP: POST /api/auth/verify-otp { phone, otp }
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return response.error(res, 'phone and otp required', 400);

    const user = await User.findOne({ phone });
    if (!user) return response.error(res, 'User not found', 404);

    // find last pending log
    const log = await Log.findOne({ userID: user._id, status: 'pending' }).sort({ createdAt: -1 });
    if (!log) return response.error(res, 'OTP not requested', 400);
    
    // Check expiration
    const now = new Date();
    if (log.expiresAt < now) {
      console.log(`OTP expired. Expires: ${log.expiresAt}, Now: ${now}`);
      return response.error(res, 'OTP expired', 400);
    }
    
    // Check OTP match
    if (log.otp !== otp) {
      console.log(`OTP mismatch. Expected: ${log.otp}, Received: ${otp}`);
      return response.error(res, 'Invalid OTP', 400);
    }

    // mark verified
    log.status = 'verified';
    await log.save();

    // issue JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response.success(res, { token, user });
  } catch (err) {
    console.error(err);
    return response.error(res, 'Failed to verify OTP');
  }
};

// Logout: POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response.success(res, { message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return response.error(res, 'Failed to logout');
  }
};
