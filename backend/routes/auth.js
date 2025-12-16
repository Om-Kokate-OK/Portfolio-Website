const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Temporary storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password for Gmail
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        if (user.role === 'admin') {
            // Generate OTP
            const otp = crypto.randomInt(100000, 999999).toString();
            otpStore.set(user._id.toString(), { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min

            // Send OTP email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Admin Login OTP',
                text: `Your OTP for admin login is: ${otp}. It expires in 5 minutes.`
            });

            return res.json({ requiresOtp: true, userId: user._id });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const stored = otpStore.get(userId);
        if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        otpStore.delete(userId);
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register (for initial setup)
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role = 'user' } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, role });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = (req, res, next) => {
  // Dummy auth for now
  // Replace with JWT later if needed
  req.user = { id: "demo-user-id" };
  next();
};

module.exports = router;