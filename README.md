# 🔴 PRISM AGENCY V2 - Site Complet avec Backend

## 📦 Contenu du Projet

Site web professionnel complet avec backend Node.js/Express et base de données SQLite.

### ✨ Fonctionnalités Principales

#### 1. **Backend Fonctionnel**
- ✅ Serveur Express.js sécurisé
- ✅ Base de données SQLite
- ✅ API REST complètes
- ✅ Protection anti-spam
- ✅ Rate limiting
- ✅ Validation des données

#### 2. **Formulaire de Contact**
- ✅ Validation des champs
- ✅ Envoi d'email automatique
- ✅ Stockage en base de données
- ✅ Protection honeypot anti-spam
- ✅ Statut de lecture des messages

#### 3. **Formulaire de Devis**
- ✅ Formulaire complet (nom, email, téléphone, budget, etc.)
- ✅ Envoi d'email détaillé
- ✅ Enregistrement en base de données
- ✅ Gestion des statuts (pending, processing, completed)
- ✅ Validation stricte

#### 4. **Blog / Actualités**
- ✅ Système CRUD complet
- ✅ Gestion des brouillons et publications
- ✅ Slug URLs optimisés SEO
- ✅ Images et auteurs
- ✅ API REST

#### 5. **Portfolio de Projets**
- ✅ Affichage des projets
- ✅ Système de projets en vedette
- ✅ Technologies utilisées
- ✅ Liens projet et GitHub
- ✅ CRUD complet

#### 6. **Système d'Avis Clients**
- ✅ Soumission d'avis
- ✅ Notation avec étoiles (1-5)
- ✅ Modération avant publication
- ✅ Approbation/rejet
- ✅ Affichage public des avis approuvés

#### 7. **Chat en Direct**
- ✅ Chat fonctionnel
- ✅ Historique des conversations
- ✅ Sessions multiples
- ✅ Réponse automatique
- ✅ API REST

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js 14+ installé
- npm ou yarn

### Étape 1 : Installation des Dépendances

```bash
cd prism-agency-v2
npm install
```

### Étape 2 : Configuration

1. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

2. Modifiez le fichier `.env` avec vos paramètres :

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
EMAIL_FROM=votre.email@gmail.com
EMAIL_TO=votre.email@gmail.com

# Phone Number
PHONE_NUMBER=0650036877
```

**⚠️ Important pour Gmail :**
- Activez l'authentification à 2 facteurs
- Générez un "Mot de passe d'application" : https://myaccount.google.com/apppasswords
- Utilisez ce mot de passe dans EMAIL_PASS

### Étape 3 : Lancer le Serveur

**Mode développement (avec auto-reload) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur : **http://localhost:3000**

---

## 📁 Structure du Projet

```
prism-agency-v2/
│
├── public/                    # Fichiers frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── services.html
│   ├── about.html
│   ├── quote.html
│   ├── contact.html
│   ├── style.css             # CSS corrigé responsive
│   └── script.js
│
├── server/                    # Backend Node.js
│   ├── server.js             # Serveur principal
│   ├── database.js           # Gestion SQLite
│   ├── email.js              # Module d'envoi d'emails
│   └── routes/               # Routes API
│       ├── contact.js
│       ├── quote.js
│       ├── blog.js
│       ├── portfolio.js
│       ├── reviews.js
│       └── chat.js
│
├── database/                  # Base de données SQLite
│   └── prism-agency.db       # (créé automatiquement)
│
├── package.json
├── .env                       # Configuration (à créer)
├── .env.example               # Exemple de configuration
└── README.md
```

---

## 🔌 API Endpoints

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Récupérer tous les messages
- `GET /api/contact/:id` - Récupérer un message

### Devis
- `POST /api/quote` - Soumettre une demande de devis
- `GET /api/quote` - Récupérer toutes les demandes
- `GET /api/quote/:id` - Récupérer une demande
- `PATCH /api/quote/:id/status` - Mettre à jour le statut

### Blog
- `GET /api/blog` - Récupérer tous les articles publiés
- `GET /api/blog/:slug` - Récupérer un article
- `POST /api/blog` - Créer un article
- `PATCH /api/blog/:id/publish` - Publier un article
- `DELETE /api/blog/:id` - Supprimer un article

### Portfolio
- `GET /api/portfolio` - Tous les projets
- `GET /api/portfolio/featured` - Projets en vedette
- `GET /api/portfolio/:slug` - Un projet
- `POST /api/portfolio` - Créer un projet
- `PUT /api/portfolio/:id` - Mettre à jour
- `DELETE /api/portfolio/:id` - Supprimer

### Avis Clients
- `GET /api/reviews` - Avis approuvés
- `GET /api/reviews/pending` - Avis en attente
- `POST /api/reviews` - Soumettre un avis
- `PATCH /api/reviews/:id/approve` - Approuver
- `PATCH /api/reviews/:id/reject` - Rejeter
- `DELETE /api/reviews/:id` - Supprimer

### Chat
- `GET /api/chat/history/:sessionId` - Historique
- `POST /api/chat/message` - Envoyer un message
- `GET /api/chat/sessions` - Sessions actives

---

## 🧪 Tester les Fonctionnalités

### Tester le Formulaire de Contact

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "subject": "Test",
    "message": "Message de test"
  }'
```

