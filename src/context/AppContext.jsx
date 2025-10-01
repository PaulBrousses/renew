import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { getMessageForDay } from '../utils/messages';

const AppContext = createContext();

const initialState = {
  user: null,
  isOnboarded: false,
  currentView: 'onboarding'
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_USER':
      return {
        ...state,
        user: {
          addictions: action.payload.addictions,
          startDate: action.payload.startDate,
          currentStreak: 0,
          bestStreak: 0,
          totalDays: 0,
          checkIns: [],
          relapses: [],
          lastCheckIn: null
        },
        isOnboarded: true,
        currentView: 'dashboard'
      };
    
    case 'LOAD_USER_DATA':
      return {
        ...state,
        user: action.payload.user,
        isOnboarded: action.payload.isOnboarded,
        currentView: action.payload.isOnboarded ? 'dashboard' : 'onboarding'
      };
    
    case 'CHECK_IN_SUCCESS':
      const today = new Date().toISOString().split('T')[0];
      const newCheckIn = {
        date: today,
        success: true,
        mood: action.payload.mood || null,
        note: action.payload.note || null
      };
      
      const newStreak = state.user.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, state.user.bestStreak);
      
      return {
        ...state,
        user: {
          ...state.user,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalDays: state.user.totalDays + 1,
          checkIns: [...state.user.checkIns, newCheckIn],
          lastCheckIn: today
        }
      };
    
    case 'CHECK_IN_RELAPSE':
      const relapseDate = new Date().toISOString().split('T')[0];
      const newRelapse = {
        date: relapseDate,
        addiction: action.payload.addiction
      };
      
      return {
        ...state,
        user: {
          ...state.user,
          currentStreak: 0,
          relapses: [...state.user.relapses, newRelapse],
          lastCheckIn: relapseDate,
          checkIns: [...state.user.checkIns, {
            date: relapseDate,
            success: false,
            addiction: action.payload.addiction
          }]
        }
      };
    
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = loadFromLocalStorage('sobertracker-data');
    if (savedData) {
      dispatch({ type: 'LOAD_USER_DATA', payload: savedData });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      saveToLocalStorage('sobertracker-data', {
        user: state.user,
        isOnboarded: state.isOnboarded
      });
    }
  }, [state.user, state.isOnboarded]);

  const initializeUser = (addictions, startDate) => {
    dispatch({
      type: 'INITIALIZE_USER',
      payload: { addictions, startDate }
    });
  };

  const checkInSuccess = (mood = null, note = null) => {
    dispatch({
      type: 'CHECK_IN_SUCCESS',
      payload: { mood, note }
    });
  };

  const checkInRelapse = (addiction) => {
    dispatch({
      type: 'CHECK_IN_RELAPSE',
      payload: { addiction }
    });
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
    const daysSinceStart = calculateDaysSinceStart();
    const status = state.user.currentStreak > 0 ? 'onStreak' : 'relapse';
    return getMessageForDay(state.user.currentStreak || daysSinceStart, status, state.user.addictions);
  };

  const hasCheckedInToday = () => {
    if (!state.user?.lastCheckIn) return false;
    const today = new Date().toISOString().split('T')[0];
    return state.user.lastCheckIn === today;
  };

  const value = {
    ...state,
    initializeUser,
    checkInSuccess,
    checkInRelapse,
    setView,
    calculateDaysSinceStart,
    getTodayMessage,
    hasCheckedInToday
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
