/**
 * Code Walkthrough: galleryRoutes.js
 * Purpose: Routes for Gallery/Event Folders and internal Images.
 */

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');

// 🕵️ PUBLIC ENDPOINT
// GET /api/gallery/public -> Fetches all event folders and inner images
router.get('/public', galleryController.getGalleryFull);

// 🛡️ ADMIN SECURE ENDPOINTS (JWT bypassed temporarily to match repo state without frontend auth integration)
router.post('/albums', galleryController.upsertAlbum);
router.put('/albums/:id', galleryController.upsertAlbum);
router.delete('/albums/:id', galleryController.deleteAlbum);

router.post('/images', galleryController.addImageToAlbum);
router.delete('/images/:id', galleryController.deleteImage);

module.exports = router;
