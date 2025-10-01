import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { currentView } = useApp();

  return (
    <div className="App">
      {currentView === 'onboarding' && <Onboarding />}
      {currentView === 'dashboard' && <Dashboard />}
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
