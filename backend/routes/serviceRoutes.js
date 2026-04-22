/**
 * CODE WALKTHROUGH: SERVICE ROUTES (The Door)
 * ──────────────────────────────────────────
 * Role: This file defines the absolute entry points for all Services data.
 * Concept: It links the 'Door' (URL path) to the 'Brain' (Controller mission).
 * Base Path: /api/public/services
 */

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// 🕵️ MISSION 1: Let the public/admin 'Read' all service missions
// URL: /api/public/services
router.get('/', serviceController.getAllServices);

// 🕵️ MISSION 2: Global Hydration (Full Services Page)
// URL: /api/public/services/full
router.get('/full', serviceController.getServicesFull);

// 🕵️ MISSION 3: Fetch detailed expertise for a single service slug
// URL: /api/public/services/:slug
router.get('/:slug', serviceController.getServiceBySlug);

// 🕵️ MISSION 4: Admin 'Upsert' (Create/Update) Expertise
// URL: /api/public/services
router.post('/', serviceController.upsertService);
router.put('/:id', serviceController.upsertService);

// 🕵️ MISSION 5: Admin Update Narrative (Hero & Intro)
// URL: /api/public/services/content
router.put('/content/bulk', serviceController.updateServicePageContent);

// 🕵️ MISSION 6: Admin 'Delete' Expertise
// URL: /api/public/services/:id
router.delete('/:id', serviceController.deleteService);

module.exports = router;
