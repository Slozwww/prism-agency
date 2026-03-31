/**
 * Routes API pour les demandes de devis
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { sendQuoteEmail } = require('../email');

/**
 * POST /api/quote
 * Soumettre une demande de devis
 */
router.post('/', [
    // Validation des champs
    body('name').trim().notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email').trim().isEmail().withMessage('Email invalide')
        .normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Le téléphone est requis')
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Numéro de téléphone invalide'),
    body('company').optional().trim()
        .isLength({ max: 200 }).withMessage('Le nom d\'entreprise est trop long'),
    body('project_type').trim().notEmpty().withMessage('Le type de projet est requis'),
    body('services').optional(),
    body('budget').optional().trim(),
    body('timeline').optional().trim(),
    body('description').trim().notEmpty().withMessage('La description du projet est requise')
        .isLength({ min: 20, max: 5000 }).withMessage('La description doit contenir entre 20 et 5000 caractères')
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

        const { 
            name, 
            email, 
            phone, 
            company, 
            project_type, 
            services, 
            budget, 
            timeline, 
            description 
        } = req.body;

        // Protection anti-spam
        if (req.body.website) {
            return res.status(400).json({ 
                success: false, 
                message: 'Spam détecté' 
            });
        }

        // Formater les services (si c'est un tableau)
        const servicesString = Array.isArray(services) 
            ? services.join(', ') 
            : services || '';

        // Enregistrer dans la base de données
        const result = await db.run(
            `INSERT INTO quotes (name, email, phone, company, project_type, services, budget, timeline, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, 
                email, 
                phone, 
                company || null, 
                project_type, 
                servicesString, 
                budget || null, 
                timeline || null, 
                description
            ]
        );

        // Envoyer l'email de notification
        try {
            await sendQuoteEmail({ 
                name, 
                email, 
                phone, 
                company, 
                project_type, 
                services: servicesString, 
                budget, 
                timeline, 
                description 
            });
        } catch (emailError) {
            console.error('Erreur envoi email devis:', emailError);
        }

        res.json({ 
            success: true, 
            message: 'Votre demande de devis a été envoyée avec succès. Nous vous répondrons dans les 24 heures.',
            id: result.id
        });

    } catch (error) {
        console.error('Erreur soumission devis:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
        });
    }
});

/**
 * GET /api/quote
 * Récupérer toutes les demandes de devis (admin)
 */
router.get('/', async (req, res) => {
    try {
        const status = req.query.status || null;
        let query = `SELECT * FROM quotes`;
        const params = [];

        if (status) {
            query += ` WHERE status = ?`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC LIMIT 100`;

        const quotes = await db.all(query, params);
        res.json({ success: true, quotes });
    } catch (error) {
        console.error('Erreur récupération devis:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des devis' 
        });
    }
});

/**
 * GET /api/quote/:id
 * Récupérer une demande de devis spécifique
 */
router.get('/:id', async (req, res) => {
    try {
        const quote = await db.get(
            `SELECT * FROM quotes WHERE id = ?`,
            [req.params.id]
        );
        
        if (!quote) {
            return res.status(404).json({ 
                success: false, 
                message: 'Devis non trouvé' 
            });
        }

        res.json({ success: true, quote });
    } catch (error) {
        console.error('Erreur récupération devis:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du devis' 
        });
    }
});

/**
 * PATCH /api/quote/:id/status
 * Mettre à jour le statut d'un devis
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'completed', 'rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Statut invalide' 
            });
        }

        await db.run(
            `UPDATE quotes SET status = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, req.params.id]
        );

        res.json({ 
            success: true, 
            message: 'Statut mis à jour avec succès' 
        });
    } catch (error) {
        console.error('Erreur mise à jour statut:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la mise à jour du statut' 
        });
    }
});

module.exports = router;
