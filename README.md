# 🔴 PRISM AGENCY — Déploiement Netlify

## 🚀 Comment déployer en 3 étapes

### Étape 1 — Upload sur Netlify
1. Va sur netlify.com et connecte-toi
2. Clique "Add new site" → "Import an existing project"
3. Connecte ton GitHub et sélectionne ce repo
   (ou glisse-dépose le dossier directement dans Netlify)

### Étape 2 — Configure les variables d'environnement
Dans Site settings → Environment variables, ajoute :

- EMAIL_HOST = smtp.gmail.com
- EMAIL_PORT = 587
- EMAIL_USER = ton-email@gmail.com
- EMAIL_PASS = mot-de-passe-application-gmail
- EMAIL_FROM = ton-email@gmail.com
- EMAIL_TO = ton-email@gmail.com

Pour le mot de passe Gmail : va sur myaccount.google.com/apppasswords,
crée un "mot de passe d'application" et copie le code généré.

### Étape 3 — Deploy !
Clique Deploy site — c'est tout !

## Structure du projet

  public/                 Pages HTML + CSS + JS
  netlify/functions/      Backend serverless
    contact.js            Traite le formulaire contact
    quote.js              Traite le formulaire devis
  netlify.toml            Config Netlify (redirections)
  package.json
