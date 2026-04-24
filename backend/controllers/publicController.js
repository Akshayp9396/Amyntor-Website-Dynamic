/**
 * CODE WALKTHROUGH: PUBLIC CONTROLLER (The Brain)
 * ──────────────────────────────────────────────
 * 1. Uses the 'db.js' pool to connect to MySQL.
 * 2. Fetches site content using SQL queries like 'SELECT * FROM hero_slides'.
 * 3. Returns the results as a JSON object to the frontend.
 * 4. Includes error handling to ensure the site stays stable even if the DB is empty.
 */

const pool = require('../config/db');
const nodemailer = require('nodemailer');

// 🔐 HELPER: Strategic Email Transporter Setup
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// @desc    Get all hero slides
// @route   GET /api/public/hero
exports.getHeroSlides = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY id ASC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching hero slides:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all stats counters
// @route   GET /api/public/stats
exports.getStats = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM stats_counters');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching stats:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all testimonials
// @route   GET /api/public/testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonials');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching testimonials:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🕵️ ADMIN: HANDLE COMPUTER FILE UPLOAD
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded from computer" });
        }
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ success: true, url: filePath });
    } catch (err) {
        console.error("❌ Error during file upload:", err);
        res.status(500).json({ success: false, message: "Server error during upload" });
    }
};

// 🕵️ ADMIN UPDATE: HERO SLIDES (BULK)
exports.updateHeroBulk = async (req, res) => {
    const { slides } = req.body;
    console.log("💾 RECEIVED HERO SLIDES FOR SAVE:", slides);

    try {
        // 🧪 STEP 1: Clear the old slides
        await pool.query('DELETE FROM hero_slides');

        // 🧪 STEP 2: Insert the new slides (with Computer Photos)
        for (const slide of slides) {
            await pool.query(
                'INSERT INTO hero_slides (tag, title, subtitle, image_url, button_text) VALUES (?, ?, ?, ?, ?)',
                [
                    slide.tag || '',
                    slide.title || '',
                    slide.subtitle || '',
                    slide.image || slide.image_url || '',
                    slide.buttonText || slide.button_text || ''
                ]
            );
        }

        console.log("✅ SUCCESS: Hero Database updated perfectly!");
        res.json({ success: true, message: "Hero slides saved to MySQL!" });
    } catch (err) {
        console.error("❌ ERROR SAVING HERO:", err.message);
        res.status(500).json({ success: false, message: "Server Error during save" });
    }
};

