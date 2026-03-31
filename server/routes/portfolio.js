const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database');

// GET tous les projets
router.get('/', async (req, res) => {
    try {
        const projects = await db.all(
            `SELECT * FROM portfolio_projects ORDER BY order_index DESC, created_at DESC`
        );
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération projets' });
    }
});

// GET projets en vedette
router.get('/featured', async (req, res) => {
    try {
        const projects = await db.all(
            `SELECT * FROM portfolio_projects WHERE featured = 1 ORDER BY order_index DESC LIMIT 6`
        );
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération projets' });
    }
});

// GET un projet par slug
router.get('/:slug', async (req, res) => {
    try {
        const project = await db.get(
            `SELECT * FROM portfolio_projects WHERE slug = ?`,
            [req.params.slug]
        );
        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        }
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération projet' });
    }
});

// POST créer un projet
router.post('/', [
    body('title').trim().notEmpty(),
    body('slug').trim().notEmpty(),
    body('description').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, slug, description, image_url, technologies, project_url, github_url, featured } = req.body;
        const result = await db.run(
            `INSERT INTO portfolio_projects (title, slug, description, image_url, technologies, project_url, github_url, featured) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, description, image_url || '', technologies || '', project_url || '', github_url || '', featured ? 1 : 0]
        );

        res.json({ success: true, message: 'Projet créé', id: result.id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur création projet' });
    }
});

// PUT mettre à jour un projet
router.put('/:id', async (req, res) => {
    try {
        const { title, description, image_url, technologies, project_url, github_url, featured } = req.body;
        await db.run(
            `UPDATE portfolio_projects SET title = ?, description = ?, image_url = ?, technologies = ?, 
             project_url = ?, github_url = ?, featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [title, description, image_url, technologies, project_url, github_url, featured ? 1 : 0, req.params.id]
        );
        res.json({ success: true, message: 'Projet mis à jour' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur mise à jour projet' });
    }
});

// DELETE supprimer un projet
router.delete('/:id', async (req, res) => {
    try {
        await db.run(`DELETE FROM portfolio_projects WHERE id = ?`, [req.params.id]);
        res.json({ success: true, message: 'Projet supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur suppression' });
    }
});

module.exports = router;
