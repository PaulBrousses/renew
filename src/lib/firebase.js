import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailLink, sendSignInLinkToEmail, isSignInWithEmailLink, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configuration de la persistance pour maintenir la connexion pendant une semaine
const initializeAuthPersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('✅ Persistance Firebase configurée : connexion maintenue pendant une semaine');
  } catch (error) {
    console.error('❌ Erreur configuration persistance:', error);
  }
};

// Initialiser la persistance
initializeAuthPersistence();

const actionCodeSettings = {
  url: window.location.origin,
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.renew.app'
  },
  android: {
    packageName: 'com.renew.app',
    installApp: true,
    minimumVersion: '12'
  }
};

export const sendMagicLink = async (email) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    window.localStorage.setItem('emailForSignIn', email);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const completeMagicLinkSignIn = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
      const urlParams = new URLSearchParams(window.location.search);
      email = urlParams.get('email');
      
      if (!email) {
        email = window.prompt('Veuillez confirmer votre adresse email pour terminer la connexion');
      }
    }

    try {
      // S'assurer que la persistance est configurée avant la connexion
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Marquer la date de connexion pour le suivi de session
      const loginTimestamp = new Date().getTime();
      window.localStorage.setItem('lastLoginTime', loginTimestamp.toString());
      
      console.log('✅ Connexion réussie - Session maintenue pour une semaine');
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'Lien invalide' };
};

export const saveUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), userData, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Vérifier si la session est encore valide (moins d'une semaine)
export const isSessionValid = () => {
  const lastLoginTime = window.localStorage.getItem('lastLoginTime');
  if (!lastLoginTime) return false;
  
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - parseInt(lastLoginTime);
  
  return timeDifference < oneWeekInMs;
};

// Obtenir le temps restant avant expiration de session
export const getSessionTimeRemaining = () => {
  const lastLoginTime = window.localStorage.getItem('lastLoginTime');
  if (!lastLoginTime) return 0;
  
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - parseInt(lastLoginTime);
  const timeRemaining = oneWeekInMs - timeDifference;
  
  return Math.max(0, timeRemaining);
};

// Nettoyer les données de session expirée
export const cleanExpiredSession = () => {
  if (!isSessionValid()) {
    window.localStorage.removeItem('lastLoginTime');
    console.log('🕒 Session expirée - nettoyage effectué');
    return true;
  }
  return false;
};
