/**
 * CODE WALKTHROUGH: CONTACT ROUTES
 * ────────────────────────────────
 * Role: Manages Inquiries and Contact Page metadata.
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const auth = require('../middleware/auth');

// 🕵️ PUBLIC/ADMIN FETCH
router.get('/full', auth, publicController.getContactFull);

// 🛡️ ADMIN UPDATES
router.put('/content', auth, publicController.updateContactContent);
router.put('/emails', auth, publicController.updateContactEmails);
router.put('/socials', auth, publicController.updateContactSocials);
router.put('/branches', auth, publicController.updateContactBranches);

// 🛡️ INQUIRY MANAGEMENT
router.get('/submissions', auth, publicController.getContactInquiries);
router.put('/submissions/:id/status', auth, publicController.updateInquiryStatus);
router.patch('/submissions/:id/read', auth, publicController.markInquiryAsRead);

module.exports = router;
