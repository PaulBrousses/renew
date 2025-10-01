import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

const CheckIn = () => {
  const { user, checkInSuccess, checkInRelapse, hasCheckedInToday } = useApp();
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const hasCheckedToday = hasCheckedInToday();

  const handleSuccess = () => {
    checkInSuccess();
    
    // Animation confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4A90E2', '#50C878', '#FF9F43']
    });
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleRelapse = (addiction) => {
    checkInRelapse(addiction);
    setShowRelapseModal(false);
  };

  if (hasCheckedToday) {
    const lastCheckIn = user.checkIns[user.checkIns.length - 1];
    const isSuccess = lastCheckIn?.success;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}
      >
        <div className="text-center py-6">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isSuccess ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {isSuccess ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : (
              <X className="w-8 h-8 text-orange-600" />
            )}
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isSuccess ? 'text-green-800' : 'text-orange-800'
          }`}>
            {isSuccess ? 'Déjà validé pour aujourd\'hui ✅' : 'Rechute enregistrée'}
          </h3>
          <p className={`text-sm ${
            isSuccess ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isSuccess 
              ? 'Bravo ! Reviens demain pour continuer ton streak.'
              : 'Pas de jugement. Demain est un nouveau jour.'
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          Comment s'est passée ta journée ?
        </h3>
        
        <div className="space-y-3">
          <motion.button
            onClick={handleSuccess}
            className="w-full btn-primary flex items-center justify-center space-x-3 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Check className="w-5 h-5" />
            <span>J'ai tenu aujourd'hui ✅</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowRelapseModal(true)}
            className="w-full btn-secondary flex items-center justify-center space-x-3 py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="w-5 h-5" />
            <span>J'ai recraché ❌</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Modal de rechute */}
      <AnimatePresence>
        {showRelapseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRelapseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Quelle addiction ?
                </h3>
                <p className="text-sm text-gray-600">
                  Pas de jugement. Chaque jour est un nouveau départ.
                </p>
              </div>
              
              <div className="space-y-3">
                {user.addictions.map(addiction => (
                  <button
                    key={addiction}
                    onClick={() => handleRelapse(addiction)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    {addiction === 'alcohol' ? '🍺 Alcool' : '🚬 Cigarette'}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowRelapseModal(false)}
                className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de succès */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            🎉 Bravo ! Un jour de plus !
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CheckIn;
