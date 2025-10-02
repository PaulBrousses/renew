# 🚀 Guide de Déploiement - Renew

## 📋 Prérequis

### Comptes nécessaires
- [Vercel](https://vercel.com) (recommandé pour le déploiement)
- [Firebase](https://console.firebase.google.com) (pour l'authentification et la base de données)
- [OpenAI](https://platform.openai.com) (pour les messages personnalisés)

### Variables d'environnement requises
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## 🔥 Configuration Firebase

### 1. Créer un projet Firebase
1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Cliquer sur "Ajouter un projet"
3. Nommer votre projet (ex: `renew-prod`)
4. Activer Google Analytics (optionnel)

### 2. Configurer l'authentification
1. Dans la console Firebase, aller dans **Authentication**
2. Cliquer sur **Commencer**
3. Dans l'onglet **Sign-in method**, activer :
   - **E-mail/Mot de passe** (sans mot de passe - liens magiques uniquement)
4. Dans **Settings** > **Authorized domains**, ajouter votre domaine de production

### 3. Configurer Firestore
1. Aller dans **Firestore Database**
2. Cliquer sur **Créer une base de données**
3. Choisir **Mode production** 
4. Sélectionner une région proche (ex: `europe-west1`)

### 4. Configurer les règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs ne peuvent accéder qu'à leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Récupérer les clés de configuration
1. Dans **Paramètres du projet** > **Général**
2. Faire défiler jusqu'à **Vos applications**
3. Cliquer sur **Ajouter une app** > **Web**
4. Nommer votre app (ex: `renew-web`)
5. Copier les valeurs de configuration

---

## 🤖 Configuration OpenAI

### 1. Créer un compte OpenAI
1. Aller sur [OpenAI Platform](https://platform.openai.com)
2. Créer un compte ou se connecter
3. Ajouter une méthode de paiement (nécessaire pour l'API)

### 2. Générer une clé API
1. Aller dans **API Keys**
2. Cliquer sur **Create new secret key**
3. Nommer la clé (ex: `renew-prod`)
4. Copier la clé (elle ne sera plus visible après)

### 3. Configurer les limites (optionnel)
1. Aller dans **Usage limits**
2. Définir une limite mensuelle (ex: 20$)
3. Configurer des alertes par email

---

## 🌐 Déploiement sur Vercel

### Option 1 : Déploiement via GitHub (Recommandé)

#### 1. Préparer le repository
```bash
# Ajouter tous les fichiers
git add .

# Commit final
git commit -m "🚀 Ready for production deployment"

# Push vers GitHub
git push origin main
```

#### 2. Connecter à Vercel
1. Aller sur [Vercel](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur **New Project**
4. Importer votre repository `sobertracker`

#### 3. Configurer le projet
- **Framework Preset** : Vite
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

#### 4. Ajouter les variables d'environnement
Dans les paramètres du projet Vercel :
1. Aller dans **Settings** > **Environment Variables**
2. Ajouter chaque variable une par une :
```
VITE_FIREBASE_API_KEY = votre_clé_firebase
VITE_FIREBASE_AUTH_DOMAIN = votre_domaine.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = votre_project_id
VITE_FIREBASE_STORAGE_BUCKET = votre_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = votre_sender_id
VITE_FIREBASE_APP_ID = votre_app_id
VITE_OPENAI_API_KEY = votre_clé_openai
```

#### 5. Déployer
1. Cliquer sur **Deploy**
2. Attendre la fin du build (2-3 minutes)
3. Votre app sera disponible sur `https://votre-projet.vercel.app`

### Option 2 : Déploiement direct via CLI

#### 1. Installer Vercel CLI
```bash
npm i -g vercel
```

#### 2. Se connecter
```bash
vercel login
```

#### 3. Configurer le projet
```bash
# Dans le dossier du projet
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? renew (ou autre)
# - Directory? ./
# - Override settings? No
```

#### 4. Ajouter les variables d'environnement
```bash
# Pour chaque variable
vercel env add VITE_FIREBASE_API_KEY
# Coller la valeur quand demandé
# Choisir Production, Preview, Development selon vos besoins
```

#### 5. Déployer en production
```bash
vercel --prod
```

---

## 🔧 Configuration post-déploiement

### 1. Mettre à jour Firebase
1. Dans Firebase Console > **Authentication** > **Settings**
2. Ajouter votre domaine Vercel dans **Authorized domains**
3. Exemple : `votre-projet.vercel.app`

### 2. Configurer le domaine personnalisé (optionnel)
1. Dans Vercel > **Settings** > **Domains**
2. Ajouter votre domaine (ex: `renew.votresite.com`)
3. Configurer les DNS selon les instructions Vercel
4. Mettre à jour Firebase avec le nouveau domaine

### 3. Tester l'application
- ✅ Authentification par email fonctionne
- ✅ Onboarding complet
- ✅ Dashboard s'affiche correctement
- ✅ Check-ins fonctionnent
- ✅ Journal fonctionne
- ✅ Messages IA se génèrent

---

## 📊 Monitoring et Analytics

### 1. Vercel Analytics
1. Dans Vercel > **Analytics**
2. Activer les analytics (gratuit jusqu'à 100k vues/mois)

### 2. Firebase Analytics (optionnel)
1. Dans Firebase Console > **Analytics**
2. Suivre les instructions d'intégration

### 3. Monitoring des erreurs
Vercel fournit automatiquement :
- Logs de build
- Logs de runtime
- Métriques de performance

---

## 🔄 Mises à jour

### Déploiement automatique (GitHub + Vercel)
Chaque push sur `main` déclenche automatiquement :
1. Build de l'application
2. Tests de déploiement
3. Mise en production si succès

### Déploiement manuel
```bash
# Faire vos modifications
git add .
git commit -m "✨ Nouvelle fonctionnalité"
git push origin main

# Ou avec Vercel CLI
vercel --prod
```

---

## 🚨 Dépannage

### Erreurs communes

#### Build failed
```bash
# Vérifier les dépendances
npm install

# Tester le build localement
npm run build

# Vérifier les variables d'environnement
```

#### Firebase connection failed
- Vérifier que toutes les variables `VITE_FIREBASE_*` sont correctes
- Vérifier que le domaine est autorisé dans Firebase
- Vérifier que Firestore est activé

#### OpenAI API errors
- Vérifier que la clé API est valide
- Vérifier le crédit disponible sur votre compte OpenAI
- Vérifier les limites de rate limiting

#### Authentication issues
- Vérifier que l'email est dans les domaines autorisés Firebase
- Vérifier que les liens magiques sont activés
- Vérifier les règles Firestore

### Logs utiles
```bash
# Logs Vercel
vercel logs

# Logs Firebase (dans la console)
# Console > Functions > Logs

# Logs navigateur
# F12 > Console
```

---

## 📞 Support

### Ressources
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)

### Contacts
- **Développeur** : Paul Brousses
- **Email** : paul.brousses@gmail.com

---

## ✅ Checklist de déploiement

### Avant déploiement
- [ ] Toutes les variables d'environnement sont configurées
- [ ] Le build local fonctionne (`npm run build`)
- [ ] Les tests passent (`npm run lint`)
- [ ] Firebase est configuré
- [ ] OpenAI est configuré

### Après déploiement
- [ ] L'application se charge correctement
- [ ] L'authentification fonctionne
- [ ] Les données se sauvegardent
- [ ] Les messages IA se génèrent
- [ ] Le domaine est configuré dans Firebase
- [ ] Les analytics sont activés (optionnel)

### Optimisations production
- [ ] Favicon mise à jour ✅
- [ ] Méta-tags SEO configurés ✅
- [ ] Performance optimisée ✅
- [ ] Sécurité vérifiée ✅

---

🎉 **Félicitations ! Votre application Renew est maintenant en production !**
