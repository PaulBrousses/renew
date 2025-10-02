# 🚀 Guide de déploiement sur GitHub

## 📋 Étapes pour publier sur GitHub

### 1. Préparer le repository local

```bash
# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit - Renew sobriety tracker app"
```

### 2. Créer le repository sur GitHub

1. Aller sur [GitHub.com](https://github.com)
2. Cliquer sur "New repository" (bouton vert)
3. Nommer le repository : `renew-sobriety-tracker`
4. Description : `🌱 Application web moderne pour accompagner ton parcours de sobriété`
5. Choisir **Public** pour un repository public
6. ❌ **NE PAS** cocher "Add a README file" (on a déjà le nôtre)
7. Cliquer "Create repository"

### 3. Connecter le repository local à GitHub

```bash
# Ajouter l'origine remote (remplacer YOUR_USERNAME)
git remote add origin https://github.com/PaulBrousses/renew.git

# Renommer la branche principale
git branch -M main

# Pousser le code
git push -u origin main
```

### 4. Configurer les variables d'environnement pour le déploiement

⚠️ **IMPORTANT** : Ne jamais commiter les clés API dans le code !

#### Pour Vercel :
1. Aller sur [vercel.com](https://vercel.com)
2. Connecter ton compte GitHub
3. Importer le repository `renew-sobriety-tracker`
4. Dans les settings du projet, ajouter les variables d'environnement :

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_OPENAI_API_KEY=your_openai_key
```

### 5. Déploiement automatique

Une fois connecté à Vercel :
- ✅ Chaque push sur `main` déclenche un déploiement automatique
- ✅ Les pull requests créent des previews automatiques
- ✅ Domaine personnalisé disponible

### 6. Commandes Git utiles pour la suite

```bash
# Ajouter des changements
git add .
git commit -m "✨ Add new feature"
git push

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite
git push -u origin feature/nouvelle-fonctionnalite

# Revenir sur main
git checkout main
git pull origin main
```

## 🔒 Sécurité

### Variables d'environnement
- ✅ Utiliser `env.example` comme template
- ✅ Ajouter `.env.local` au `.gitignore`
- ❌ Jamais commiter de vraies clés API

### Firebase Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 Analytics et monitoring

### GitHub Insights
- Activer les GitHub Pages si besoin
- Configurer les GitHub Actions pour CI/CD
- Utiliser les GitHub Issues pour le support

### Vercel Analytics
```bash
# Ajouter Vercel Analytics (optionnel)
npm install @vercel/analytics
```

## 🎯 Optimisations post-déploiement

### Performance
- ✅ Vite optimise automatiquement le bundle
- ✅ TailwindCSS purge les styles inutilisés
- ✅ Images optimisées par Vercel

### SEO
- Ajouter un `robots.txt`
- Configurer les meta tags
- Ajouter un sitemap

### Monitoring
- Vercel Analytics pour les performances
- Firebase Analytics pour l'usage
- Sentry pour les erreurs (optionnel)

## 🚨 Checklist avant publication

- [ ] Toutes les clés API sont en variables d'environnement
- [ ] Le README est à jour et complet
- [ ] Les tests passent (si applicable)
- [ ] L'app fonctionne en mode production (`npm run build`)
- [ ] Les règles Firebase sont configurées
- [ ] Le domaine est configuré dans Firebase Auth
- [ ] Les CORS sont configurés si nécessaire

## 🎉 Après publication

1. **Tester l'app en production** sur le domaine Vercel
2. **Configurer un domaine personnalisé** (optionnel)
3. **Partager le projet** sur les réseaux sociaux
4. **Ajouter des badges** au README (build status, etc.)
5. **Créer des releases** pour les versions importantes

---

**Félicitations ! 🎉 Ton app est maintenant publique sur GitHub !**
