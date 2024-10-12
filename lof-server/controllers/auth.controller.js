const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

// Helper function to generate JWT token
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Login or Register
exports.loginOrRegister = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = await User.findOne({ email });

    if (user && user.isApproved) {
      // User is approved, generate a new token for this session
      const token = generateToken(email);
      return res.json({ 
        message: 'Login successful', 
        token,
        isApproved: true 
      });
    }

    // If user doesn't exist or isn't approved, proceed with registration/approval process
    const token = generateToken(email);

    user = await User.findOneAndUpdate(
      { email },
      { $set: { email, token, isApproved: false } },
      { upsert: true, new: true }
    );

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const approvalLink = `${process.env.FRONTEND_URL}/api/auth/approve?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'New User Registration Approval',
      text: `A user (${email}) has requested access. Click this link to approve: ${approvalLink}`,
      html: `<p>A user (${email}) has requested access. Click <a href="${approvalLink}">here</a> to approve.</p>`,
    });

    res.json({ 
      message: 'Registration request sent. Please wait for admin approval.',
      isApproved: false
    });
  } catch (error) {
    console.error('Login/Registration error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during login/registration' });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    if (user.isApproved) {
      return res.json({ message: 'User is already approved' });
    }

    user.isApproved = true;
    await user.save();

    // Send approval email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const loginLink = `${process.env.FRONTEND_URL}/login`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your account has been approved',
      text: `Your account has been approved. You can now log in at: ${loginLink}`,
      html: `<p>Your account has been approved. You can now <a href="${loginLink}">log in</a>.</p>`,
    });

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during approval' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Verify token
exports.verifyToken = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const { email } = verifyToken(token);
    res.json({ email });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(400).json({ error: error.message || 'Invalid or expired token' });
  }
};
