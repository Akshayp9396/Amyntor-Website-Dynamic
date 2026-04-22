/**
 * CODE WALKTHROUGH: ABOUT CONTROLLER (The Brain)
 * ──────────────────────────────────────────────
 * Role: This file handles the logic for the About Us page.
 * Concept: It receives requests from the Router, talks to MySQL, 
 * and sends back the data (success or failure).
 */

const pool = require('../config/db'); // 🔗 Connection to MySQL

// 🛡️ MISSION 1: Get all data for the About Page
// @route   GET /api/public/about/full
exports.getAboutPageData = async (req, res) => {
    try {
        // 1. Fetch Hero Section (Single Row)
        const [hero] = await pool.query('SELECT * FROM about_page_hero WHERE id = 1');

        // 2. Fetch Company Overview (Single Row)
        const [company] = await pool.query('SELECT * FROM about_page_company WHERE id = 1');

        // 3. Fetch Company Cards (Multiple Rows - Mission, Vision, etc.)
        const [cards] = await pool.query('SELECT * FROM about_page_cards');

        // 4. Fetch Team Header (The Section Title/Tag)
        const [teamHeader] = await pool.query('SELECT * FROM about_page_team_header WHERE id = 1');

        // 5. Fetch Team Members (Multiple Rows)
        const [team] = await pool.query('SELECT * FROM team_members ORDER BY id ASC');

        // 🕵️ ARCHITECT'S NOTE: We package everything into ONE object 
        // to the frontend only needs to make ONE request to see the whole page.
        res.status(200).json({
            success: true,
            data: {
                hero: hero[0] || {},
                aboutCompany: {
                    ...(company[0] || {}),
                    cards: cards || []
                },
                aboutTeam: {
                    ...(teamHeader[0] || {}),
                    members: team || []
                }
            }
        });
    } catch (err) {
        // 🚥 If you see this in your console, it means a table is likely missing!
        console.error('❌ Error fetching About Page data:', err.message);
        res.status(500).json({ success: false, message: 'Server Error during fetch: ' + err.message });
    }
};

// 🛡️ MISSION 2: Save updated Hero & Company content
// @route   PUT /api/public/about-page/content
exports.updateAboutPageContent = async (req, res) => {
    // 🕵️ Concept: "Destructuring" - Extract fields from the incoming data (req.body)
    const { hero, aboutCompany } = req.body;

    try {
        // 1. Update Hero
        await pool.query(
            'UPDATE about_page_hero SET tag = ?, title = ?, tagline = ?, background_image = ? WHERE id = 1',
            [hero.tag, hero.title, hero.tagline, hero.backgroundImage]
        );

        // 2. Update Company Details
        await pool.query(
            'UPDATE about_page_company SET tag = ?, heading = ?, description = ? WHERE id = 1',
            [aboutCompany.tag, aboutCompany.heading, aboutCompany.description1]
        );

        res.status(200).json({ success: true, message: 'General about content updated!' });
    } catch (err) {
        console.error('❌ Error updating About Content:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update content' });
    }
};

// 🛡️ MISSION 3: Save Team Header & Members (Bulk)
// @route   PUT /api/public/about-page/team
exports.updateTeamBulk = async (req, res) => {
    const { tag, heading, members } = req.body;

    try {
        // 🕵️ CONCEPT: Double Update
        // 1. Update the Header (Single row)
        await pool.query(
            'UPDATE about_page_team_header SET tag = ?, heading = ? WHERE id = 1',
            [tag, heading]
        );

        // 2. Clear & Rebuild the Members list
        await pool.query('DELETE FROM team_members');
        for (const m of members) {
            await pool.query(
                'INSERT INTO team_members (name, role, image_url) VALUES (?, ?, ?)',
                [m.name, m.role, m.image || m.image_url]
            );
        }

        res.status(200).json({ success: true, message: 'Team roster synchronized!' });
    } catch (err) {
        console.error('❌ Team Sync Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to sync team' });
    }
};

// 🛡️ MISSION 4: Save Company Cards (Bulk - Mission/Vision/Values)
// @route   PUT /api/public/about-page/cards
exports.updateCardsBulk = async (req, res) => {
    const { cards } = req.body;

    try {
        await pool.query('DELETE FROM about_page_cards');

        for (const c of cards) {
            await pool.query(
                'INSERT INTO about_page_cards (title, description, icon) VALUES (?, ?, ?)',
                [c.title, c.description, c.icon]
            );
        }

        res.status(200).json({ success: true, message: 'Company cards updated!' });
    } catch (err) {
        console.error('❌ Cards Sync Error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to sync cards' });
    }
};
