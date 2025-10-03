import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import DashboardCompact from './components/DashboardCompact';
import BadgeCelebration from './components/BadgeCelebration';
import { SettingsFullScreen } from './components/Settings';

const AppContent = () => {
  const { currentView, loading, showCelebration, celebrationBadge, hideCelebration } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'auth' && <Auth />}
      {currentView === 'onboarding' && <Onboarding />}
      {currentView === 'dashboard' && <DashboardCompact />}
      {currentView === 'settings' && <SettingsFullScreen />}
      
      {/* Célébration des badges */}
      <BadgeCelebration 
        badge={celebrationBadge}
        isOpen={showCelebration}
        onClose={hideCelebration}
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
