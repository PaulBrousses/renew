import React, { useState, useCallback } from 'react';
import { BookOpen, X, Save, Calendar, Heart, Smile, Meh, Frown } from 'lucide-react';
import { useApp } from '../hooks/useApp';

// Composant JournalContent moderne et compact
const JournalContent = ({ 
  mood, 
  setMood, 
  note, 
  setNote, 
  handleSave, 
  saving, 
  embedded, 
  forceEntry, 
  getJournalEntries,
  addiction,
  checkInType
}) => {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Bien', icon: Smile, color: 'from-green-400 to-emerald-500' },
    { id: 'neutral', emoji: '😐', label: 'Moyen', icon: Meh, color: 'from-yellow-400 to-orange-500' },
    { id: 'sad', emoji: '😔', label: 'Difficile', icon: Frown, color: 'from-red-400 to-pink-500' }
  ];

  return (
    <div className="space-y-4">
      {/* Header contextuel */}
      {!embedded && (
        <div className="text-center mb-6">
          <div className={`w-12 h-12 bg-gradient-to-r ${addiction ? 
            (checkInType === 'success' ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-500') : 
            'from-purple-500 to-pink-500'} rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {addiction ? (
              checkInType === 'success' ? '🎉 Bravo pour cette journée !' : '💪 Tu peux recommencer !'
            ) : (
              'Comment tu te sens ?'
            )}
          </h3>
          {addiction && (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
              {addiction === 'alcohol' ? '🍷 Alcool' : '🚬 Cigarette'} - 
              {checkInType === 'success' ? ' Journée réussie' : ' Rechute'}
            </div>
          )}
        </div>
      )}
      
      {/* Sélection d'humeur moderne */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Comment tu te sens aujourd'hui ?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {moods.map(moodOption => {
            const IconComponent = moodOption.icon;
            return (
              <button
                key={moodOption.id}
                onClick={() => setMood(moodOption.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 group ${
                  mood === moodOption.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${moodOption.color} rounded-lg flex items-center justify-center mx-auto mb-2 ${
                  mood === moodOption.id ? 'shadow-lg' : 'group-hover:shadow-md'
                }`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-medium text-gray-700">{moodOption.label}</div>
                {mood === moodOption.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone de texte améliorée */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {forceEntry ? 'Raconte-nous ta journée *' : 'Tes pensées (optionnel)'}
        </label>
        <div className="relative">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              addiction && checkInType === 'success' 
                ? `Bravo ! Qu'est-ce qui t'a aidé à réussir cette journée sans ${addiction === 'alcohol' ? 'alcool' : 'cigarette'} ?`
                : addiction && checkInType === 'relapse'
                ? `Qu'est-ce qui s'est passé ? Comment te sens-tu maintenant ?`
                : "Partage tes pensées, tes défis ou tes victoires du jour..."
            }
            maxLength={300}
            rows={3}
            className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-colors ${
              forceEntry && !note.trim() ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {note.length}/300
          </div>
        </div>
        {forceEntry && !note.trim() && (
          <p className="text-xs text-red-500 mt-1">Une petite note est requise pour continuer</p>
        )}
      </div>

      {/* Bouton de sauvegarde moderne */}
      <button
        onClick={handleSave}
        disabled={!mood || (forceEntry && !note.trim()) || saving}
        className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
          mood && (!forceEntry || note.trim()) && !saving
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sauvegarde...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Sauvegarder mon entrée</span>
          </>
        )}
      </button>

      {/* Entrées récentes compactes */}
      {!embedded && getJournalEntries().length > 0 && (
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-600" />
              Entrées récentes
            </h4>
            <span className="text-xs text-gray-500">{getJournalEntries().length} entrée{getJournalEntries().length > 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {getJournalEntries().slice(0, 3).map((entry, index) => {
              const entryMood = moods.find(m => m.id === entry.mood);
              return (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-6 h-6 bg-gradient-to-r ${entryMood?.color || 'from-gray-400 to-gray-500'} rounded-md flex items-center justify-center`}>
                          {entryMood && React.createElement(entryMood.icon, { className: "w-3 h-3 text-white" })}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        <span className="text-xs text-gray-500">{entryMood?.label}</span>
                      </div>
                      {entry.note && (
                        <p className="text-xs text-gray-700 line-clamp-2">"{entry.note}"</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Journal = ({ isOpen, onClose, embedded = false, forceEntry = false, onSave = null, addiction = null, checkInType = null }) => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const { saveJournalEntry, getJournalEntries } = useApp();

  const handleSave = useCallback(async () => {
    if (!mood || (forceEntry && !note.trim())) return;
    
    setSaving(true);
    try {
      const entry = {
        date: new Date().toISOString().split('T')[0],
        mood,
        note: note.trim(),
        timestamp: new Date().toISOString(),
        addiction,
        checkInType
      };
      
      if (saveJournalEntry) {
        await saveJournalEntry(entry);
      }
      
      if (onSave) {
        onSave({ mood, note: note.trim() });
      }
      
      if (!embedded && onClose) {
        onClose();
      }
      
      // Reset form
      setMood('');
      setNote('');
    } catch (error) {
    } finally {
      setSaving(false);
    }
  }, [mood, note, saveJournalEntry, onSave, embedded, onClose, addiction, checkInType]);

  const getRecentEntries = useCallback(() => {
    return getJournalEntries?.() || [];
  }, [getJournalEntries]);

  if (embedded) {
    return (
      <JournalContent
        mood={mood}
        setMood={setMood}
        note={note}
        setNote={setNote}
        handleSave={handleSave}
        saving={saving}
        embedded={embedded}
        forceEntry={forceEntry}
        getJournalEntries={getRecentEntries}
        addiction={addiction}
        checkInType={checkInType}
      />
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mon Journal</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <JournalContent
              mood={mood}
              setMood={setMood}
              note={note}
              setNote={setNote}
              handleSave={handleSave}
              saving={saving}
              embedded={embedded}
              forceEntry={forceEntry}
              getJournalEntries={getRecentEntries}
              addiction={addiction}
              checkInType={checkInType}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Journal;