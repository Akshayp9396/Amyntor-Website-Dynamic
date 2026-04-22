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
const pool = require('./config/db');

// Initialize Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // Allows frontend to access the API
app.use(express.json({ limit: '10mb' })); // 🛡️ MISSION: Establishing 100% Safety Zone (Accommodates 5MB files + Base64 Overhead)
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 🕵️ Photo Gallery: Serve the uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes (The Doors)
const publicRoutes = require('./routes/publicRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const serviceRoutes = require('./routes/serviceRoutes');
const caseStudyRoutes = require('./routes/caseStudyRoutes');
const blogRoutes = require('./routes/blogRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const careerRoutes = require('./routes/careerRoutes');

// Use Routes (Wiring them up)
app.use('/api/public', publicRoutes);
app.use('/api/public/about', aboutRoutes);
app.use('/api/public/services', serviceRoutes);
app.use('/api/public/case-studies', caseStudyRoutes);
app.use('/api/public/blogs', blogRoutes); // 🛡️ MISSION: Establishing Blog Route Frequency
app.use('/api/gallery', galleryRoutes);
app.use('/api/careers', careerRoutes); // 🛡️ Recruitment Intelligence Hub

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Amyntor Tech API is running smoothly...');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/public`);
});