### Tester le Formulaire de Devis

```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Martin",
    "email": "marie@example.com",
    "phone": "0698765432",
    "company": "ABC Corp",
    "project_type": "Site Web",
    "budget": "5000-10000€",
    "description": "Je souhaite créer un site vitrine moderne pour mon entreprise"
  }'
```

---

## 📧 Configuration Email

### Option 1 : Gmail (Recommandé)

1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Allez sur https://myaccount.google.com/apppasswords
3. Générez un mot de passe d'application
4. Utilisez ce mot de passe dans `.env`

### Option 2 : Autre Provider

Modifiez `.env` avec les paramètres SMTP de votre provider :

```env
EMAIL_HOST=smtp.votreprovider.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_mot_de_passe
```

---

## 🔒 Sécurité

Le projet inclut :
- ✅ Helmet.js pour les headers de sécurité
- ✅ Rate limiting (100 req/15min global, 5 req/h formulaires)
- ✅ Validation des données avec express-validator
- ✅ Protection anti-spam (honeypot)
- ✅ CORS configuré
- ✅ Sanitization des inputs

---

## 🐛 Debugging

### Le serveur ne démarre pas
- Vérifiez que le port 3000 est libre
- Vérifiez les logs d'erreur dans la console

### Les emails ne s'envoient pas
- Vérifiez la configuration `.env`
- Testez avec : `node -e "require('./server/email').verifyEmailConfig()"`
- Vérifiez les paramètres SMTP

### Erreur de base de données
- La base de données se crée automatiquement au premier lancement
- Vérifiez que le dossier `database/` existe
- Supprimez `database/prism-agency.db` et relancez

---

## 📊 Base de Données

SQLite est utilisé pour la simplicité. Les tables suivantes sont créées automatiquement :

- `contacts` - Messages de contact
- `quotes` - Demandes de devis
- `blog_posts` - Articles de blog
- `portfolio_projects` - Projets portfolio
- `reviews` - Avis clients
- `chat_messages` - Messages de chat

Pour visualiser la base de données, utilisez [DB Browser for SQLite](https://sqlitebrowser.org/)

---

## 🚀 Déploiement en Production

### Hébergement Recommandé
- **Heroku** (gratuit avec limitations)
- **DigitalOcean** (5$/mois)
- **Railway** (gratuit pour démarrer)
- **Vercel** (avec quelques limitations pour le backend)

### Variables d'environnement à configurer
Assurez-vous de définir toutes les variables du fichier `.env` sur votre plateforme d'hébergement.

---

## 📝 Améliorations Futures

- [ ] Panel d'administration web
- [ ] Upload d'images pour blog et portfolio
- [ ] WebSocket pour chat en temps réel
- [ ] Authentification admin
- [ ] Export des données (CSV)
- [ ] Tableau de bord analytiques
- [ ] Notifications push

---

## 💡 Utilisation

1. **Lancez le serveur** : `npm start`
2. **Ouvrez** : http://localhost:3000
3. **Testez les formulaires** directement depuis le site
4. **Vérifiez votre email** pour les notifications
5. **Consultez la base de données** pour voir les entrées

---

## 🆘 Support

**Email** : prism.agency.web.contact@gmail.com

---

## 📄 Licence

© 2026 PRISM AGENCY - Tous droits réservés

---

**Fait avec ❤️ par PRISM AGENCY**
