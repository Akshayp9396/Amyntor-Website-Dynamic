const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// 🛡️ MISSION: READ MISSION
router.get('/full', blogController.getBlogsFull);

// 🛡️ MISSION: ADMIN MISSIONS
router.post('/hero', blogController.updateBlogHero);
router.post('/', blogController.upsertBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
