import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Cigarette, Wine, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddictions, setSelectedAddictions] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const { initializeUser } = useApp();

  const steps = [
    {
      title: "Bienvenue sur SoberTracker",
      subtitle: "Ton allié pour une vie sobre",
      component: WelcomeStep
    },
    {
      title: "Qu'est-ce que tu arrêtes ?",
      subtitle: "Sélectionne une ou plusieurs addictions",
      component: AddictionStep
    },
    {
      title: "Quand as-tu commencé ?",
      subtitle: "Tu peux choisir une date passée si tu as déjà commencé",
      component: DateStep
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    initializeUser(selectedAddictions, startDate);
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedAddictions.length > 0;
    return true;
  };

  function WelcomeStep() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text">SoberTracker</h1>
          <p className="text-xl text-gray-600">Ton allié pour une vie sobre</p>
          <p className="text-gray-500 max-w-md mx-auto">
            Suivi quotidien, encouragements personnalisés et visualisation de tes progrès.
            Tu n'es pas seul dans cette aventure.
          </p>
        </div>
      </motion.div>
    );
  }

  function AddictionStep() {
    const addictions = [
      { id: 'alcohol', name: 'Alcool', icon: Wine, color: 'from-red-400 to-red-600' },
      { id: 'cigarette', name: 'Cigarette', icon: Cigarette, color: 'from-gray-400 to-gray-600' }
    ];

    const toggleAddiction = (addictionId) => {
      setSelectedAddictions(prev => 
        prev.includes(addictionId)
          ? prev.filter(id => id !== addictionId)
          : [...prev, addictionId]
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="grid gap-4">
          {addictions.map((addiction) => {
            const Icon = addiction.icon;
            const isSelected = selectedAddictions.includes(addiction.id);
            
            return (
              <motion.button
                key={addiction.id}
                onClick={() => toggleAddiction(addiction.id)}
                className={`card p-6 border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${addiction.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{addiction.name}</h3>
                    <p className="text-sm text-gray-500">
                      {addiction.id === 'alcohol' ? 'Bière, vin, spiritueux...' : 'Cigarettes, tabac...'}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
          
          <motion.button
            onClick={() => setSelectedAddictions(['alcohol', 'cigarette'])}
            className={`card p-6 border-2 transition-all duration-200 ${
              selectedAddictions.length === 2
                ? 'border-secondary bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-green-600 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Les deux</h3>
                <p className="text-sm text-gray-500">Double défi, double victoire</p>
              </div>
              {selectedAddictions.length === 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  function DateStep() {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto text-primary mb-4" />
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Date de début de ta sobriété
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
          <p className="text-sm text-gray-500 text-center">
            Par défaut, c'est aujourd'hui. Tu peux choisir une date passée si tu as déjà commencé.
          </p>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-800">
              <strong>Addictions sélectionnées :</strong>
            </p>
            <div className="flex justify-center space-x-2 mt-2">
              {selectedAddictions.map(addiction => (
                <span key={addiction} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                  {addiction === 'alcohol' ? '🍺 Alcool' : '🚬 Cigarette'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index <= currentStep ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <CurrentStepComponent key={currentStep} />
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                canProceed()
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? "C'est parti !" : 'Suivant'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
