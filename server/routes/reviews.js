const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database');

// GET tous les avis approuvés
router.get('/', async (req, res) => {
    try {
        const reviews = await db.all(
            `SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC`
        );
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération avis' });
    }
});

// GET avis en attente de modération
router.get('/pending', async (req, res) => {
    try {
        const reviews = await db.all(
            `SELECT * FROM reviews WHERE status = 'pending' ORDER BY created_at DESC`
        );
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération avis' });
    }
});

// POST soumettre un avis
router.post('/', [
    body('client_name').trim().notEmpty().withMessage('Le nom est requis'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Note invalide (1-5)'),
    body('review_text').trim().notEmpty().withMessage('L\'avis est requis')
        .isLength({ min: 10, max: 1000 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { client_name, client_company, rating, review_text } = req.body;

        const result = await db.run(
            `INSERT INTO reviews (client_name, client_company, rating, review_text) 
             VALUES (?, ?, ?, ?)`,
            [client_name, client_company || '', rating, review_text]
        );

        res.json({ 
            success: true, 
            message: 'Merci pour votre avis ! Il sera publié après modération.',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur soumission avis' });
    }
});

// PATCH approuver un avis
router.patch('/:id/approve', async (req, res) => {
    try {
        await db.run(
            `UPDATE reviews SET approved = 1, status = 'approved', approved_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [req.params.id]
        );
        res.json({ success: true, message: 'Avis approuvé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur approbation' });
    }
});

// PATCH rejeter un avis
router.patch('/:id/reject', async (req, res) => {
    try {
        await db.run(
            `UPDATE reviews SET status = 'rejected' WHERE id = ?`,
            [req.params.id]
        );
        res.json({ success: true, message: 'Avis rejeté' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur rejet' });
    }
});

// DELETE supprimer un avis
router.delete('/:id', async (req, res) => {
    try {
        await db.run(`DELETE FROM reviews WHERE id = ?`, [req.params.id]);
        res.json({ success: true, message: 'Avis supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur suppression' });
    }
});

module.exports = router;
