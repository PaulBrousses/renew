import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { 
  Calendar, 
  Trophy, 
  BookOpen, 
  Settings, 
  Heart, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Edit3,
  Home,
  User,
  LogOut
} from 'lucide-react';
import CheckIn from './CheckIn';
import Journal from './Journal';
import BadgesModern from './BadgesModern';
import { generatePersonalizedMessage } from '../lib/openai';

const DashboardCompact = () => {
  const { user, setView, logout } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  // Générer le message IA au chargement
  useEffect(() => {
    if (user && !aiMessage) {
      generateAIMessage();
    }
  }, [user]);

  const generateAIMessage = async () => {
    if (!user) return;
    
    setIsLoadingMessage(true);
    try {
      const message = await generatePersonalizedMessage(user);
      setAiMessage(message);
    } catch (error) {
      
      // Message de fallback intelligent basé sur les données réelles
      const today = new Date().toISOString().split('T')[0];
      const todayRelapses = user.relapses?.filter(relapse => relapse.date === today) || [];
      const todayCheckIns = user.checkIns?.filter(checkIn => checkIn.date === today) || [];
      
      // Calculer les streaks réels
      const realStreaks = {};
      user.addictions.forEach(addiction => {
        const hasRelapseToday = todayRelapses.some(r => r.addiction === addiction);
        const hasFailedCheckIn = todayCheckIns.some(c => c.addiction === addiction && c.success === false);
        
        if (hasRelapseToday || hasFailedCheckIn) {
          realStreaks[addiction] = 0;
        } else {
          realStreaks[addiction] = user.currentStreaks?.[addiction] || 0;
        }
      });
      
      const currentStreak = Math.max(...Object.values(realStreaks).filter(v => v !== null));
      const hasRelapseToday = todayRelapses.length > 0 || todayCheckIns.some(c => c.success === false);
      const dailySavings = (user.addictions.includes('alcohol') ? 12 : 0) + (user.addictions.includes('cigarette') ? 8 : 0);
      const totalSavings = currentStreak * dailySavings;
      const addictionText = user.addictions.length === 2 ? "l'alcool et la cigarette" : user.addictions.includes('alcohol') ? "l'alcool" : "la cigarette";
      
      let fallbackMessage;
      
      if (hasRelapseToday) {
        // Messages pour rechute
        const relapseMessages = [
          `${user.firstName}, une rechute ne définit pas ton parcours ! 💪\n\nC'est une étape d'apprentissage que 90% des personnes vivent. Ton cerveau a déjà commencé à changer.\n\n🧠 Astuce : Identifie ce qui a déclenché cette rechute pour mieux l'anticiper.`,
          
          `${user.firstName}, tu peux recommencer dès maintenant ! 🌱\n\nChaque rechute t'apprend quelque chose sur tes déclencheurs. Tes ${user.bestStreaks ? Math.max(...Object.values(user.bestStreaks)) : 0} jours précédents comptent toujours.\n\n🚀 Redémarre fort : remplace cette habitude par une activité positive !`,
          
          `${user.firstName}, pas de jugement, juste de la bienveillance ! 🤗\n\nLes rechutes font partie du processus. L'important c'est de se relever rapidement.\n\n💡 Astuce : Note ce qui s'est passé pour éviter la prochaine fois.`
        ];
        fallbackMessage = relapseMessages[Math.floor(Math.random() * relapseMessages.length)];
      } else if (currentStreak === 0) {
        // Messages pour jour 0 (début)
        const startMessages = [
          `${user.firstName}, aujourd'hui marque le début de ton aventure ! 🌟\n\nChaque grand parcours commence par un premier pas. Tu as déjà pris la décision la plus importante.\n\n💪 Astuce : Fixe-toi un objectif pour demain et célèbre chaque petite victoire !`,
          
          `Bienvenue dans ton parcours, ${user.firstName} ! 🚀\n\nAujourd'hui, ton corps commence déjà à se régénérer. Dans 24h, tu auras franchi ta première étape.\n\n🌱 Astuce : Prépare des activités alternatives pour les moments difficiles !`
        ];
        fallbackMessage = startMessages[Math.floor(Math.random() * startMessages.length)];
      } else {
        // Messages pour succès
        const successMessages = [
          `${user.firstName}, après ${currentStreak} jours sans ${addictionText}, ton corps se régénère ! 🧬\n\nTu as économisé ${totalSavings}€ et ton système immunitaire est 40% plus efficace qu'au jour 1.\n\n💪 Astuce : Bois un grand verre d'eau au réveil pour booster cette détox naturelle !`,
          
          `Bravo ${user.firstName} ! ${currentStreak} jours de sobriété = ${totalSavings}€ d'économies ! 💰\n\nTon foie a éliminé 85% des toxines accumulées et ta qualité de sommeil s'améliore de 30%.\n\n🌟 Continue, chaque jour te rapproche de tes objectifs !`,
          
          `${user.firstName}, ${currentStreak} jours sans ${addictionText} : ton corps te dit MERCI ! 🙏\n\nÉconomies : ${totalSavings}€ | Espérance de vie : +2 semaines | Énergie : +50%\n\n🚀 Astuce : Remplace l'envie par 5 minutes de marche rapide !`
        ];
        fallbackMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      }
      
      setAiMessage(fallbackMessage);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const getHealthBenefits = () => {
    const benefits = [];
    const today = new Date().toISOString().split('T')[0];
    
    user.addictions.forEach(addiction => {
      const streak = user.currentStreaks?.[addiction] || 0;
      const todayRelapses = user.relapses?.filter(relapse => 
        relapse.date === today && relapse.addiction === addiction
      ) || [];
    
    if (todayRelapses.length > 0) {
        benefits.push({
          icon: '🔄',
          text: 'Rechute aujourd\'hui - Tu peux recommencer !',
          days: 0,
          addiction,
          color: 'from-orange-50 to-yellow-50 border-orange-100'
        });
      } else if (streak >= 1) {
        if (addiction === 'alcohol') {
          if (streak >= 365) benefits.push({ icon: '🏆', text: 'Transformation complète du foie', days: 365, addiction, color: 'from-purple-50 to-indigo-50 border-purple-100' });
          else if (streak >= 180) benefits.push({ icon: '🧠', text: 'Mémoire et concentration au top', days: 180, addiction, color: 'from-blue-50 to-cyan-50 border-blue-100' });
          else if (streak >= 90) benefits.push({ icon: '💪', text: 'Système immunitaire renforcé', days: 90, addiction, color: 'from-green-50 to-emerald-50 border-green-100' });
          else if (streak >= 30) benefits.push({ icon: '🫀', text: 'Foie en récupération active', days: 30, addiction, color: 'from-green-50 to-emerald-50 border-green-100' });
          else if (streak >= 14) benefits.push({ icon: '😴', text: 'Sommeil profond et réparateur', days: 14, addiction, color: 'from-blue-50 to-indigo-50 border-blue-100' });
          else if (streak >= 7) benefits.push({ icon: '🧠', text: 'Clarté mentale retrouvée', days: 7, addiction, color: 'from-purple-50 to-pink-50 border-purple-100' });
          else if (streak >= 3) benefits.push({ icon: '⚡', text: 'Plus d\'énergie au réveil', days: 3, addiction, color: 'from-yellow-50 to-orange-50 border-yellow-100' });
          else benefits.push({ icon: '💧', text: 'Hydratation optimale', days: 1, addiction, color: 'from-cyan-50 to-blue-50 border-cyan-100' });
        } else {
          if (streak >= 365) benefits.push({ icon: '🏆', text: 'Poumons comme neufs !', days: 365, addiction, color: 'from-purple-50 to-indigo-50 border-purple-100' });
          else if (streak >= 180) benefits.push({ icon: '🏃', text: 'Endurance d\'athlète', days: 180, addiction, color: 'from-green-50 to-teal-50 border-green-100' });
          else if (streak >= 90) benefits.push({ icon: '🫁', text: 'Capacité pulmonaire maximale', days: 90, addiction, color: 'from-blue-50 to-cyan-50 border-blue-100' });
          else if (streak >= 30) benefits.push({ icon: '🌬️', text: 'Poumons se régénèrent', days: 30, addiction, color: 'from-green-50 to-emerald-50 border-green-100' });
          else if (streak >= 14) benefits.push({ icon: '🩸', text: 'Circulation sanguine améliorée', days: 14, addiction, color: 'from-red-50 to-pink-50 border-red-100' });
          else if (streak >= 7) benefits.push({ icon: '👅', text: 'Goût et odorat retrouvés', days: 7, addiction, color: 'from-yellow-50 to-orange-50 border-yellow-100' });
          else if (streak >= 3) benefits.push({ icon: '💨', text: 'Respiration plus facile', days: 3, addiction, color: 'from-cyan-50 to-blue-50 border-cyan-100' });
          else benefits.push({ icon: '🌬️', text: 'Souffle plus libre', days: 1, addiction, color: 'from-green-50 to-teal-50 border-green-100' });
        }
      }
    });
    
    return benefits.slice(0, 6);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-slate-800 to-slate-900 flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Renew</h1>
              <p className="text-slate-400 text-sm">Ton allié sobriété</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-slate-700 rounded-xl">
              <Home className="w-5 h-5" />
              <span className="font-medium">Accueil</span>
            </button>
            
            
            <button
              onClick={() => setShowBadges(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Récompenses</span>
            </button>
            
                <button
              onClick={() => setShowJournal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Journal</span>
                </button>
          </div>
          </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user.firstName}</p>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
        </div>

          <button
            onClick={() => setView('auth')}
            className="w-full flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
<div className="flex-1 h-screen overflow-hidden">
        {/* Header mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b">
          <div className="px-4 py-3">
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Salut {user.firstName} ! 👋</h1>
                <p className="text-sm text-gray-600">Voici ton tableau de bord</p>
          </div>
          <button
                onClick={() => setView('auth')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
                <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
                </div>

        {/* Dashboard content */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {/* Header desktop */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Salut {user.firstName} ! 👋</h1>
            <p className="text-gray-600">Voici ton tableau de bord</p>
            </div>

          {/* Grid layout optimisé pour l'espace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* Colonne principale - 2/3 */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              
              {/* Cards des addictions - affichage intelligent */}
              <div className={`grid gap-4 ${user.addictions.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {user.addictions.map((addiction) => (
                  <div key={addiction} className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow ${
                    user.addictions.length === 1 ? 'p-8' : 'p-6'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          addiction === 'alcohol' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                        }`}>
                          <span className="text-2xl">{addiction === 'alcohol' ? '🍷' : '🚬'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 capitalize">
                            {addiction === 'alcohol' ? 'Alcool' : 'Cigarette'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Record: {user.bestStreaks?.[addiction] || 0} jour{(user.bestStreaks?.[addiction] || 0) > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-bold text-gray-900 mb-2 ${
                        user.addictions.length === 1 ? 'text-6xl' : 'text-4xl'
                      }`}>
                        {user.currentStreaks?.[addiction] || 0}
                  </div>
                      <p className={`text-gray-600 ${
                        user.addictions.length === 1 ? 'text-lg' : ''
                      }`}>jour{(user.currentStreaks?.[addiction] || 0) > 1 ? 's' : ''} de sobriété</p>
                    </div>
                </div>
                ))}
              </div>

              {/* Message IA - agrandi et amélioré */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">🧠 Message Expert IA</h3>
                      <p className="text-white/80 text-sm">Personnalisé - Jour {Math.max(...Object.values(user.currentStreaks || {}).filter(v => v !== null))}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                  <div className="leading-relaxed text-lg">
                    {isLoadingMessage ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Génération de ton message personnalisé...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">{aiMessage}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bénéfices santé */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                          <div>
                    <h3 className="font-bold text-lg text-gray-900">Bénéfices santé débloqués</h3>
                    <p className="text-gray-600 text-sm">Progrès de ton corps jour après jour</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const benefits = getHealthBenefits();
                    
                    if (benefits.length === 0) {
                      return (
                        <div className="col-span-full text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">Continue ton parcours pour débloquer des bénéfices santé !</p>
                        </div>
                      );
                    }

                    return benefits.map((benefit, index) => (
                      <div key={index} className={`p-4 bg-gradient-to-r ${benefit.color} rounded-xl border`}>
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-xl">{benefit.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm leading-tight">{benefit.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-600">
                                {benefit.addiction === 'alcohol' ? '🍷 Alcool' : '🚬 Cigarette'}
                              </span>
                              {benefit.days > 0 && (
                                <span className="text-xs font-medium text-gray-700 bg-white/50 px-2 py-1 rounded-full">
                                  Jour {benefit.days}
                          </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Sidebar widgets - 1/3 */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              
              {/* Check-in quotidien */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Check-in quotidien</h3>
                    <p className="text-green-100 text-sm">Valide ta journée</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckIn(true)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl font-semibold transition-colors backdrop-blur-sm"
                >
                  Faire mon check-in
                </button>
              </div>

              {/* Journal */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">📝 Enregistrer ma journée</h3>
                    <p className="text-gray-600 text-sm">Note tes pensées</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowJournal(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Écrire dans mon journal
                </button>
              </div>

              {/* Stats rapides */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4">📊 Tes statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Streak actuel</span>
                    <span className="font-bold text-2xl text-green-600">
                      {Math.max(...Object.values(user.currentStreaks || {}).filter(v => v !== null))}
                        </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Record</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {Math.max(...Object.values(user.bestStreaks || {}))}
                        </span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Réussite</span>
                    <span className="font-bold text-2xl text-purple-600">
                      {(() => {
                        const totalDays = user.checkIns?.length || 0;
                        const successDays = user.checkIns?.filter(c => c.success)?.length || 0;
                        return totalDays > 0 ? Math.round((successDays / totalDays) * 100) : 100;
                      })()}%
                    </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCheckIn && (
        <CheckIn
          isOpen={showCheckIn}
          onClose={() => {
            setShowCheckIn(false);
            // Recharger le message IA après un check-in
            setTimeout(() => {
              generateAIMessage();
            }, 1000);
          }}
        />
      )}

      {showJournal && (
        <Journal
          isOpen={showJournal}
          onClose={() => setShowJournal(false)}
        />
      )}

      {showBadges && (
        <BadgesModern
          isOpen={showBadges}
          onClose={() => setShowBadges(false)}
        />
      )}

    </div>
  );
};

export default DashboardCompact;