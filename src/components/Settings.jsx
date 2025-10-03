import React, { useState, useCallback } from 'react';
import { X, Settings as SettingsIcon, Plus, Trash2, Save, ArrowLeft, Wine, Cigarette } from 'lucide-react';
import { useApp } from '../hooks/useApp';

const Settings = ({ isOpen, onClose }) => {
  const { user, updateUserAddictions, setView } = useApp();
  const [selectedAddictions, setSelectedAddictions] = useState(user?.addictions || []);
  const [saving, setSaving] = useState(false);

  const addictions = [
    { id: 'alcohol', name: 'Alcool', icon: Wine, color: 'from-red-400 to-red-600', emoji: '🍷' },
    { id: 'cigarette', name: 'Cigarette', icon: Cigarette, color: 'from-gray-400 to-gray-600', emoji: '🚬' }
  ];

  const toggleAddiction = useCallback((addictionId) => {
    setSelectedAddictions(prev => {
      const newSelection = prev.includes(addictionId)
        ? prev.filter(id => id !== addictionId)
        : [...prev, addictionId];
      return newSelection;
    });
  }, []);

  const handleSave = async () => {
    if (selectedAddictions.length === 0) {
      alert('Tu dois sélectionner au moins une addiction à suivre.');
      return;
    }

    setSaving(true);
    try {
      await updateUserAddictions(selectedAddictions);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(selectedAddictions.sort()) !== JSON.stringify((user?.addictions || []).sort());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Section Addictions */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes addictions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionne les addictions que tu veux suivre. Tu peux en ajouter ou en supprimer à tout moment.
            </p>
          </div>

          {/* Liste des addictions */}
          <div className="space-y-3">
            {addictions.map((addiction) => {
              const Icon = addiction.icon;
              const isSelected = selectedAddictions.includes(addiction.id);
              const currentStreak = user?.currentStreaks?.[addiction.id] || 0;
              const bestStreak = user?.bestStreaks?.[addiction.id] || 0;
              
              return (
                <div
                  key={addiction.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleAddiction(addiction.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${addiction.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{addiction.name}</h4>
                        {isSelected && user?.addictions?.includes(addiction.id) && (
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Streak actuel: {currentStreak} jour{currentStreak > 1 ? 's' : ''}</div>
                            <div>Record: {bestStreak} jour{bestStreak > 1 ? 's' : ''}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Avertissement pour suppression */}
                  {user?.addictions?.includes(addiction.id) && !isSelected && (
                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-700">
                        ⚠️ Supprimer cette addiction effacera tes statistiques associées
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message si aucune addiction sélectionnée */}
          {selectedAddictions.length === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Tu dois sélectionner au moins une addiction à suivre.
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || selectedAddictions.length === 0 || saving}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                hasChanges && selectedAddictions.length > 0 && !saving
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
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
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Settings en plein écran pour mobile
const SettingsFullScreen = () => {
  const { user, updateUserAddictions, setView } = useApp();
  const [selectedAddictions, setSelectedAddictions] = useState(user?.addictions || []);
  const [saving, setSaving] = useState(false);

  const addictions = [
    { id: 'alcohol', name: 'Alcool', icon: Wine, color: 'from-red-400 to-red-600', emoji: '🍷' },
    { id: 'cigarette', name: 'Cigarette', icon: Cigarette, color: 'from-gray-400 to-gray-600', emoji: '🚬' }
  ];

  const toggleAddiction = useCallback((addictionId) => {
    setSelectedAddictions(prev => {
      const newSelection = prev.includes(addictionId)
        ? prev.filter(id => id !== addictionId)
        : [...prev, addictionId];
      return newSelection;
    });
  }, []);

  const handleSave = async () => {
    if (selectedAddictions.length === 0) {
      alert('Tu dois sélectionner au moins une addiction à suivre.');
      return;
    }

    setSaving(true);
    try {
      await updateUserAddictions(selectedAddictions);
      setView('dashboard');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(selectedAddictions.sort()) !== JSON.stringify((user?.addictions || []).sort());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-600">Gérer mes addictions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes addictions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionne les addictions que tu veux suivre. Tu peux en ajouter ou en supprimer à tout moment.
            </p>

            {/* Liste des addictions */}
            <div className="space-y-3">
              {addictions.map((addiction) => {
                const Icon = addiction.icon;
                const isSelected = selectedAddictions.includes(addiction.id);
                const currentStreak = user?.currentStreaks?.[addiction.id] || 0;
                const bestStreak = user?.bestStreaks?.[addiction.id] || 0;
                
                return (
                  <div
                    key={addiction.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => toggleAddiction(addiction.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${addiction.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{addiction.name}</h4>
                          {isSelected && user?.addictions?.includes(addiction.id) && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Streak actuel: {currentStreak} jour{currentStreak > 1 ? 's' : ''}</div>
                              <div>Record: {bestStreak} jour{bestStreak > 1 ? 's' : ''}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Avertissement pour suppression */}
                    {user?.addictions?.includes(addiction.id) && !isSelected && (
                      <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-xs text-orange-700">
                          ⚠️ Supprimer cette addiction effacera tes statistiques associées
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Message si aucune addiction sélectionnée */}
            {selectedAddictions.length === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                <p className="text-sm text-red-700">
                  Tu dois sélectionner au moins une addiction à suivre.
                </p>
              </div>
            )}
          </div>

          {/* Bouton de sauvegarde fixe en bas */}
          <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
            <button
              onClick={handleSave}
              disabled={!hasChanges || selectedAddictions.length === 0 || saving}
              className={`w-full px-4 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 shadow-lg ${
                hasChanges && selectedAddictions.length > 0 && !saving
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
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
                  <span>Sauvegarder les modifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
export { SettingsFullScreen };
