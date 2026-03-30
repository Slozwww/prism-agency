# 📦 Guide d'Installation - PRISM AGENCY

Guide complet pour installer et déployer votre site web PRISM AGENCY.

## 🚀 Installation Rapide (3 minutes)

### Étape 1 : Télécharger
Téléchargez le fichier `prism-agency-website.zip`

### Étape 2 : Décompresser
Décompressez le fichier ZIP dans un dossier de votre choix

### Étape 3 : Tester
Ouvrez `index.html` dans votre navigateur - ça fonctionne ! ✅

---

## 📁 Structure des Fichiers

```
prism-agency-website/
│
├── 📄 index.html              # Page d'accueil
├── 📄 services.html           # Page services
├── 📄 about.html              # Page à propos
├── 📄 quote.html              # Page devis
├── 📄 contact.html            # Page contact
│
├── 🎨 style.css               # Styles CSS
├── ⚙️ script.js               # JavaScript
│
├── 📖 README.md               # Documentation
├── 📝 CHANGELOG.md            # Historique des versions
├── 🚫 .gitignore             # Fichiers à ignorer (Git)
│
├── 📂 assets/
│   └── logo/
│       ├── prism-agency-logo.svg    # Logo vectoriel
│       ├── logo-instagram.html       # Logo Instagram
│       └── logo-preview.html         # Aperçu logo
│
└── 📂 marketing/
    ├── pub-tiktok-video.html  # Pub TikTok format vidéo
    └── pub-tiktok.html        # Pub TikTok alternative
```

---

## 🌐 Déploiement en Ligne

### Option 1 : NETLIFY (⭐ Recommandé - 2 minutes)

**Étapes :**
1. Allez sur [netlify.com](https://netlify.com)
2. Créez un compte gratuit
3. Cliquez sur **"Add new site"** → **"Deploy manually"**
4. Glissez-déposez le dossier `prism-agency-website`
5. Votre site est en ligne ! 🎉

**URL :** `votre-nom.netlify.app`

**Personnaliser l'URL :**
- Site settings → Change site name → `prism-agency`
- Nouvelle URL : `prism-agency.netlify.app`

---

### Option 2 : VERCEL (Rapide et moderne)

**Étapes :**
1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte (GitHub, GitLab ou email)
3. Cliquez **"Add New"** → **"Project"**
4. Uploadez votre dossier
5. Cliquez **"Deploy"**

**URL :** `prism-agency.vercel.app`

---

### Option 3 : GITHUB PAGES (Gratuit + professionnel)

**Prérequis :** Compte GitHub

**Étapes :**
1. Créez un repository sur GitHub
2. Uploadez tous les fichiers du dossier
3. Allez dans **Settings** → **Pages**
4. Source : **Deploy from a branch** → **main**
5. Cliquez **Save**

**URL :** `votre-nom.github.io/prism-agency`

---

### Option 4 : 000WEBHOST (Hébergement classique)

**Étapes :**
1. Allez sur [000webhost.com](https://000webhost.com)
2. Créez un compte gratuit
3. Créez un nouveau site web
4. Uploadez vos fichiers via File Manager
5. Site accessible en quelques minutes

---

## 🔧 Personnalisation

### Modifier l'Email de Contact

Ouvrez `contact.html` et remplacez :
```html
prism.agency.web.contact@gmail.com
```
Par votre email.

### Modifier les Couleurs

Ouvrez `style.css` et modifiez les variables CSS :
```css
:root {
    --neon-red: #FF0000;      /* Couleur principale */
    --bg-black: #000000;      /* Fond */
    --text-white: #FFFFFF;    /* Texte */
}
```

### Modifier les Statistiques

Ouvrez `index.html` et `about.html`, cherchez :
```html
<div class="stat-item">
    <h3>200+</h3>
    <p>Projets Réalisés</p>
</div>
```

### Ajouter Google Analytics

Ajoutez avant `</head>` dans chaque page HTML :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 📧 Configurer le Formulaire de Contact

Le formulaire actuel enregistre les données dans la console. Pour l'activer :

### Option 1 : Formspree (Gratuit)
1. Allez sur [formspree.io](https://formspree.io)
2. Créez un compte
3. Créez un nouveau formulaire
4. Dans `quote.html`, modifiez la balise `<form>` :
```html
<form action="https://formspree.io/f/VOTRE_ID" method="POST">
```

### Option 2 : EmailJS (Gratuit)
1. Allez sur [emailjs.com](https://emailjs.com)
2. Configurez votre service
3. Ajoutez le code dans `quote.html`

### Option 3 : Backend personnalisé
Créez votre propre API avec Node.js, PHP, Python, etc.

---

## 🎨 Utiliser les Assets Marketing

### Logo Instagram
1. Ouvrez `assets/logo/logo-instagram.html`
2. Faites une capture d'écran (1080x1080)
3. Utilisez-le sur Instagram

### Pub TikTok
1. Ouvrez `marketing/pub-tiktok-video.html`
2. Enregistrez l'écran avec OBS, Loom, etc.
3. Exportez en MP4
4. Publiez sur TikTok, Reels, Shorts

---

## 🔒 SEO & Performance

### Ajouter Meta Tags

Dans `<head>` de chaque page :
```html
<meta name="description" content="PRISM AGENCY - Sites web professionnels en 7 jours">
<meta name="keywords" content="agence web, développement, design, site internet">
<meta name="author" content="PRISM AGENCY">

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="PRISM AGENCY">
<meta property="og:description" content="Votre site web en 7 jours">
<meta property="og:image" content="URL_DE_VOTRE_IMAGE">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PRISM AGENCY">
```

### Optimiser les Images
- Utilisez des formats WebP
- Compressez avec TinyPNG
- Ajoutez des attributs `alt`

---

## 🆘 Problèmes Courants

### Le CSS ne charge pas
✅ Vérifiez que `style.css` est dans le même dossier que les HTML

### Le JavaScript ne fonctionne pas
✅ Vérifiez que `script.js` est dans le même dossier

### Le formulaire ne s'envoie pas
✅ Configurez Formspree ou EmailJS (voir section ci-dessus)

### Le site ne s'affiche pas correctement sur mobile
✅ Testez avec les DevTools de Chrome (F12 → Toggle Device)

---

## 📞 Support

**Email :** prism.agency.web.contact@gmail.com

**Documentation :** Voir README.md

---

## ✅ Checklist de Déploiement

- [ ] Fichiers téléchargés et décompressés
- [ ] Site testé localement (ouvrir index.html)
- [ ] Email personnalisé
- [ ] Formulaire configuré (Formspree/EmailJS)
- [ ] Site déployé (Netlify/Vercel/GitHub Pages)
- [ ] Nom de domaine personnalisé (optionnel)
- [ ] Google Analytics ajouté (optionnel)
- [ ] Meta tags SEO ajoutés
- [ ] Site testé sur mobile
- [ ] Tout fonctionne ! 🎉

---

**Besoin d'aide ?** Contactez-nous !

**Fait avec ❤️ par PRISM AGENCY**
