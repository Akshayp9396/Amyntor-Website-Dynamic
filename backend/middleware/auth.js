/**
 * CODE WALKTHROUGH: SECURITY GATEKEEPER (The Bouncer)
 * 1. This file checks if a 'key' (JWT) exists for every sensitive request.
 * 2. It grabs the token from the request header (Authorization).
 * 3. It uses 'jsonwebtoken' to verify it.
 * 4. If the token is valid, it lets the request 'pass through' using next().
 * 5. If it's not, it sends a 401: Unauthorized message to the user!
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // 1. Get the 'key' (token) from Headers OR Secure Cookies
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    // 🕵️ EXTRA SECURITY: Check cookies if header is missing (Industry Standard)
    if (!token && req.headers.cookie) {
        const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        token = cookies['amyntor_auth_token'];
    }

    // 2. If no token found, block the request instantly
    if (!token) {
        return res.status(401).json({ success: false, message: '🚫 Access Denied: No Token Provided' });
    }

    // 3. Verify the token using your JWT_SECRET from .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: '⚠️ Invalid or Expired Token' });
        }

        // 4. Attach the user info to the request so controllers can use it
        req.user = user;
        
        // 5. Let the request pass to the next stage (The Controller)
        next();
    });
};

module.exports = authMiddleware;
