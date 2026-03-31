/**
 * PRISM AGENCY - Serveur Backend Principal
 * Gère toutes les fonctionnalités backend du site
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

// Initialiser l'app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet({
    contentSecurityPolicy: false // Désactivé pour permettre les scripts inline
}));

// CORS - Autoriser les requêtes cross-origin
app.use(cors());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting global (100 requêtes par 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use(limiter);

// Rate limiting strict pour les formulaires (5 soumissions par heure)
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Trop de soumissions, veuillez réessayer dans une heure.'
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Import des routes
const contactRoutes = require('./routes/contact');
const quoteRoutes = require('./routes/quote');
const blogRoutes = require('./routes/blog');
const portfolioRoutes = require('./routes/portfolio');
const reviewsRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');

// Utiliser les routes
app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/quote', formLimiter, quoteRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/chat', chatRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'Route API non trouvée' });
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        error: 'Erreur serveur interne',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialiser la base de données au démarrage
db.init()
    .then(() => {
        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║   🔴 PRISM AGENCY - Serveur Actif     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  Environnement: ${process.env.NODE_ENV || 'development'}        ║
║  URL: http://localhost:${PORT}            ║
╚════════════════════════════════════════╝
            `);
        });
    })
    .catch(err => {
        console.error('Erreur d\'initialisation de la base de données:', err);
        process.exit(1);
    });

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu, arrêt propre du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT reçu, arrêt propre du serveur...');
    process.exit(0);
});

module.exports = app;
