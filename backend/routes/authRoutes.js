/**
 * CODE WALKTHROUGH: AUTH ROUTES (The Security Gate)
 * ────────────────────────────────────────────────
 * Purpose: Defines endpoints for Login, Password Reset, and Session Management.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🛡️ LOGIN: Prove your identity
router.post('/login', authController.login);

// 🛡️ VERIFY: Check the Master Key
router.post('/verify-key', authController.verifyMasterKey);

// 🛡️ RESET: Change password using the Master Key
router.post('/reset-password', authController.resetPassword);

// 🛡️ LOGOUT: Clear the session
router.post('/logout', authController.logout);

module.exports = router;
