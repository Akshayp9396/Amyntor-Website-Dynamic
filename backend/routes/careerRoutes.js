/**
 * CODE WALKTHROUGH: CAREER ROUTES (The Talent Gateways)
 * ─────────────────────────────────────────────────────
 * Purpose: Routes both public candidate submissions and admin recruitment management.
 * Mounted at: /api/careers in server.js
 */

const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🛡️ MISSION: Professional Resume Upload Architecture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/resumes';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Safe filename protocol: [timestamp]-[random]-[original-name]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 } // Enforce 1MB limit at server level
});

// === PUBLIC CAREER ROUTES ===
// Full hydration: Hero + Intro + all active roles
router.get('/full', careerController.getCareersFull);

// Candidate applies for a job (Professional Multi-Part Form Data)
router.post('/apply', upload.single('resume'), careerController.submitApplication);

// === ADMIN CAREER ROUTES ===
// Update hero & intro branding content
router.put('/content', careerController.updateCareersContent);

// Job board CRUD: Add or edit a role
router.post('/role', careerController.upsertRole);

// Delete a role permanently
router.delete('/role/:id', careerController.deleteRole);

// Talent pipeline: Get all applications
router.get('/applications', careerController.getApplications);

// Update a candidate's status (Applied → Shortlisted → Hired etc.)
router.put('/application/status', careerController.updateApplicationStatus);

module.exports = router;
