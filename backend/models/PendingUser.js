// models/PendingUser.js
const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document expires in 10 minutes if not verified
  },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
