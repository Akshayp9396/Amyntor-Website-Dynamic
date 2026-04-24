/**
 * CODE WALKTHROUGH: AUTH CONTROLLER (The Security Brain)
 * ────────────────────────────────────────────────────
 * 1. Login: Verifies credentials using bcrypt hashing and issues a signed JWT.
 * 2. HttpOnly Cookie: Sends the token in a secure, non-JS-accessible cookie (Industry Standard).
 * 3. Master Key Reset: Allows emergency password overrides using a private server-side key.
 */

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🕵️ MISSION 1: ADMIN LOGIN
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Fetch Admin from MySQL
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? AND is_active = 1', [username]);
        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or account inactive.' });
        }

        // 2. Compare Bcrypt Hash
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // 3. Generate Signed JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. Update Last Login (Elite Audit)
        await pool.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

        // 5. Send Secure HttpOnly Cookie
        res.cookie('amyntor_auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 Hours
        });

        res.json({
            success: true,
            user: { username: admin.username, role: 'Super Admin' },
            message: 'Authentication successful.'
        });

    } catch (err) {
        console.error('❌ Auth Error:', err);
        res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
};

// 🕵️ MISSION 2: VERIFY MASTER KEY (Now with Account Check)
exports.verifyMasterKey = async (req, res) => {
    const { username, masterKey } = req.body;

    try {
        // 1. Check if the username exists first
        const [rows] = await pool.query('SELECT username FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid Username: Admin account not found.' });
        }

        // 2. Compare against the secret key in .env
        if (masterKey === process.env.MASTER_PRIVATE_KEY) {
            return res.json({ success: true, message: 'Master Key Verified.' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid Master Key: Access Denied.' });
        }
    } catch (err) {
        console.error('❌ Verify Error:', err);
        res.status(500).json({ success: false, message: 'Server error during verification.' });
    }
};

// 🕵️ MISSION 3: SECURE PASSWORD RESET
exports.resetPassword = async (req, res) => {
    const { username, masterKey, newPassword } = req.body;

    try {
        // 1. Re-verify Master Key for safety
        if (masterKey !== process.env.MASTER_PRIVATE_KEY) {
            return res.status(401).json({ success: false, message: 'Unauthorized reset attempt.' });
        }

        // 2. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update the DB
        const [result] = await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [hashedPassword, username]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        res.json({ success: true, message: 'Admin credentials updated securely.' });

    } catch (err) {
        console.error('❌ Reset Error:', err);
        res.status(500).json({ success: false, message: 'Failed to reset password.' });
    }
};

// 🕵️ MISSION 4: LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('amyntor_auth_token');
    res.json({ success: true, message: 'Session terminated.' });
};