// 🕵️ ADMIN UPDATE: STATS (BULK)
exports.updateStatsBulk = async (req, res) => {
    const { stats } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query('DELETE FROM stats_counters');
        for (const stat of stats) {
            await connection.query(
                'INSERT INTO stats_counters (title, subtitle, value, icon_name) VALUES (?, ?, ?, ?)',
                [stat.title, stat.subtitle, stat.value, stat.icon || stat.icon_name]
            );
        }
        await connection.commit();
        res.json({ success: true, message: "Stats row updated live!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error("❌ Error during stats update:", err);
        res.status(500).json({ success: false });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get about section header data
// @route   GET /api/public/about
exports.getAboutSection = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about_section WHERE id = 1');
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('❌ Error fetching about section:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all active services
// @route   GET /api/public/services
exports.getServices = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services ORDER BY id ASC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching services:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🕵️ ADMIN UPDATE: ABOUT SECTION
exports.updateAbout = async (req, res) => {
    const { tag, title, description, leftCardValue, leftCardText, leftCardDescription, ctaText, ctaLink, mainImage, topImage } = req.body;

    try {
        const query = `
            UPDATE about_section 
            SET tag = ?, title = ?, description = ?, left_card_value = ?, left_card_text = ?, 
                left_card_description = ?, cta_text = ?, cta_link = ?, main_image = ?, top_image = ?
            WHERE id = 1
        `;

        await pool.query(query, [
            tag, title, description, leftCardValue, leftCardText, leftCardDescription,
            ctaText, ctaLink, mainImage, topImage
        ]);

        res.json({ success: true, message: "About section updated correctly!" });
    } catch (err) {
        console.error("❌ Error updating About section:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// --- ABOUT PAGE DETAILED MISSIONS ---

// 🕵️ ADMIN: FETCH FULL ABOUT PAGE DATA
exports.getAboutFull = async (req, res) => {
    try {
        const [hero] = await pool.query('SELECT * FROM about_page_hero WHERE id = 1');
        const [company] = await pool.query('SELECT * FROM about_page_company WHERE id = 1');
        const [cards] = await pool.query('SELECT * FROM about_page_cards');
        const [teamHeader] = await pool.query('SELECT * FROM about_page_team_header WHERE id = 1');
        const [teamMembers] = await pool.query('SELECT * FROM team_members ORDER BY order_index ASC');

        res.json({
            success: true,
            data: {
                hero: hero[0],
                aboutCompany: company[0],
                cards: cards,
                teamSection: {
                    ...teamHeader[0],
                    members: teamMembers
                }
            }
        });
    } catch (err) {
        console.error("❌ Error fetching full about page:", err);
        res.status(500).json({ success: false });
    }
};

// 🕵️ ADMIN UPDATE: ABOUT CONTENT (HERO & COMPANY)
exports.updateAboutContent = async (req, res) => {
    const { hero, aboutCompany } = req.body;
    try {
        // 1. Upsert Hero Section
        await pool.query(
            `INSERT INTO about_page_hero (id, tag, title, tagline, background_image) 
             VALUES (1, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), title = VALUES(title), tagline = VALUES(tagline), background_image = VALUES(background_image)`,
            [hero.tag, hero.title, hero.tagline, hero.backgroundImage || hero.background_image]
        );

        // 2. Upsert Company Details
        await pool.query(
            `INSERT INTO about_page_company (id, tag, heading, description) 
             VALUES (1, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), heading = VALUES(heading), description = VALUES(description)`,
            [aboutCompany.tag, aboutCompany.heading, aboutCompany.description1 || aboutCompany.description]
        );

        res.json({ success: true, message: "Hero & Company details established permanently!" });
    } catch (err) {
        console.error("❌ Error updating About content:", err);
        res.status(500).json({ success: false });
    }
};

// 🕵️ ADMIN UPDATE: ABOUT CARDS (BULK)
exports.updateAboutCards = async (req, res) => {
    const { cards } = req.body;
    try {
        await pool.query('DELETE FROM about_page_cards');
        for (const c of cards) {
            await pool.query(
                'INSERT INTO about_page_cards (title, description, icon) VALUES (?, ?, ?)',
                [c.title, c.description, c.icon]
            );
        }
        res.json({ success: true, message: "Company cards synced correctly!" });
    } catch (err) {
        console.error("❌ Error updating About cards:", err);
        res.status(500).json({ success: false });
    }
};

// 🕵️ ADMIN UPDATE: TEAM MISSION (BULK)
exports.updateAboutTeam = async (req, res) => {
    const { tag, heading, members } = req.body;
    try {
        // 1. Establish Section Header: Bulletproof Upsert for MySQL (ensure no row exists errors)
        await pool.query(
            `REPLACE INTO about_page_team_header (id, tag, heading)
             VALUES (1, ?, ?)`,
            [tag, heading]
        );

        // 2. Sync Members
        await pool.query('DELETE FROM team_members');
        for (let i = 0; i < (members || []).length; i++) {
            const m = members[i];
            await pool.query(
                'INSERT INTO team_members (name, role, image_url, order_index) VALUES (?, ?, ?, ?)',
                [m.name, m.role, m.image || m.image_url, i]
            );
        }
        res.json({ success: true, message: "Leadership Team established mission-ready in MySQL!" });
    } catch (err) {
        console.error("❌ Error updating About Team Persistence:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get testimonial header
// @route   GET /api/public/testimonial-header
exports.getTestimonialHeader = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonial_header WHERE id = 1');
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('❌ Error fetching testimonial header:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🕵️ ADMIN UPDATE: TESTIMONIAL HEADER
exports.updateTestimonialHeader = async (req, res) => {
    const { tag, title, statValue, statText, sideImage } = req.body;
    try {
        await pool.query(
            'UPDATE testimonial_header SET tag = ?, title = ?, stat_value = ?, stat_text = ?, side_image_url = ? WHERE id = 1',
            [tag, title, statValue, statText, sideImage]
        );
        res.json({ success: true, message: "Testimonial header updated!" });
    } catch (err) {
        console.error("❌ Error updating testimonial header:", err);
        res.status(500).json({ success: false });
    }
};

// 🕵️ ADMIN UPDATE: TESTIMONIALS (BULK)
exports.updateTestimonialsBulk = async (req, res) => {
    const { testimonials } = req.body;
    try {
        await pool.query('DELETE FROM testimonials');
        for (const t of testimonials) {
            await pool.query(
                'INSERT INTO testimonials (name, designation, quote, feedback, avatar_url) VALUES (?, ?, ?, ?, ?)',
                [t.name, t.designation, t.quote, t.feedback, t.avatar || t.avatar_url]
            );
        }
        res.json({ success: true, message: "Testimonials synced successfully!" });
    } catch (err) {
        console.error("❌ Error syncing testimonials:", err);
        res.status(500).json({ success: false });
    }
};

// @desc    Get all partners
// @route   GET /api/public/partners
exports.getPartners = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM partners ORDER BY id ASC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ Error fetching partners:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🕵️ ADMIN UPDATE: PARTNERS (BULK)
exports.updatePartnersBulk = async (req, res) => {
    const { partners } = req.body;
    try {
        await pool.query('DELETE FROM partners');
        for (const p of partners) {
            await pool.query(
                'INSERT INTO partners (name, description, logo_url) VALUES (?, ?, ?)',
                [p.name, p.description, p.logo || p.logo_url]
            );
        }
        res.status(200).json({
            success: true,
            status: "success",
            code: "CODE_GREEN",
            http_status: "200 OK",
            message: "Partners ecosystem data synchronized successfully!"
        });
    } catch (err) {
        console.error("❌ Error updating partners:", err);
        res.status(500).json({
            success: false,
            status: "error",
            code: "CODE_RED",
            http_status: "500 Internal Server Error",
            message: "Failed to establish partners mission in database."
        });
    }
};

// @desc    Get Partners Page Hero
// @route   GET /api/public/partners/hero
exports.getPartnersPageHero = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM partners_page_hero WHERE id = 1');
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('❌ Error fetching partners hero:', err.message);
        res.status(500).json({ success: false });
    }
};

// @desc    Update Partners Page Hero
// @route   PUT /api/public/partners/hero
exports.updatePartnersPageHero = async (req, res) => {
    const { tag, title, tagline, backgroundImage } = req.body;
    try {
        await pool.query(
            `INSERT INTO partners_page_hero (id, tag, title, tagline, background_image) 
             VALUES (1, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), title = VALUES(title), tagline = VALUES(tagline), background_image = VALUES(background_image)`,
            [tag, title, tagline, backgroundImage]
        );
        res.status(200).json({
            success: true,
            status: "success",
            code: "CODE_GREEN",
            http_status: "200 OK",
            message: "Partners Hero mission established permanently!"
        });
    } catch (err) {
        console.error("❌ Error updating partners hero:", err);
        res.status(500).json({
            success: false,
            status: "error",
            code: "CODE_RED",
            http_status: "500 Internal Server Error",
            message: "Critical Error: Partners Hero sync failed."
        });
    }
};

// @desc    Get Gallery Page Hero
// @route   GET /api/public/gallery/hero
exports.getGalleryPageHero = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery_page_hero WHERE id = 1');
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('❌ Error fetching gallery hero:', err.message);
        res.status(500).json({ success: false });
    }
};

// @desc    Update Gallery Page Hero
// @route   PUT /api/public/gallery/hero
exports.updateGalleryPageHero = async (req, res) => {
    const { tag, title, tagline, backgroundImage } = req.body;
    try {
        await pool.query(
            `INSERT INTO gallery_page_hero (id, tag, title, tagline, background_image) 
             VALUES (1, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tag = VALUES(tag), title = VALUES(title), tagline = VALUES(tagline), background_image = VALUES(background_image)`,
            [tag, title, tagline, backgroundImage]
        );
        res.status(200).json({
            success: true,
            status: "success",
            code: "CODE_GREEN",
            http_status: "200 OK",
            message: "Gallery visuals established mission-ready!"
        });
    } catch (err) {
        console.error("❌ Error updating gallery hero:", err);
        res.status(500).json({
            success: false,
            status: "error",
            code: "CODE_RED",
            http_status: "500 Internal Server Error",
            message: "Critical Error: Visual sync failed."
        });
    }
};

// --- CONTACT PAGE INFRASTRUCTURE ---

// @desc    Get Full Contact Page Data
// @route   GET /api/public/contact/full
exports.getContactFull = async (req, res) => {
    try {
        const [hero] = await pool.query('SELECT * FROM contact_page_hero WHERE id = 1');
        const [info] = await pool.query('SELECT * FROM contact_page_info WHERE id = 1');
        const [emails] = await pool.query('SELECT * FROM contact_emails ORDER BY id ASC');
        const [socials] = await pool.query('SELECT * FROM contact_socials ORDER BY id ASC');
        const [branchesHeader] = await pool.query('SELECT * FROM contact_page_branches_header WHERE id = 1');
        const [branches] = await pool.query('SELECT * FROM contact_branches ORDER BY order_index ASC');

        res.json({
            success: true,
            data: {
                hero: hero[0] || {},
                info: {
                    ...(info[0] || {}),
                    emails: emails,
                    socials: socials
                },
                branches: {
                    ...(branchesHeader[0] || {}),
                    cards: branches
                }
            }
        });
    } catch (err) {
        console.error("❌ Error fetching contact content:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Update Contact Page Content (Hero + Basic Info)
// @route   PUT /api/public/contact/content
exports.updateContactContent = async (req, res) => {
    const { hero, info } = req.body;
    try {
        // 1. Update Hero
        await pool.query(
            `REPLACE INTO contact_page_hero (id, tag, title, tagline, background_image)
             VALUES (1, ?, ?, ?, ?)`,
            [hero.tag, hero.title, hero.tagline, hero.backgroundImage || hero.background_image]
        );

        // 2. Update Info
        await pool.query(
            `REPLACE INTO contact_page_info (id, tag, title, description, phone_number, phone_hours, whatsapp_number, whatsapp_label, google_maps_url)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                info.tag,
                info.title,
                info.description,
                info.phone?.number || info.phoneNumber || "",
                info.phone?.hours || info.phoneHours || "",
                info.whatsapp?.number || info.whatsappNumber || "",
                info.whatsapp?.label || info.whatsappLabel || "",
                info.googleMapsUrl || ""
            ]
        );

        res.json({ success: true, message: "Contact core content updated!" });
    } catch (err) {
        console.error("❌ Error updating contact core:", err);
        res.status(500).json({ success: false });
    }
};

// @desc    Sync Contact Emails (Bulk)
// @route   PUT /api/public/contact/emails
exports.updateContactEmails = async (req, res) => {
    const { emails } = req.body;
    try {
        await pool.query('DELETE FROM contact_emails');
        for (const e of emails) {
            await pool.query('INSERT INTO contact_emails (label, value) VALUES (?, ?)', [e.label, e.value]);
        }
        res.json({ success: true, message: "Emails synchronized!" });
    } catch (err) {
        console.error("❌ Error syncing emails:", err);
        res.status(500).json({ success: false });
    }
};

// @desc    Sync Contact Socials (Bulk)
// @route   PUT /api/public/contact/socials
exports.updateContactSocials = async (req, res) => {
    const { socials } = req.body;
    try {
        await pool.query('DELETE FROM contact_socials');
        for (const s of socials) {
            await pool.query('INSERT INTO contact_socials (platform, link) VALUES (?, ?)', [s.platform, s.link]);
        }
        res.json({ success: true, message: "Social links updated!" });
    } catch (err) {
        console.error("❌ Error syncing socials:", err);
        res.status(500).json({ success: false });
    }
};

// @desc    Sync Contact Branches (Bulk)
// @route   PUT /api/public/contact/branches
exports.updateContactBranches = async (req, res) => {
    const { header, cards } = req.body;
    try {
        // 1. Update Header
        await pool.query(
            `REPLACE INTO contact_page_branches_header (id, tag, title, description)
             VALUES (1, ?, ?, ?)`,
            [header.tag, header.title, header.description]
        );

        // 2. Sync Cards
        await pool.query('DELETE FROM contact_branches');
        for (let i = 0; i < cards.length; i++) {
            const c = cards[i];
            await pool.query(
                `INSERT INTO contact_branches (city, type, address, phone, email, image_url, order_index)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [c.city, c.type, c.address, c.phone, c.email, c.image || c.image_url, i]
            );
        }
        res.json({ success: true, message: "Office branches established!" });
    } catch (err) {
        console.error("❌ Error syncing branches:", err);
        res.status(500).json({ success: false });
    }
};
// @desc    Submit Contact Form (The Dual Protocol)
// @route   POST /api/public/contact/submit
exports.submitContactInquiry = async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    try {
        // 🧪 STEP 1: Persistent Storage in MySQL
        const query = `
            INSERT INTO contact_submissions (name, email, phone, service, message)
            VALUES (?, ?, ?, ?, ?)
        `;
        await pool.query(query, [name, email, phone, service, message]);

        // 🧪 STEP 2: Professional SMTP Dispatch (Company Alert)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = createTransporter();
            const mailOptions = {
                from: `"Amyntor Strategic Console" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
                subject: `🚨 AMYNTOR TECH INQUIRY: ${name}`,
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; color: #1e293b; border-radius: 12px;">
                        <div style="border-bottom: 2px solid #02a1fd; padding-bottom: 20px; margin-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Inquiry Received</h1>
                            <p style="margin: 5px 0 0; color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">AMYNTOR TECH SOLUTIONS PVT. LTD.</p>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Client</td>
                                    <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                                    <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                                    <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${phone}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Service</td>
                                    <td style="padding: 10px 0; color: #02a1fd; font-weight: 700; font-size: 12px; text-transform: uppercase;">${service || 'General'}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="padding-top: 25px; border-top: 1px solid #f1f5f9;">
                            <p style="color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Inquiry Message</p>
                            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; color: #475569; font-size: 14px; line-height: 1.6; border: 1px solid #f1f5f9;">
                                ${message}
                            </div>
                        </div>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #cbd5e1; font-size: 10px; font-weight: 500; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                            Automated Strategic Intelligence Dispatch
                        </div>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ success: true, message: "Inquiry successfully established and dispatched." });
    } catch (err) {
        console.error("❌ Submission Protocol Error:", err);
        res.status(500).json({ success: false, message: "Server encountered a protocol error during submission." });
    }
};

// @desc    Get All Contact Inquiries (Admin Command)
// @route   GET /api/public/contact/submissions
exports.getContactInquiries = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("❌ Inquiry Retrieval Error:", err);
        res.status(500).json({ success: false, message: "Protocol failure at lead retrieval." });
    }
};

// @desc    Update Inquiry Status
// @route   PATCH /api/public/contact/submissions/:id
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.query(
            'UPDATE contact_submissions SET status = ? WHERE id = ?',
            [status, id]
        );

        res.status(200).json({ success: true, message: 'Status updated silently' });
    } catch (error) {
        console.error('❌ Error updating inquiry status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc    Mark Inquiry as Read
// @route   PATCH /api/public/contact/submissions/:id/read
exports.markInquiryAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE contact_submissions SET is_read = 1 WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Inquiry marked as intelligence read' });
    } catch (error) {
        console.error('❌ Error marking inquiry as read:', error);
        res.status(500).json({ success: false });
    }
};
