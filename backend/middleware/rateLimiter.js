const rateLimit = require('express-rate-limit');

/**
 * AMYNTOR TECH: SECURITY MIDDLEWARE
 * ────────────────────────────────
 * Purpose: Prevent Spam Attacks on the Contact Form.
 * Rule: Max 5 submissions per hour from a single IP.
 */

const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: '🚨 Too many submissions from this IP. Please try again after an hour.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { contactFormLimiter };
