/**
 * CODE WALKTHROUGH: CAREER CONTROLLER (The Global Talent Hub)
 * Role: Handles all logic for Job Board management and Candidate Pipeline.
 * Security: 100% parameterized queries.
 * Tables:
 *   - careers_content  : Hero & Intro JSON blobs (section, content_json)
 *   - open_roles       : Job postings
 *   - job_applications : Candidates (id, job_id, first_name, last_name, email, phone, message, resume_url, status, created_at)
 */

const pool = require('../config/db');

// MISSION 1: Full Careers Page Hydration
exports.getCareersFull = async (req, res) => {
    try {
        const [content] = await pool.query('SELECT * FROM careers_content');
        const [roles] = await pool.query('SELECT * FROM open_roles ORDER BY postedDate DESC');

        const contentMap = {};
        content.forEach(item => {
            try { contentMap[item.section] = JSON.parse(item.content_json); }
            catch (e) { contentMap[item.section] = {}; }
        });

        const hydratedRoles = roles.map(r => ({
            ...r,
            is_active: r.is_active === 1 || r.is_active === true,
            responsibilities: (() => { try { return JSON.parse(r.responsibilities || '[]'); } catch { return []; } })(),
            qualifications: (() => { try { return JSON.parse(r.qualifications || '[]'); } catch { return []; } })()
        }));

        res.status(200).json({
            success: true,
            data: {
                hero: contentMap['hero'] || { tag: '', title: '', tagline: '', backgroundImage: null },
                intro: contentMap['intro'] || { tag: '', heading: '', description: '', image: null },
                openRoles: hydratedRoles
            }
        });
    } catch (err) {
        console.error('❌ Careers Hydration Error:', err.message);
        res.status(500).json({ success: false, message: 'Talent Sync Failure' });
    }
};

// MISSION 2: Update CMS Content (Hero & Intro) — saved as JSON blobs
exports.updateCareersContent = async (req, res) => {
    const { hero, intro } = req.body;
    try {
        const sections = [
            { name: 'hero', content: hero },
            { name: 'intro', content: intro }
        ];
        for (const sec of sections) {
            await pool.query(
                `INSERT INTO careers_content (section, content_json)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
                [sec.name, JSON.stringify(sec.content)]
            );
        }
        res.status(200).json({ success: true, message: 'Careers Narrative saved successfully!' });
    } catch (err) {
        console.error('❌ Content Save Error:', err.message);
        res.status(500).json({ success: false, message: 'Content Persistence Failure' });
    }
};

// MISSION 3: Upsert a Job Role (Add or Edit)
exports.upsertRole = async (req, res) => {
    const {
        id, jobId, jobCode, title, slug, category, jobType,
        experience, openings, roleOverview,
        responsibilities, qualifications, howToApply, is_active
    } = req.body;

    // Auto-generate slug from title if missing
    const finalSlug = slug || title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    try {
        const [result] = await pool.query(
            `INSERT INTO open_roles
                (id, jobId, jobCode, title, slug, category, jobType, experience, openings,
                 roleOverview, responsibilities, qualifications, howToApply, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                title         = VALUES(title),
                slug          = VALUES(slug),
                category      = VALUES(category),
                jobType       = VALUES(jobType),
                experience    = VALUES(experience),
                openings      = VALUES(openings),
                roleOverview  = VALUES(roleOverview),
                responsibilities = VALUES(responsibilities),
                qualifications   = VALUES(qualifications),
                howToApply    = VALUES(howToApply),
                is_active     = VALUES(is_active)`,
            [
                id || null, jobId, jobCode, title, finalSlug, category, jobType || 'Full Time',
                experience || '', openings || 1, roleOverview || '',
                JSON.stringify(responsibilities || []),
                JSON.stringify(qualifications || []),
                howToApply || '',
                is_active !== undefined ? (is_active ? 1 : 0) : 1
            ]
        );
        res.status(200).json({ success: true, message: 'Job role established successfully.', roleId: id || result.insertId });
    } catch (err) {
        console.error('❌ Role Upsert Error:', err.message);
        res.status(500).json({ success: false, message: 'Role Persistence Failure' });
    }
};

// MISSION 4: Delete a Role Permanently
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM open_roles WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Role permanently removed.' });
    } catch (err) {
        console.error('❌ Role Delete Error:', err.message);
        res.status(500).json({ success: false, message: 'De-commissioning Failure' });
    }
};

// MISSION 5: Public Candidate Application (Multi-Part Protocol)
// Real table columns: job_id, first_name, last_name, email, phone, message, resume_url, original_resume_name
exports.submitApplication = async (req, res) => {
    // req.body contains text fields, req.file contains the resume
    const { job_id, first_name, last_name, email, phone, message } = req.body;

    // Construct the public URL path for the database
    const resume_url = req.file ? `/uploads/resumes/${req.file.filename}` : '';
    const original_resume_name = req.file ? req.file.originalname : '';

    try {
        await pool.query(
            `INSERT INTO job_applications (job_id, first_name, last_name, email, phone, message, resume_url, original_resume_name)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [job_id || 0, first_name || '', last_name || '', email, phone, message || '', resume_url, original_resume_name]
        );
        res.status(200).json({ success: true, message: 'Application submitted successfully.' });
    } catch (err) {
        console.error('❌ Application Submit Error:', err.message);
        res.status(500).json({ success: false, message: 'Submission Failure' });
    }
};

// MISSION 6: Admin - Fetch All Applications (Advanced Reporting)
// We JOIN with open_roles to get the real Code and Title for the candidate
exports.getApplications = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.*, 
                r.jobCode, 
                r.title as jobTitle
            FROM job_applications a
            LEFT JOIN open_roles r ON a.job_id = r.id
            ORDER BY a.id DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Applications Fetch Error:', err.message);
        res.status(500).json({ success: false, message: 'Pipeline Sync Failure' });
    }
};

// MISSION 7: Admin - Update Candidate Status
// DB enum: 'New', 'Reviewing', 'Shortlisted', 'Rejected'
// Frontend sends lowercase: 'applied', 'shortlisted', 'hired', 'rejected'
exports.updateApplicationStatus = async (req, res) => {
    const { id, status } = req.body;
    const statusMap = {
        'applied': 'New',
        'shortlisted': 'Shortlisted',
        'hired': 'Hired',
        'rejected': 'Rejected',
        'New': 'New',
        'Reviewing': 'Reviewing',
        'Shortlisted': 'Shortlisted',
        'Hired': 'Hired',
        'Rejected': 'Rejected'
    };
    const dbStatus = statusMap[status] || 'New';
    try {
        await pool.query('UPDATE job_applications SET status = ? WHERE id = ?', [dbStatus, id]);
        res.status(200).json({ success: true, message: 'Status updated successfully.' });
    } catch (err) {
        console.error('❌ Status Update Error:', err.message);
        res.status(500).json({ success: false, message: 'Pipeline Update Failure' });
    }
};
