// routes/auth.js
require('dotenv').config();
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User        = require('../models/User');
const PendingUser = require('../models/PendingUser');
const twilio      = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate 6‑digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * @route   POST /api/auth/mobile
 * @desc    Send login OTP
 */
router.post('/mobile', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ msg: 'Mobile number is required' });

  try {
    let user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({
        msg: 'Mobile number not registered.',
        suggestedEndpoint: '/api/auth/register'
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10*60*1000;
    await user.save();

    await client.messages.create({
      body: `Your login verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    res.json({ msg: 'OTP sent to your mobile' });
  } catch (err) {
    console.error('Error in /mobile:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Initiate user registration with OTP
 */
router.post('/register', async (req, res) => {
  const { mobile, name, address } = req.body;
  if (!mobile || !name || !address) {
    return res.status(400).json({ msg: 'Mobile, name, and address are required' });
  }

  try {
    if (await User.findOne({ mobile })) {
      return res.status(400).json({ msg: 'User already registered. Please login.' });
    }

    let pending = await PendingUser.findOne({ mobile });
    const otp = generateOTP();
    const otpExpires = Date.now() + 10*60*1000;

    if (pending) {
      pending.name = name;
      pending.address = address;
      pending.otp = otp;
      pending.otpExpires = otpExpires;
      await pending.save();
    } else {
      pending = new PendingUser({ mobile, name, address, otp, otpExpires });
      await pending.save();
    }

    await client.messages.create({
      body: `Your registration verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    res.status(201).json({ msg: 'Registration initiated. OTP sent to your mobile' });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/register/verify
 * @desc    Verify OTP and create user
 */
router.post('/register/verify', async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ msg: 'Mobile and OTP are required' });

  try {
    const pending = await PendingUser.findOne({ mobile });
    if (!pending || pending.otp !== otp || pending.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const newUser = new User({
      mobile: pending.mobile,
      name: pending.name,
      address: pending.address,
      isVerified: true
    });
    await newUser.save();
    await PendingUser.deleteOne({ mobile });

    const payload = { user: { id: newUser._id, role: newUser.role }};
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('Error in /register/verify:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify login OTP and issue token
 */
router.post('/verify', async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ msg: 'Mobile and OTP are required' });

  try {
    const user = await User.findOne({ mobile });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const payload = { user: { id: user._id, role: user.role }};
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('Error in /verify:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;