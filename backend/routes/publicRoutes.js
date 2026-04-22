/**
 * CODE WALKTHROUGH: PUBLIC ROUTES (The Doors)
 * ──────────────────────────────────────────
 * 1. Links the 'GET' paths to specific functions in the publicController.
 * 2. This file defines exactly what the public can see without an admin login.
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const multer = require('multer');
const path = require('path');

// 🕵️ MULTER SECURITY: Lock down formats and file size
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `img-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Format rejected. Only images (JPG, PNG, WebP, SVG) are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 🛡️ 5MB Hard Limit
});

// === PUBLIC READ ROUTES ===
router.get('/hero', publicController.getHeroSlides);
router.get('/stats', publicController.getStats);
router.get('/testimonials', publicController.getTestimonials);
router.get('/about', publicController.getAboutSection);
router.get('/services', publicController.getServices);
router.get('/testimonial-header', publicController.getTestimonialHeader);
router.get('/partners', publicController.getPartners);
router.post('/contact/submit', publicController.submitContactInquiry);
router.get('/contact/submissions', publicController.getContactInquiries);
router.put('/contact/submissions/:id/status', publicController.updateInquiryStatus);

// === ADMIN UPLOAD ROUTE ===
router.post('/upload', upload.single('image'), publicController.uploadImage);

// Admin Update Routes
router.get('/about/full', publicController.getAboutFull);
router.put('/about/content', publicController.updateAboutContent);
router.put('/about/team', publicController.updateAboutTeam);
router.put('/about/cards', publicController.updateAboutCards);

router.put('/hero/bulk', publicController.updateHeroBulk);
router.put('/stats/bulk', publicController.updateStatsBulk);
router.put('/about', publicController.updateAbout);
router.put('/testimonial-header', publicController.updateTestimonialHeader);
router.put('/testimonials/bulk', publicController.updateTestimonialsBulk);
router.put('/partners/bulk', publicController.updatePartnersBulk);
router.get('/partners/hero', publicController.getPartnersPageHero);
router.put('/partners/hero', publicController.updatePartnersPageHero);
router.get('/gallery/hero', publicController.getGalleryPageHero);
router.put('/gallery/hero', publicController.updateGalleryPageHero);
router.get('/contact/full', publicController.getContactFull);
router.put('/contact/content', publicController.updateContactContent);
router.put('/contact/emails', publicController.updateContactEmails);
router.put('/contact/socials', publicController.updateContactSocials);
router.put('/contact/branches', publicController.updateContactBranches);

module.exports = router;
