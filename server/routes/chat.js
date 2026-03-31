const express = require('express');
const router = express.Router();
const db = require('../database');

// GET historique du chat pour une session
router.get('/history/:sessionId', async (req, res) => {
    try {
        const messages = await db.all(
            `SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC LIMIT 100`,
            [req.params.sessionId]
        );
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération historique' });
    }
});

// POST envoyer un message
router.post('/message', async (req, res) => {
    try {
        const { session_id, sender, message } = req.body;

        if (!session_id || !sender || !message) {
            return res.status(400).json({ success: false, message: 'Données manquantes' });
        }

        const result = await db.run(
            `INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)`,
            [session_id, sender, message]
        );

        // Réponse automatique si c'est un client
        if (sender === 'client') {
            setTimeout(async () => {
                await db.run(
                    `INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)`,
                    [session_id, 'agent', 'Merci pour votre message ! Un conseiller vous répondra dans quelques instants.']
                );
            }, 1000);
        }

        res.json({ 
            success: true, 
            message: 'Message envoyé',
            id: result.id 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur envoi message' });
    }
});

// GET sessions de chat actives
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await db.all(
            `SELECT DISTINCT session_id, MAX(created_at) as last_message 
             FROM chat_messages 
             GROUP BY session_id 
             ORDER BY last_message DESC 
             LIMIT 50`
        );
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur récupération sessions' });
    }
});

module.exports = router;
