/**
 * CODE WALKTHROUGH: CASE STUDY CONTROLLER (The Brain) 🛡️ 🚀 🚥 
 * ────────────────────────────────────────────────────────
 * Role: Handles absolute persistence and retrieval for Success Stories.
 * Pattern: Matches the 'Service Section' architecture.
 * Standards: 100% Parameterized queries + MySQL JSON Column support.
 */

const pool = require('../config/db');

// 🛡️ MISSION 1: Full Hydration (Hero + All Case Studies)
exports.getCaseStudiesFull = async (req, res) => {
    try {
        const [hero] = await pool.query('SELECT * FROM case_study_hero WHERE id = 1');
        const [studies] = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC');

        res.status(200).json({
            success: true,
            data: {
                hero: hero[0] || {},
                caseStudies: studies || []
            }
        });
    } catch (err) {
        console.error('❌ Error fetching case studies:', err.message);
        res.status(500).json({ success: false, message: 'Hydration Failure' });
    }
};

// 🛡️ MISSION 2: Admin Upsert (Add/Update) Case Study
exports.upsertCaseStudy = async (req, res) => {
    const { 
        id, title, tags, image, introduction, 
        scope_of_work, site_actions_intro, site_actions, 
        results_and_benefits, conclusion 
    } = req.body;

    try {
        // 🚦 MISSION: Absolute Persistence with JSON Support
        // We stringify the objects/arrays because mysql2 handles JSON columns as strings
        const [result] = await pool.query(
            `INSERT INTO case_studies 
                (id, title, tags, image, introduction, scope_of_work, site_actions_intro, site_actions, results_and_benefits, conclusion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                tags = VALUES(tags),
                image = VALUES(image),
                introduction = VALUES(introduction),
                scope_of_work = VALUES(scope_of_work),
                site_actions_intro = VALUES(site_actions_intro),
                site_actions = VALUES(site_actions),
                results_and_benefits = VALUES(results_and_benefits),
                conclusion = VALUES(conclusion)`,
            [
                id || null, 
                title, 
                JSON.stringify(tags || []), 
                image, 
                introduction, 
                JSON.stringify(scope_of_work || {}), 
                site_actions_intro, 
                JSON.stringify(site_actions || []), 
                JSON.stringify(results_and_benefits || {}), 
                conclusion
            ]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Success story established mission-ready!',
            caseStudyId: id || result.insertId 
        });
    } catch (err) {
        console.error('❌ Case Study Persistence Failure:', err.message);
        res.status(500).json({ success: false, message: 'Persistence Failure' });
    }
};

// 🛡️ MISSION 3: Admin Update Case Study Hero
exports.updateCaseStudyHero = async (req, res) => {
    const { tag, title, tagline, backgroundImage } = req.body;
    try {
        await pool.query(
            `INSERT INTO case_study_hero (id, tag, title, tagline, background_image)
             VALUES (1, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                tag = VALUES(tag), title = VALUES(title), 
                tagline = VALUES(tagline), background_image = VALUES(background_image)`,
            [tag, title, tagline, backgroundImage]
        );
        res.status(200).json({ success: true, message: 'Hero Section updated successfully!' });
    } catch (err) {
        console.error('❌ Hero Update Failure:', err.message);
        res.status(500).json({ success: false, message: 'Update Failure' });
    }
};

// 🛡️ MISSION 4: Admin Delete Case Study
exports.deleteCaseStudy = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM case_studies WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Case study de-commissioned!' });
    } catch (err) {
        console.error('❌ Deletion Failure:', err.message);
        res.status(500).json({ success: false, message: 'Deletion Failure' });
    }
};
