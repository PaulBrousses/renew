import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Journal = ({ isOpen, onClose }) => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const { user } = useApp();

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Bien' },
    { id: 'neutral', emoji: '😐', label: 'Moyen' },
    { id: 'sad', emoji: '😔', label: 'Difficile' }
  ];

  const handleSave = () => {
    if (mood) {
      // Ici on pourrait sauvegarder dans le contexte
      // Pour le MVP, on ferme juste le modal
      onClose();
      setMood('');
      setNote('');
    }
  };

  const getRecentEntries = () => {
    // Simulation d'entrées récentes pour le MVP
    return user?.checkIns?.slice(-5).map(checkIn => ({
      date: checkIn.date,
      mood: checkIn.mood || 'happy',
      note: checkIn.note || 'Bonne journée'
    })) || [];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="card max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-800">Mon Journal</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Nouvelle entrée */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">
                  Comment tu te sens aujourd'hui ?
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {moods.map(moodOption => (
                    <button
                      key={moodOption.id}
                      onClick={() => setMood(moodOption.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        mood === moodOption.id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{moodOption.emoji}</div>
                      <div className="text-sm font-medium">{moodOption.label}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (optionnel)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Comment s'est passée ta journée ?"
                    maxLength={150}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {note.length}/150 caractères
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!mood}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all ${
                    mood
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              {/* Entrées récentes */}
              {getRecentEntries().length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Entrées récentes
                  </h3>
                  <div className="space-y-3">
                    {getRecentEntries().map((entry, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-lg">
                            {moods.find(m => m.id === entry.mood)?.emoji || '😊'}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-700">{entry.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Journal;
