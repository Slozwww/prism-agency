/**
 * Routes API pour le formulaire de contact
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { sendContactEmail } = require('../email');

/**
 * POST /api/contact
 * Soumettre un message de contact
 */
router.post('/', [
    // Validation des champs
    body('name').trim().notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email').trim().isEmail().withMessage('Email invalide')
        .normalizeEmail(),
    body('phone').optional().trim()
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Numéro de téléphone invalide'),
    body('subject').optional().trim()
        .isLength({ max: 200 }).withMessage('Le sujet ne peut pas dépasser 200 caractères'),
    body('message').trim().notEmpty().withMessage('Le message est requis')
        .isLength({ min: 10, max: 5000 }).withMessage('Le message doit contenir entre 10 et 5000 caractères')
], async (req, res) => {
    try {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, email, phone, subject, message } = req.body;

        // Protection anti-spam simple (honeypot)
        if (req.body.website) {
            return res.status(400).json({ 
                success: false, 
                message: 'Spam détecté' 
            });
        }

        // Enregistrer dans la base de données
        const result = await db.run(
            `INSERT INTO contacts (name, email, phone, subject, message) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, phone || null, subject || null, message]
        );

        // Envoyer l'email de notification
        try {
            await sendContactEmail({ name, email, phone, subject, message });
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // On continue même si l'email échoue
        }

        res.json({ 
            success: true, 
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.',
            id: result.id
        });

    } catch (error) {
        console.error('Erreur soumission contact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
        });
    }
});

/**
 * GET /api/contact
 * Récupérer tous les messages de contact (admin)
 */
router.get('/', async (req, res) => {
    try {
        const contacts = await db.all(
            `SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100`
        );
        res.json({ success: true, contacts });
    } catch (error) {
        console.error('Erreur récupération contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des messages' 
        });
    }
});

/**
 * GET /api/contact/:id
 * Récupérer un message spécifique
 */
router.get('/:id', async (req, res) => {
    try {
        const contact = await db.get(
            `SELECT * FROM contacts WHERE id = ?`,
            [req.params.id]
        );
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: 'Message non trouvé' 
            });
        }

        // Marquer comme lu
        await db.run(
            `UPDATE contacts SET status = 'read', read_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [req.params.id]
        );

        res.json({ success: true, contact });
    } catch (error) {
        console.error('Erreur récupération contact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du message' 
        });
    }
});

module.exports = router;
