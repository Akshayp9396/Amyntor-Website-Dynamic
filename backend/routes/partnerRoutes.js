/**
 * CODE WALKTHROUGH: PARTNER ROUTES
 * ────────────────────────────────
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const auth = require('../middleware/auth');

// 🕵️ HERO MISSIONS
router.get('/hero', publicController.getPartnersPageHero);
router.put('/hero', auth, publicController.updatePartnersPageHero);

// 🛡️ ECOSYSTEM UPDATES
router.put('/bulk', auth, publicController.updatePartnersBulk);

module.exports = router;
