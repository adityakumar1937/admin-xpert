const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Login Route
router.post('/log-in', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err.message);
          return res.status(500).json({ msg: 'Server Error' });
        }
        
        // Print JWT token on the console
        console.log('JWT Token:', token);
        
        // Include JWT token and user information in the response
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            photo: user.photo,
            designation: user.designation,
            experience: user.experience,
            skills: user.skills,
            education: user.education
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Phone Login Route
router.post('/phone-login', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Basic validation
  if (!phoneNumber || !otp) {
    return res.status(400).json({ msg: 'Please enter phone number and OTP' });
  }

  try {
    // Find user by phone number
    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check OTP
    if (otp !== user.otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Clear OTP after successful login
    user.otp = null;
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err.message);
          return res.status(500).json({ msg: 'Server Error' });
        }
        
        // Include JWT token and user information in the response
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            photo: user.photo,
            designation: user.designation,
            experience: user.experience,
            skills: user.skills,
            education: user.education
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;