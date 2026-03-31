# 🔴 PRISM AGENCY — Déploiement Railway

## 🚀 Déployer en 3 étapes

### Étape 1 — Crée un projet Railway
1. Va sur railway.app et connecte-toi avec GitHub
2. Clique "New Project" → "Deploy from GitHub repo"
3. Sélectionne ce repo (ou upload le dossier via "Empty Project" → drag & drop)

### Étape 2 — Variables d'environnement
Dans ton projet Railway → "Variables", ajoute :

  NODE_ENV        = production
  EMAIL_HOST      = smtp.gmail.com
  EMAIL_PORT      = 587
  EMAIL_USER      = ton-email@gmail.com
  EMAIL_PASS      = mot-de-passe-application-gmail
  EMAIL_FROM      = ton-email@gmail.com
  EMAIL_TO        = ton-email@gmail.com

Pour le mot de passe Gmail : myaccount.google.com/apppasswords
→ crée un "mot de passe d'application" et copie le code.

### Étape 3 — Deploy !
Railway lance automatiquement "npm install" puis "node server/server.js". ✅

## Avantages Railway vs Render (gratuit)
- Pas de mise en veille (le site reste toujours actif)
- 5$/mois de crédits offerts chaque mois (largement suffisant)
- Déploiement automatique à chaque push GitHub
