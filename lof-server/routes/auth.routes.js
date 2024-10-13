const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login or Register route
router.post('/login-or-register', authController.loginOrRegister);

// Approve user route
router.get('/approve', authController.approveUser);

// Logout route
router.post('/logout', authController.logout);

// Verify token route
router.get('/verify-token', authController.verifyToken);

module.exports = router;

