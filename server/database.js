/**
 * Module de gestion de la base de données SQLite
 * Gère la création et l'initialisation des tables
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../database');
if (!fs.existsSync(DB_DIR)) { fs.mkdirSync(DB_DIR, { recursive: true }); }

const DB_PATH = path.join(DB_DIR, 'prism-agency.db');

// Créer/ouvrir la connexion à la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('✓ Connexion à la base de données SQLite établie');
    }
});

/**
 * Initialiser les tables de la base de données
 */
const init = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Table des messages de contact
            db.run(`
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT,
                    subject TEXT,
                    message TEXT NOT NULL,
                    status TEXT DEFAULT 'new',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    read_at DATETIME
                )
            `, (err) => {
                if (err) console.error('Erreur création table contacts:', err);
                else console.log('✓ Table contacts OK');
            });

            // Table des demandes de devis
            db.run(`
                CREATE TABLE IF NOT EXISTS quotes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    company TEXT,
                    project_type TEXT NOT NULL,
                    services TEXT,
                    budget TEXT,
                    timeline TEXT,
                    description TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    processed_at DATETIME
                )
            `, (err) => {
                if (err) console.error('Erreur création table quotes:', err);
                else console.log('✓ Table quotes OK');
            });

            // Table des articles de blog
            db.run(`
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    excerpt TEXT,
                    content TEXT NOT NULL,
                    image_url TEXT,
                    author TEXT DEFAULT 'PRISM AGENCY',
                    status TEXT DEFAULT 'draft',
                    published_at DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('Erreur création table blog_posts:', err);
                else console.log('✓ Table blog_posts OK');
            });

            // Table des projets portfolio
            db.run(`
                CREATE TABLE IF NOT EXISTS portfolio_projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    description TEXT NOT NULL,
                    image_url TEXT,
                    technologies TEXT,
                    project_url TEXT,
                    github_url TEXT,
                    featured BOOLEAN DEFAULT 0,
                    order_index INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) console.error('Erreur création table portfolio_projects:', err);
                else console.log('✓ Table portfolio_projects OK');
            });

            // Table des avis clients
            db.run(`
                CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_name TEXT NOT NULL,
                    client_company TEXT,
                    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                    review_text TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    approved BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    approved_at DATETIME
                )
            `, (err) => {
                if (err) console.error('Erreur création table reviews:', err);
                else console.log('✓ Table reviews OK');
            });

            // Table des messages de chat
            db.run(`
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    sender TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Erreur création table chat_messages:', err);
                    reject(err);
                } else {
                    console.log('✓ Table chat_messages OK');
                    console.log('✓ Base de données initialisée avec succès');
                    resolve();
                }
            });
        });
    });
};

/**
 * Exécuter une requête SQL
 */
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

/**
 * Récupérer une seule ligne
 */
const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

/**
 * Récupérer plusieurs lignes
 */
const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

/**
 * Fermer la connexion à la base de données
 */
const close = () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = {
    init,
    run,
    get,
    all,
    close,
    db
};
