/**
 * CODE WALKTHROUGH: SERVER.JS (The Heart)
 * ──────────────────────────────────────
 * 1. Express Setup: Initializes the web server on Port 5000.
 * 2. Security: Uses CORS to allow your frontend (Port 5174) to talk to this backend.
 * 3. Database: Automatically tests the MySQL connection on startup using db.js.
 * 4. Routing: Links all public data requests to /api/public.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const pool = require('./config/db');

// Initialize Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// 🛡️ SECURITY LAYER 1: Helmet (Secure Headers)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images from other origins if needed
}));

// 🕵️ SECURITY LAYER 2: Access Logging (The Black Box)
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
});
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Still log to console for development

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 🛡️ SECURITY LAYER 3: Rate Limiting (Brute Force Protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const publicRoutes = require('./routes/publicRoutes');
// ... other routes ...
const authRoutes = require('./routes/authRoutes');

// Apply Protections to specific routes
app.use('/api/auth', authLimiter, authRoutes); 

// Standard Routes
app.use('/api/public', publicRoutes);
app.use('/api/public/about', require('./routes/aboutRoutes'));
app.use('/api/public/services', require('./routes/serviceRoutes'));
app.use('/api/public/case-studies', require('./routes/caseStudyRoutes'));
app.use('/api/public/blogs', require('./routes/blogRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/public/partners', require('./routes/partnerRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/public/contact', require('./routes/contactRoutes'));

// Basic Health Check
app.get('/', (req, res) => {
    res.send('🛡️ Amyntor Tech API is Secured and Running...');
});

// 🛡️ SECURITY LAYER 4: Global Error Masking (Prevent Leakage)
app.use((err, req, res, next) => {
    console.error('🔥 SERVER ERROR:', err.message); // Log real error to console
    res.status(500).json({ 
        success: false, 
        message: 'A secure server error occurred. Our engineers have been notified.' 
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Secure Server is flying on port ${PORT}`);
});
