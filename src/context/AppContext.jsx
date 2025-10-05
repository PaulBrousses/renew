import React, { useReducer, useEffect } from 'react';
import { auth, saveUserData, getUserData, updateUserData, completeMagicLinkSignIn, isSessionValid, cleanExpiredSession } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AppContext } from './AppContextDefinition';
import { getNewlyUnlockedBadges } from '../utils/badges';

const initialState = {
  user: null,
  session: null,
  isOnboarded: false,
  currentView: 'auth', // auth, onboarding, dashboard
  loading: true,
  journalEntries: [],
  celebrationBadge: null,
  showCelebration: false
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
        currentView: action.payload ? (state.isOnboarded ? 'dashboard' : 'onboarding') : 'auth',
        loading: false
      };
    
    case 'INITIALIZE_USER':
      return {
        ...state,
        user: {
          id: state.session?.user?.id,
          email: state.session?.user?.email,
          firstName: action.payload.firstName,
          addictions: action.payload.addictions,
          startDate: action.payload.startDate,
          currentStreaks: {
            alcohol: action.payload.addictions.includes('alcohol') ? 0 : null,
            cigarette: action.payload.addictions.includes('cigarette') ? 0 : null
          },
          bestStreaks: {
            alcohol: 0,
            cigarette: 0
          },
          totalDays: 0,
          checkIns: [],
          relapses: [],
          lastCheckIn: null
        },
        isOnboarded: true,
        currentView: 'dashboard'
      };
    
    case 'LOAD_USER_DATA': {
      const loadedUser = action.payload.user;
      const correctedBestStreaks = { ...loadedUser.bestStreaks };
      if (loadedUser.currentStreaks) {
        Object.keys(loadedUser.currentStreaks).forEach(addiction => {
          if (loadedUser.currentStreaks[addiction] !== null) {
            correctedBestStreaks[addiction] = Math.max(
              correctedBestStreaks[addiction] || 0,
              loadedUser.currentStreaks[addiction] || 0
            );
          }
        });
      }
      
      return {
        ...state,
        user: {
          ...loadedUser,
          bestStreaks: correctedBestStreaks
        },
        isOnboarded: action.payload.isOnboarded,
        currentView: action.payload.isOnboarded ? 'dashboard' : 'onboarding'
      };
    }
    
    case 'CHECK_IN_SUCCESS': {
      const today = new Date().toISOString().split('T')[0];
      const { addiction } = action.payload;
      
      const newCheckIn = {
        date: today,
        addiction,
        success: true,
        mood: action.payload.mood || null,
        note: action.payload.note || null
      };
      
      const newCurrentStreaks = { ...state.user.currentStreaks };
      if (newCurrentStreaks[addiction] !== null) {
        newCurrentStreaks[addiction] += 1;
      }
      
      const newBestStreaks = { ...state.user.bestStreaks };
      if (newCurrentStreaks[addiction] > newBestStreaks[addiction]) {
        newBestStreaks[addiction] = newCurrentStreaks[addiction];
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          currentStreaks: newCurrentStreaks,
          bestStreaks: newBestStreaks,
          totalDays: state.user.totalDays + 1,
          checkIns: [...state.user.checkIns, newCheckIn],
          lastCheckIn: today
        }
      };
    }
    
    case 'CHECK_IN_RELAPSE': {
      const relapseDate = new Date().toISOString().split('T')[0];
      const relapseAddiction = action.payload.addiction;
      
      const newRelapse = {
        date: relapseDate,
        addiction: relapseAddiction
      };
      
      const resetStreaks = { ...state.user.currentStreaks };
      if (resetStreaks[relapseAddiction] !== null) {
        resetStreaks[relapseAddiction] = 0;
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          currentStreaks: resetStreaks,
          relapses: [...state.user.relapses, newRelapse],
          lastCheckIn: relapseDate,
          checkIns: [...state.user.checkIns, {
            date: relapseDate,
            addiction: relapseAddiction,
            success: false,
            mood: action.payload.mood,
            note: action.payload.note
          }]
        }
      };
    }
    
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    
    case 'SAVE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries]
      };
    
    case 'LOAD_JOURNAL_ENTRIES':
      return {
        ...state,
        journalEntries: action.payload
      };
    
    case 'UPDATE_USER_ADDICTIONS': {
      const updatedAddictions = action.payload;
      const updatedCurrentStreaks = { ...state.user.currentStreaks };
      const updatedBestStreaks = { ...state.user.bestStreaks };
      
      updatedAddictions.forEach(addiction => {
        if (!state.user.addictions.includes(addiction)) {
          updatedCurrentStreaks[addiction] = 0;
          updatedBestStreaks[addiction] = 0;
        }
      });
      
      Object.keys(updatedCurrentStreaks).forEach(addiction => {
        if (!updatedAddictions.includes(addiction)) {
          updatedCurrentStreaks[addiction] = null;
        }
      });
      
      return {
        ...state,
        user: {
          ...state.user,
          addictions: updatedAddictions,
          currentStreaks: updatedCurrentStreaks,
          bestStreaks: updatedBestStreaks
        }
      };
    }
    
    case 'SHOW_CELEBRATION': {
      return {
        ...state,
        celebrationBadge: action.payload,
        showCelebration: true
      };
    }
    
    case 'HIDE_CELEBRATION':
      return {
        ...state,
        celebrationBadge: null,
        showCelebration: false
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        const result = await completeMagicLinkSignIn();
        if (result.success) {
          return;
        }
      } catch (error) {
      }
    };
    
    handleMagicLink();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Vérifier si la session est expirée
      if (user && !isSessionValid()) {
        console.log('🕒 Session expirée - déconnexion automatique');
        cleanExpiredSession();
        await signOut(auth);
        return;
      }
      
      dispatch({ type: 'SET_SESSION', payload: user });
      
      if (user) {
        console.log('✅ Utilisateur connecté - session valide pour', Math.ceil((7 * 24 * 60 * 60 * 1000 - (new Date().getTime() - parseInt(window.localStorage.getItem('lastLoginTime') || '0'))) / (24 * 60 * 60 * 1000)), 'jours');
        await loadUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);


  const loadUserData = async (userId) => {
    try {
      const result = await getUserData(userId);
      
      if (result.success && result.data) {
        dispatch({
          type: 'LOAD_USER_DATA',
          payload: {
            user: result.data,
            isOnboarded: true
          }
        });

        if (result.data.journalEntries) {
          dispatch({
            type: 'LOAD_JOURNAL_ENTRIES',
            payload: result.data.journalEntries
          });
        }
      }
    } catch (error) {
    }
  };

  const initializeUser = async (firstName, addictions, startDate) => {
    if (!state.session) return;

    const userData = {
      id: state.session.uid,
      email: state.session.email,
      firstName,
      addictions,
      startDate,
      currentStreaks: {
        alcohol: addictions.includes('alcohol') ? 0 : null,
        cigarette: addictions.includes('cigarette') ? 0 : null
      },
      bestStreaks: {
        alcohol: 0,
        cigarette: 0
      },
      totalDays: 0,
      checkIns: [],
      relapses: [],
      lastCheckIn: null,
      createdAt: new Date().toISOString()
    };

    try {
      const result = await saveUserData(state.session.uid, userData);

      if (result.success) {
        dispatch({
          type: 'INITIALIZE_USER',
          payload: { firstName, addictions, startDate }
        });
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const checkInSuccess = async (addiction, mood = null, note = null) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculer les nouveaux streaks
    const oldCurrentStreaks = { ...state.user.currentStreaks };
    const newCurrentStreaks = { ...state.user.currentStreaks };
    if (newCurrentStreaks[addiction] !== null) {
      newCurrentStreaks[addiction] += 1;
    }
    
    // Vérifier les nouveaux badges débloqués
    const newBadges = getNewlyUnlockedBadges(oldCurrentStreaks, newCurrentStreaks, [addiction]);
    
    dispatch({
      type: 'CHECK_IN_SUCCESS',
      payload: { addiction, mood, note }
    });

    // Afficher la célébration si nouveau badge
    if (newBadges.length > 0) {
      setTimeout(() => {
        dispatch({
          type: 'SHOW_CELEBRATION',
          payload: newBadges[0] // Afficher le premier badge débloqué
        });
      }, 500); // Petit délai pour que l'UI se mette à jour
    }

    if (state.session) {
      try {
        const newBestStreaks = { ...state.user.bestStreaks };
        if (newCurrentStreaks[addiction] > newBestStreaks[addiction]) {
          newBestStreaks[addiction] = newCurrentStreaks[addiction];
        }

        const newCheckIn = {
          date: today,
          addiction,
          success: true,
          mood,
          note
        };

        const updates = {
          currentStreaks: newCurrentStreaks,
          bestStreaks: newBestStreaks,
          totalDays: state.user.totalDays + 1,
          checkIns: [...state.user.checkIns, newCheckIn],
          lastCheckIn: today
        };

        const result = await updateUserData(state.session.uid, updates);
      } catch (error) {
      }
    }
  };

  const checkInRelapse = async (addiction, mood = null, note = null) => {
    const today = new Date().toISOString().split('T')[0];
    
    dispatch({
      type: 'CHECK_IN_RELAPSE',
      payload: { addiction, mood, note }
    });

    if (state.session) {
      try {
        const resetStreaks = { ...state.user.currentStreaks };
        if (resetStreaks[addiction] !== null) {
          resetStreaks[addiction] = 0;
        }

        const newRelapse = {
          date: today,
          addiction
        };

        const newCheckIn = {
          date: today,
          addiction,
          success: false,
          mood,
          note
        };

        const updates = {
          currentStreaks: resetStreaks,
          relapses: [...state.user.relapses, newRelapse],
          checkIns: [...state.user.checkIns, newCheckIn],
          lastCheckIn: today
        };

        const result = await updateUserData(state.session.uid, updates);
      } catch (error) {
      }
    }
  };

  const logout = async () => {
    // Nettoyer les données de session lors de la déconnexion manuelle
    window.localStorage.removeItem('lastLoginTime');
    await signOut(auth);
    dispatch({ type: 'LOGOUT' });
    console.log('👋 Déconnexion manuelle - session nettoyée');
  };

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const calculateDaysSinceStart = () => {
    if (!state.user?.startDate) return 0;
    const start = new Date(state.user.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTodayMessage = () => {
    if (!state.user) return '';
    
    const maxStreak = Math.max(
      state.user.currentStreaks.alcohol || 0,
      state.user.currentStreaks.cigarette || 0
    );
    
    const messages = {
      0: `Salut ${state.user.firstName} ! Chaque jour est un nouveau départ. Tu peux le faire ! 💪`,
      1: `${state.user.firstName}, premier jour accompli ! C'est le plus dur qui est fait. 🌱`,
      3: `${state.user.firstName}, 3 jours ! Tu commences à sentir la différence ? Continue ! 🔥`,
      7: `${state.user.firstName}, une semaine complète ! Tu es sur la bonne voie. 🎉`,
      14: `${state.user.firstName}, deux semaines ! Ton corps te dit déjà merci. ⭐`,
      30: `${state.user.firstName}, un mois ! C'est énorme, tu n'es plus la même personne. 🏆`,
      90: `${state.user.firstName}, 3 mois ! C'est officiel, tu as cassé l'habitude. 👑`
    };
    
    const milestones = Object.keys(messages).map(Number).sort((a, b) => b - a);
    const milestone = milestones.find(m => maxStreak >= m) || 0;
    
    return messages[milestone];
  };

  const getTodayCheckIns = () => {
    if (!state.user?.checkIns) return {};
    
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIns = state.user.checkIns.filter(checkIn => checkIn.date === today);
    
    const result = {};
    todayCheckIns.forEach(checkIn => {
      result[checkIn.addiction] = checkIn.success;
    });
    
    return result;
  };

  const hasCheckedInToday = () => {
    if (!state.user?.lastCheckIn) return false;
    const today = new Date().toISOString().split('T')[0];
    return state.user.lastCheckIn === today;
  };

  const saveJournalEntry = async (entry) => {
    try {
      dispatch({ type: 'SAVE_JOURNAL_ENTRY', payload: entry });
      
      if (state.session) {
        const newJournalEntries = [entry, ...state.journalEntries];
        const updates = {
          journalEntries: newJournalEntries
        };
        
        const result = await updateUserData(state.session.uid, updates);
      }
    } catch (error) {
    }
  };

  const getJournalEntries = () => {
    return state.journalEntries || [];
  };

  const getLatestJournalEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return state.journalEntries.find(entry => entry.date === today) || null;
  };

  const updateUserAddictions = async (newAddictions) => {
    try {
      dispatch({ type: 'UPDATE_USER_ADDICTIONS', payload: newAddictions });
      
      if (state.session) {
        const updates = {
          addictions: newAddictions,
          currentStreaks: {
            alcohol: newAddictions.includes('alcohol') ? (state.user.currentStreaks?.alcohol || 0) : null,
            cigarette: newAddictions.includes('cigarette') ? (state.user.currentStreaks?.cigarette || 0) : null
          },
          bestStreaks: {
            alcohol: newAddictions.includes('alcohol') ? (state.user.bestStreaks?.alcohol || 0) : 0,
            cigarette: newAddictions.includes('cigarette') ? (state.user.bestStreaks?.cigarette || 0) : 0
          }
        };
        
        const result = await updateUserData(state.session.uid, updates);
      }
    } catch (error) {
    }
  };

  const hideCelebration = () => {
    dispatch({ type: 'HIDE_CELEBRATION' });
  };

  const value = {
    ...state,
    initializeUser,
    checkInSuccess,
    checkInRelapse,
    logout,
    setView,
    calculateDaysSinceStart,
    getTodayMessage,
    getTodayCheckIns,
    hasCheckedInToday,
    saveJournalEntry,
    getJournalEntries,
    getLatestJournalEntry,
    updateUserAddictions,
    hideCelebration
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
