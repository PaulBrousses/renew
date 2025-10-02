# 🌱 Renew - Ton allié sobriété

> Application web moderne et bienveillante pour accompagner ton parcours de sobriété

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange.svg)](https://firebase.google.com/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://renew-sobriety.vercel.app)

## 🎯 À propos

**Renew** est une application web qui t'accompagne dans ton parcours de sobriété avec bienveillance et sans jugement. Que tu arrêtes l'alcool, la cigarette, ou les deux, Renew te propose un suivi quotidien personnalisé avec des encouragements générés par IA.

### ✨ Fonctionnalités principales

- 🚀 **Onboarding guidé** - Configuration simple en 4 étapes
- 📊 **Dashboard compact** - Vue d'ensemble optimisée de ta progression
- ✅ **Check-in quotidien** - Validation de tes journées sobres ou gestion des rechutes avec journal intégré
- 🧠 **Messages IA personnalisés** - Encouragements scientifiques adaptés à ta situation avec données chiffrées
- 🏆 **Système de badges** - Récompenses pour célébrer tes milestones par addiction
- 📖 **Journal personnel** - Suivi de ton humeur et tes ressentis avec contexte addiction
- 💰 **Calcul d'économies** - Visualise l'argent économisé en temps réel
- ❤️ **Bénéfices santé** - Découvre les améliorations de ta santé jour après jour par addiction
- 🔐 **Authentification Magic Link** - Connexion sécurisée sans mot de passe

### 🎨 Design & UX

- Interface moderne et apaisante avec sidebar de navigation
- Responsive design optimisé (mobile et desktop)
- Animations fluides avec Canvas Confetti pour les célébrations
- Layout intelligent qui s'adapte au nombre d'addictions
- Dashboard sans scroll avec utilisation optimale de l'espace
- Modales cohérentes pour toutes les interactions
- Accessibilité optimisée

## 🚀 Technologies

### Frontend
- **React 18** - Framework moderne avec hooks
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes et cohérentes

### Backend & Services
- **Firebase Auth** - Authentification Magic Link sécurisée par email
- **Firestore** - Base de données NoSQL en temps réel pour les données utilisateur
- **OpenAI API** - Génération de messages personnalisés avec faits scientifiques et conseils

### Outils & Déploiement
- **Vercel** - Déploiement et hébergement
- **ESLint** - Linting et qualité du code
- **PostCSS** - Traitement CSS avancé

## 📱 Installation & Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Firebase
- Clé API OpenAI (optionnel)

### Installation locale

```bash
# Cloner le projet
git clone https://github.com/PaulBrousses/renew.git
cd renew

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp env.example .env.local

# Lancer le serveur de développement
npm run dev
```

### Configuration Firebase

1. Créer un projet Firebase
2. Activer Authentication (Email/Password)
3. Créer une base Firestore
4. Copier la configuration dans `.env.local`

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optionnel - pour les messages IA
VITE_OPENAI_API_KEY=your_openai_key
```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
```

## 🏗️ Architecture

```
src/
├── components/          # Composants React réutilisables
│   ├── Auth.jsx        # Authentification Magic Link
│   ├── DashboardCompact.jsx # Dashboard principal optimisé
│   ├── CheckIn.jsx     # Check-in quotidien en modale
│   ├── Journal.jsx     # Journal personnel moderne
│   ├── BadgesModern.jsx # Système de récompenses
│   └── Onboarding.jsx  # Configuration initiale
├── context/            # Context API pour l'état global
├── hooks/              # Hooks personnalisés (useApp)
├── lib/                # Services externes (Firebase, OpenAI)
├── utils/              # Fonctions utilitaires (badges, messages)
└── styles/             # Styles globaux
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Build manuel

```bash
npm run build
# Servir le dossier dist/
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines

- Code en français (commentaires, variables)
- Suivre les conventions ESLint
- Tester sur mobile et desktop
- Documenter les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **OpenAI** pour l'API de génération de messages
- **Firebase** pour l'infrastructure backend
- **Vercel** pour l'hébergement
- **Cursor AI** pour l'assistance au développement

## 📞 Support

Si tu as des questions ou besoin d'aide :

- 🐛 Issues : [GitHub Issues](https://github.com/PaulBrousses/renew/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/PaulBrousses/renew/discussions)
- 📧 Email : paul.brousses@gmail.com

---

**Développé avec ❤️ pour accompagner chaque parcours de sobriété**

> "Chaque jour compte, chaque pas compte. Tu n'es pas seul dans cette aventure." 🌱
