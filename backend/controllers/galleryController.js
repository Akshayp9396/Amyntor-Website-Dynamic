/**
 * Code Walkthrough: galleryController.js
 * 
 * Purpose: Handles all backend logic for the Gallery/Events section.
 * Methods:
 * - getGalleryFull: Fetches all albums and their nested images to serve the dynamic public UI.
 * - upsertAlbum: Creates or updates an event folder.
 * - deleteAlbum: Removes an event folder completely.
 * - addImageToAlbum: Uploads a photo to a specific folder.
 * - deleteImage: Removes a specific photo from a folder.
 */

const pool = require('../config/db');

// 🛡️ PUBLIC READ: Fetch Albums with Images inside
exports.getGalleryFull = async (req, res) => {
    try {
        const [albums] = await pool.query('SELECT * FROM gallery_albums ORDER BY event_date DESC, created_at DESC');
        const [images] = await pool.query('SELECT * FROM gallery_images');

        // We build the UI's JSON structure cleanly
        const parsedEvents = albums.map(album => {
            const albumImages = images.filter(img => img.album_id === album.id).map(img => ({
                id: img.id,
                title: img.title || "",
                url: img.image_url
            }));

            return {
                id: album.id,
                title: album.title,
                date: album.event_date,
                previewImage: album.preview_image,
                images: albumImages
            };
        });

        res.json({
            success: true,
            events: parsedEvents
        });
    } catch (err) {
        console.error("❌ Gallery Hydration Failure:", err);
        res.status(500).json({ success: false, message: "Gallery fetch error." });
    }
};

// 🛡️ ADMIN: Create or Edit an Album (Folder)
exports.upsertAlbum = async (req, res) => {
    const { id, title, date, previewImage } = req.body;

    try {
        if (id && !isNaN(id) && id > 1000000) {
            // Dummy ID from UI - Create New
            await pool.query(
                `INSERT INTO gallery_albums (title, event_date, preview_image) VALUES (?, ?, ?)`,
                [title, date, previewImage]
            );
        } else if (id) {
            // Update Existing
            await pool.query(
                `UPDATE gallery_albums SET title = ?, event_date = ?, preview_image = ? WHERE id = ?`,
                [title, date, previewImage, id]
            );
        } else {
            // Create New
            await pool.query(
                `INSERT INTO gallery_albums (title, event_date, preview_image) VALUES (?, ?, ?)`,
                [title, date, previewImage]
            );
        }
        res.json({ success: true, message: "Album configuration successful." });
    } catch (err) {
        console.error("❌ Album Persistence Failure:", err);
        res.status(500).json({ success: false, message: "Album persistence error." });
    }
};

// 🛡️ ADMIN: Remove an Album
exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM gallery_albums WHERE id = ?', [id]);
        res.json({ success: true, message: "Album de-commissioned." });
    } catch (err) {
        console.error("❌ Album Deletion Failure:", err);
        res.status(500).json({ success: false, message: "Album deletion error." });
    }
};

// 🛡️ ADMIN: Add Image to Album
exports.addImageToAlbum = async (req, res) => {
    const { album_id, title, image_url } = req.body;
    try {
        await pool.query(
            `INSERT INTO gallery_images (album_id, title, image_url) VALUES (?, ?, ?)`,
            [album_id, title, image_url]
        );
        res.json({ success: true, message: "Image added successfully." });
    } catch (err) {
        console.error("❌ Image Add Failure:", err);
        res.status(500).json({ success: false, message: "Failed to add image." });
    }
};

// 🛡️ ADMIN: Remove Image
exports.deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM gallery_images WHERE id = ?', [id]);
        res.json({ success: true, message: "Image removed." });
    } catch (err) {
        console.error("❌ Image Deletion Failure:", err);
        res.status(500).json({ success: false, message: "Image removal error." });
    }
};
