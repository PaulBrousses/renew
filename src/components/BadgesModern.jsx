import React from 'react';
import { Trophy, Target, Zap, Star, X } from 'lucide-react';
import { getUnlockedBadges, getNextBadge } from '../utils/badges';
import { useApp } from '../hooks/useApp';

const BadgesModern = ({ isOpen, onClose }) => {
  const { user } = useApp();
  
  if (!isOpen || !user) return null;
  
  const currentStreaks = user.currentStreaks || {};
  const addictions = user.addictions || [];
  const unlockedBadges = getUnlockedBadges(currentStreaks, addictions);
  const nextBadge = getNextBadge(currentStreaks, addictions);
  
  // Grouper les badges par addiction
  const alcoholBadges = unlockedBadges.filter(badge => badge.id.includes('alcohol'));
  const cigaretteBadges = unlockedBadges.filter(badge => badge.id.includes('cigarette'));

  const BadgeCard = ({ badge, isNext = false }) => (
    <div className={`relative group ${isNext ? 'opacity-60' : ''}`}>
      <div className={`
        reward-badge rounded-2xl p-4 text-center min-w-[120px] transition-all duration-300
        ${isNext 
          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500' 
          : badge.color.includes('gradient') 
            ? `${badge.color} shadow-lg hover:shadow-xl` 
            : `${badge.color} shadow-md hover:shadow-lg`
        }
        ${!isNext && 'hover:scale-105 cursor-pointer'}
      `}>
        <div className={`text-3xl mb-2 ${!isNext && 'group-hover:scale-110'} transition-transform duration-200`}>
          {badge.icon}
        </div>
        <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
        <p className="text-xs opacity-90">
          {isNext ? `${badge.days - Math.max(...Object.values(currentStreaks).filter(v => v !== null))} jours restants` : `${badge.days} jour${badge.days > 1 ? 's' : ''}`}
        </p>
        
        {/* Effet de brillance pour les badges débloqués */}
        {!isNext && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        )}
      </div>
      
      {/* Tooltip avec description */}
      {!isNext && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {badge.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tes récompenses</h2>
              <p className="text-gray-600 text-sm">{unlockedBadges.length} badge{unlockedBadges.length > 1 ? 's' : ''} débloqué{unlockedBadges.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">{alcoholBadges.length}</div>
            <div className="text-sm font-medium text-gray-700">Badges Alcool</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-1">{cigaretteBadges.length}</div>
            <div className="text-sm font-medium text-gray-700">Badges Cigarette</div>
          </div>
        </div>

        {/* Prochain badge à débloquer */}
        {nextBadge && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Prochain objectif</h3>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <BadgeCard badge={nextBadge} isNext={true} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Progression</span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.max(...Object.values(currentStreaks).filter(v => v !== null))} / {nextBadge.days} jours
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (Math.max(...Object.values(currentStreaks).filter(v => v !== null)) / nextBadge.days) * 100)}%` 
                    }}
                  />
                </div>
                
                <p className="text-sm font-medium text-gray-700 mb-2">{nextBadge.description}</p>
                <p className="text-sm text-blue-600 font-medium">
                  Plus que {nextBadge.days - Math.max(...Object.values(currentStreaks).filter(v => v !== null))} jours !
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Badges débloqués par addiction */}
        {addictions.includes('alcohol') && alcoholBadges.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">🍷</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Badges Alcool</h3>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm font-medium text-gray-500">{alcoholBadges.length} badge{alcoholBadges.length > 1 ? 's' : ''}</span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {alcoholBadges.slice(-8).map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}

        {addictions.includes('cigarette') && cigaretteBadges.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">🚬</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Badges Cigarette</h3>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm font-medium text-gray-500">{cigaretteBadges.length} badge{cigaretteBadges.length > 1 ? 's' : ''}</span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {cigaretteBadges.slice(-8).map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}

          {/* Message d'encouragement si aucun badge */}
          {unlockedBadges.length === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tes premiers badges t'attendent !</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                Continue ton parcours jour après jour. Chaque étape franchie débloquera de nouvelles récompenses pour célébrer tes progrès.
              </p>
              <div className="mt-6 text-sm text-blue-600 font-medium">
                🌟 Premier badge dans quelques jours !
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default BadgesModern;
