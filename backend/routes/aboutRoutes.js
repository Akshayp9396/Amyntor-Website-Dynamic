/**
 * CODE WALKTHROUGH: ABOUT ROUTES (The Door)
 * ──────────────────────────────────────────
 * Role: This file defines the URLs (Endpoints) for the About page.
 * Concept: It links the "Doors" (Paths) to the "Brains" (Controllers).
 */

const express = require('express');
const router = express.Router(); // 🚦 Create the traffic controller
const aboutController = require('../controllers/aboutController'); // 🧠 Import the Brain

// 🕵️ MISSION 1: Let the public READ the About data
// Path: /api/public/about/full
router.get('/full', aboutController.getAboutPageData);

// 🕵️ MISSION 2: Let the Admin SAVE general content (Hero/Company)
// Path: /api/public/about/content
router.put('/content', aboutController.updateAboutPageContent);

// 🕵️ MISSION 3: Let the Admin SAVE the Team Roster
// Path: /api/public/about/team
router.put('/team', aboutController.updateTeamBulk);

// 🕵️ MISSION 4: Let the Admin SAVE Company Cards (Mission/Vision)
// Path: /api/public/about/cards
router.put('/cards', aboutController.updateCardsBulk);

module.exports = router; // 📦 Package the doors for the server to use
