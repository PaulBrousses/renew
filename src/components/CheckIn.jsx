import React, { useState } from 'react';
import { CheckCircle, XCircle, Wine, Cigarette, Calendar, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../hooks/useApp';
import Journal from './Journal';

const CheckIn = ({ isOpen, onClose }) => {
  const { user, checkInSuccess, checkInRelapse, getTodayCheckIns } = useApp();
  const [showCatchUpModal, setShowCatchUpModal] = useState(false);
  const [catchUpDays, setCatchUpDays] = useState([]);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [pendingCheckIn, setPendingCheckIn] = useState(null);

  if (!user) return null;

  const todayCheckIns = getTodayCheckIns();
  const hasAlcoholCheckIn = todayCheckIns?.alcohol !== undefined;
  const hasCigaretteCheckIn = todayCheckIns?.cigarette !== undefined;

  const handleSuccess = (addiction) => {
    // Ouvrir le journal avant de valider
    setPendingCheckIn({ type: 'success', addiction });
    setShowJournalModal(true);
  };

  const handleRelapse = (addiction) => {
    // Ouvrir le journal avant de valider
    setPendingCheckIn({ type: 'relapse', addiction });
    setShowJournalModal(true);
  };

  const handleJournalSave = (journalData) => {
    if (pendingCheckIn) {
      if (pendingCheckIn.type === 'success') {
        checkInSuccess(pendingCheckIn.addiction, journalData.mood, journalData.note);
        
        // Animation confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4A90E2', '#50C878']
        });
      } else {
        checkInRelapse(pendingCheckIn.addiction, journalData.mood, journalData.note);
      }
      
      setPendingCheckIn(null);
      setShowJournalModal(false);
      if (onClose) onClose(); // Fermer la modale après le check-in
    }
  };

  const openCatchUp = () => {
    // Calculer les jours manqués (max 7 jours)
    const today = new Date();
    const lastCheckIn = user.lastCheckIn ? new Date(user.lastCheckIn) : new Date(user.startDate);
    const daysDiff = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1 && daysDiff <= 7) {
      const missedDays = [];
      for (let i = daysDiff - 1; i > 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        missedDays.push({
          date: date.toISOString().split('T')[0],
          dateStr: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
        });
      }
      setCatchUpDays(missedDays);
      setShowCatchUpModal(true);
    }
  };

  // Afficher le bouton de rattrapage si nécessaire
  const shouldShowCatchUp = () => {
    if (!user.lastCheckIn) return false;
    const today = new Date();
    const lastCheckIn = new Date(user.lastCheckIn);
    const daysDiff = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
    return daysDiff > 1 && daysDiff <= 7;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header modal */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Check-in quotidien</h3>
              <p className="text-gray-600 text-sm">Comment s'est passée ta journée ?</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">

      {/* Bouton de rattrapage */}
      {shouldShowCatchUp() && (
        <button
          onClick={openCatchUp}
          className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-xl transition-colors border border-yellow-200 flex items-center justify-center space-x-2 hover:scale-[1.02]"
        >
          <Calendar className="w-4 h-4" />
          <span>Rattraper les jours manqués</span>
        </button>
      )}

      {/* Check-ins par addiction */}
      <div className="space-y-4">
        {user.addictions.includes('alcohol') && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Wine className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Alcool</span>
              </div>
              {hasAlcoholCheckIn && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            {!hasAlcoholCheckIn ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSuccess('alcohol')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  ✅ Tenu
                </button>
                <button
                  onClick={() => handleRelapse('alcohol')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  ❌ Recraché
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-700 text-center">
                {todayCheckIns.alcohol ? '🎉 Bien joué !' : '💪 Tu recommences, c\'est bien !'}
              </p>
            )}
          </div>
        )}

        {user.addictions.includes('cigarette') && (
          <div className="card bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Cigarette className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">Cigarette</span>
              </div>
              {hasCigaretteCheckIn && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            {!hasCigaretteCheckIn ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSuccess('cigarette')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  ✅ Tenu
                </button>
                <button
                  onClick={() => handleRelapse('cigarette')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  ❌ Recraché
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-700 text-center">
                {todayCheckIns.cigarette ? '🎉 Bien joué !' : '💪 Tu recommences, c\'est bien !'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal de rattrapage */}
      {showCatchUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Rattraper les jours manqués
              </h3>
              <div className="space-y-3">
                {catchUpDays.map((day) => (
                  <div key={day.date} className="border rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-800 mb-2">
                      {day.dateStr}
                    </p>
                    <div className="space-y-2">
                      {user.addictions.map(addiction => (
                        <div key={addiction} className="flex items-center justify-between">
                          <span className="text-sm">
                            {addiction === 'alcohol' ? '🍺 Alcool' : '🚬 Cigarette'}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {/* TODO: Implémenter rattrapage */}}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                            >
                              Tenu
                            </button>
                            <button
                              onClick={() => {/* TODO: Implémenter rattrapage */}}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                            >
                              Recraché
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowCatchUpModal(false)}
                  className="w-full p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
          </div>
        </div>
      )}

          </div>
        </div>
      </div>

      {/* Modal Journal obligatoire */}
      <Journal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false);
          setPendingCheckIn(null);
        }}
        forceEntry={true}
        onSave={handleJournalSave}
        addiction={pendingCheckIn?.addiction}
        checkInType={pendingCheckIn?.type}
      />
    </>
  );
};

export default CheckIn;