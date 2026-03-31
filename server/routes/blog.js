const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database');

// GET tous les articles publiés
router.get('/', async (req, res) => {
    try {
        const posts = await db.all(
            `SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`
        );
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération articles' });
    }
});

// GET un article par slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await db.get(
            `SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'`,
            [req.params.slug]
        );
        if (!post) {
            return res.status(404).json({ success: false, message: 'Article non trouvé' });
        }
        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération article' });
    }
});

// POST créer un article
router.post('/', [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('slug').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, slug, excerpt, content, image_url, author } = req.body;
        const result = await db.run(
            `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, slug, excerpt || '', content, image_url || '', author || 'PRISM AGENCY']
        );

        res.json({ success: true, message: 'Article créé', id: result.id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur création article' });
    }
});

// PATCH publier un article
router.patch('/:id/publish', async (req, res) => {
    try {
        await db.run(
            `UPDATE blog_posts SET status = 'published', published_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [req.params.id]
        );
        res.json({ success: true, message: 'Article publié' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur publication' });
    }
});

// DELETE supprimer un article
router.delete('/:id', async (req, res) => {
    try {
        await db.run(`DELETE FROM blog_posts WHERE id = ?`, [req.params.id]);
        res.json({ success: true, message: 'Article supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur suppression' });
    }
});

module.exports = router;
