# 🔴 PRISM AGENCY — Déploiement Render

## 🚀 Déployer en 4 étapes

### Étape 1 — Mets le projet sur GitHub
1. Va sur github.com → "New repository" → nomme-le `prism-agency`
2. Upload tous les fichiers de ce dossier dans le repo

### Étape 2 — Crée un service sur Render
1. Va sur render.com et connecte-toi avec GitHub
2. Clique **"New +"** → **"Web Service"**
3. Sélectionne ton repo `prism-agency`
4. Render détecte automatiquement les paramètres grâce au fichier `render.yaml` ✅

### Étape 3 — Variables d'environnement
Dans ton service Render → **"Environment"**, ajoute :

  NODE_ENV    = production
  EMAIL_HOST  = smtp.gmail.com
  EMAIL_PORT  = 587
  EMAIL_USER  = prism.agency.web.contact@gmail.com
  EMAIL_PASS  = (mot de passe application Gmail — voir ci-dessous)
  EMAIL_FROM  = prism.agency.web.contact@gmail.com
  EMAIL_TO    = prism.agency.web.contact@gmail.com

**Pour le mot de passe Gmail :**
→ myaccount.google.com/apppasswords
→ Crée un "mot de passe d'application" et copie le code de 16 caractères

### Étape 4 — Deploy !
Clique "Create Web Service" — Render lance automatiquement `npm install` puis `node server/server.js`. ✅

---

## ⚠️ Note sur le plan gratuit Render
Sur le plan gratuit, le service se met en veille après 15 min d'inactivité.
La première visite après une pause peut prendre ~30 secondes.
Pour éviter ça, passe au plan Starter (7$/mois).

## 🌐 Ton URL
Après déploiement, ton site sera accessible sur :
https://prism-agency.onrender.com (ou similaire)
