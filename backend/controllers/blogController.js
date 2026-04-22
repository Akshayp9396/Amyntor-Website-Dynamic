/**
 * Code Walkthrough: blogController.js
 */

const pool = require('../config/db');

// 🛡️ MISSION: Hydration Authority
exports.getBlogsFull = async (req, res) => {
    try {
        const [hero] = await pool.query('SELECT * FROM blog_hero LIMIT 1');
        const [blogs] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');

        // Parse JSON content
        const parsedBlogs = blogs.map(b => ({
            ...b,
            sections: b.content ? JSON.parse(b.content) : []
        }));

        const heroData = hero[0] || {};
        heroData.backgroundImage = heroData.background_image || "";
        delete heroData.background_image;
        heroData.breadcrumbs = [
            { label: "Home", link: "/" },
            { label: "Resources", link: "#" },
            { label: "Blogs", link: "/blogs" }
        ];

        res.json({
            success: true,
            hero: heroData,
            blogList: { 
                heading: "Latest Articles",
                tag: "INSIGHTS",
                items: parsedBlogs 
            }
        });
    } catch (err) {
        console.error("❌ Hydration Failure:", err);
        res.status(500).json({ success: false, message: "Registry error." });
    }
};

// 🛡️ MISSION: Hero Persistence
exports.updateBlogHero = async (req, res) => {
    const { tag, title, tagline, backgroundImage } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM blog_hero LIMIT 1');
        if (existing.length > 0) {
            await pool.query(
                'UPDATE blog_hero SET tag = ?, title = ?, tagline = ?, background_image = ? WHERE id = ?',
                [tag, title, tagline, backgroundImage, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO blog_hero (tag, title, tagline, background_image) VALUES (?, ?, ?, ?)',
                [tag, title, tagline, backgroundImage]
            );
        }
        res.json({ success: true, message: "Hero registry updated." });
    } catch (err) {
        console.error("❌ Hero Update Failure:", err);
        res.status(500).json({ success: false, message: "Hero persistence error." });
    }
};

// 🛡️ MISSION: Article CRUD Authority
exports.upsertBlog = async (req, res) => {
    const { id, title, slug, date, image, overview, sections, conclusion } = req.body;
    const sectionsJSON = JSON.stringify(sections);

    try {
        if (id && !isNaN(id) && id > 1000000) { 
            // New article with dummy ID from UI
            await pool.query(
                'INSERT INTO blogs (title, slug, date, image, overview, content, conclusion, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                [title, slug, date, image, overview, sectionsJSON, conclusion]
            );
        } else if (id) {
            // Edit existing
            await pool.query(
                'UPDATE blogs SET title = ?, slug = ?, date = ?, image = ?, overview = ?, content = ?, conclusion = ? WHERE id = ?',
                [title, slug, date, image, overview, sectionsJSON, conclusion, id]
            );
        } else {
            // Fresh insert
            await pool.query(
                'INSERT INTO blogs (title, slug, date, image, overview, content, conclusion) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, slug, date, image, overview, sectionsJSON, conclusion]
            );
        }
        res.json({ success: true, message: "Article mission successful." });
    } catch (err) {
        console.error("❌ Article Persistence Failure:", err);
        res.status(500).json({ success: false, message: "Persistence error." });
    }
};

exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
        res.json({ success: true, message: "Article de-commissioned." });
    } catch (err) {
        console.error("❌ Deletion Failure:", err);
        res.status(500).json({ success: false, message: "Decommissioning error." });
    }
};
