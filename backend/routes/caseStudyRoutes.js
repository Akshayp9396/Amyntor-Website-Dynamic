/**
 * CODE WALKTHROUGH: CASE STUDY ROUTES (The Door) 🛡️ 🚀 🚥 
 * ──────────────────────────────────────────────────────
 * Role: Defines the absolute entry points for Success Stories.
 * Pattern: Matches the 'Service Section' architecture.
 * Base Path: /api/public/case-studies
 */

const express = require('express');
const router = express.Router();
const caseStudyController = require('../controllers/caseStudyController');

// 🕵️ MISSION 1: Full Hydration (Hero + Case Studies)
// URL: /api/public/case-studies/full
router.get('/full', caseStudyController.getCaseStudiesFull);

// 🕵️ MISSION 2: Admin Update Hero
// URL: /api/public/case-studies/hero
router.put('/hero', caseStudyController.updateCaseStudyHero);

// 🕵️ MISSION 3: Admin Upsert (Add/Update) Case Study
// Note: We use the same 'upsert' pattern as Services
// URL: /api/public/case-studies
router.post('/', caseStudyController.upsertCaseStudy);
router.put('/:id', caseStudyController.upsertCaseStudy);

// 🕵️ MISSION 4: Admin Delete Case Study
// URL: /api/public/case-studies/:id
router.delete('/:id', caseStudyController.deleteCaseStudy);

module.exports = router;
