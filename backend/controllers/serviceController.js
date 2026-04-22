/**
 * CODE WALKTHROUGH: SERVICE CONTROLLER (The Brain)
 * ────────────────────────────────────────────────
 * Role: This file handles the absolute logic for the Services feature.
 * Concept: It receives requests from the Router, talks to MySQL (using 100% 
 * parameterized queries for security), and sends back the expertise data.
 */

const pool = require('../config/db');

// 🛡️ MISSION 1: Global Hydration (Full Services Page)
exports.getServicesFull = async (req, res) => {
    try {
        const [hero] = await pool.query('SELECT * FROM services_page_hero WHERE id = 1');
        const [intro] = await pool.query('SELECT * FROM services_page_intro WHERE id = 1');
        
        // 🚦 Absolute Relational Hydration: Get services and their sub-features
        const [services] = await pool.query('SELECT * FROM services ORDER BY id ASC');
        const [features] = await pool.query('SELECT * FROM service_features');

        // 🧠 Mission: Mapping the sub-features and conclusions back to their absolute parent
        const hydratedServices = services.map(s => ({
            ...s,
            conclusion: s.conclusion || "",
            cards: features.filter(f => f.service_id === s.id)
        }));

        res.status(200).json({ 
            success: true, 
            data: {
                hero: hero[0] || {},
                serviceIntro: intro[0] || {},
                servicesList: { items: hydratedServices || [] }
            }
        });
    } catch (err) {
        console.error('❌ Error fetching full services page:', err.message);
        res.status(500).json({ success: false, message: 'Hydration Failure' });
    }
};

// 🛡️ MISSION 2: Fetch all services (Minimal List)
exports.getAllServices = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services ORDER BY id ASC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching services:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🛡️ MISSION 3: Update Service Page Content (Hero & Intro)
exports.updateServicePageContent = async (req, res) => {
    const { hero, serviceIntro } = req.body;
    try {
        // 1. Upsert Hero
        await pool.query(
            `INSERT INTO services_page_hero (id, tag, title, tagline, background_image)
             VALUES (1, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), title = VALUES(title), tagline = VALUES(tagline), background_image = VALUES(background_image)`,
            [hero.tag, hero.title, hero.tagline, hero.backgroundImage || hero.background_image]
        );

        // 2. Upsert Intro
        await pool.query(
            `INSERT INTO services_page_intro (id, tag, heading, description)
             VALUES (1, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), heading = VALUES(heading), description = VALUES(description)`,
            [serviceIntro.tag, serviceIntro.heading, serviceIntro.description]
        );

        res.status(200).json({ success: true, message: 'Services Narrative established mission-ready!' });
    } catch (err) {
        console.error('❌ Error updating services page content:', err.message);
        res.status(500).json({ success: false, message: 'Persistence Failure' });
    }
};

// 🛡️ MISSION 4: Get single service details
exports.getServiceBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const [service] = await pool.query('SELECT * FROM services WHERE slug = ?', [slug]);
        if (service.length === 0) {
            return res.status(404).json({ success: false, message: 'Service Mission Not Found' });
        }

        // Also fetch related features for this specific service
        const [features] = await pool.query('SELECT * FROM service_features WHERE service_id = ?', [service[0].id]);

        res.status(200).json({ 
            success: true, 
            data: { ...service[0], conclusion: service[0].conclusion || "", features: features || [] } 
        });
    } catch (err) {
        console.error('❌ Error fetching service details:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🛡️ MISSION 5: Admin Upsert (Add/Update) Service & its Features
exports.upsertService = async (req, res) => {
    const { id, title, slug, description, icon, image_url, conclusion, cards } = req.body;
    
    // 🚦 Start Transaction for 100% Atomic Integrity
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        let serviceId = id;

        // 1. Upsert Main Service
        const [result] = await conn.query(
            `INSERT INTO services (id, title, slug, description, icon, image_url, conclusion)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                title = VALUES(title), 
                slug = VALUES(slug), 
                description = VALUES(description), 
                icon = VALUES(icon), 
                image_url = VALUES(image_url),
                conclusion = VALUES(conclusion)`,
            [id || null, title, slug, description, icon, image_url, conclusion]
        );
        
        if (!id) serviceId = result.insertId;

        // 2. Refresh Features (Delete & Re-insert pattern for nested cards)
        await conn.query('DELETE FROM service_features WHERE service_id = ?', [serviceId]);
        
        if (Array.isArray(cards) && cards.length > 0) {
            // 🕵️ MISSION: Absolute Array Padding for mysql2 Bulk Mission
            const featureValues = cards.map(c => [serviceId, c.title || 'No Title', c.description || '', c.icon || '']);
            await conn.query(
                'INSERT INTO service_features (service_id, title, description, icon) VALUES ?',
                [featureValues] // 🚦 This is the world-class [ [ [v1,v1], [v2,v2] ] ] pattern
            );
        }

        await conn.commit();
        res.status(200).json({ 
            success: true, 
            message: 'Expertise mission established mission-ready!',
            serviceId 
        });
    } catch (err) {
        await conn.rollback();
        console.error('❌ Service Persistence Failure:', err.message);
        res.status(500).json({ success: false, message: 'Atomic Integrity Breach' });
    } finally {
        conn.release();
    }
};

// 🛡️ MISSION 4: Delete Service (The De-commission mission)
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM services WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Service mission de-commissioned!' });
    } catch (err) {
        console.error('❌ Error deleting service:', err.message);
        res.status(500).json({ success: false, message: 'Deletion Error' });
    }
};
