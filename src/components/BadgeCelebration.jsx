import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const BadgeCelebration = ({ badge, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Confettis immédiat
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });

      // Confettis en cascade
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#45B7D1', '#96CEB4', '#FFEAA7']
        });
      }, 400);

      // Animation de pulsation continue
      const pulseInterval = setInterval(() => {
        confetti({
          particleCount: 20,
          spread: 30,
          origin: { y: 0.7 },
          colors: ['#FFD700', '#FFF']
        });
      }, 1000);

      // Nettoyage après 5 secondes
      setTimeout(() => {
        clearInterval(pulseInterval);
      }, 5000);

      return () => clearInterval(pulseInterval);
    }
  }, [isOpen, badge]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay avec effet de flou */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal de célébration */}
      <div className={`relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        isAnimating 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-75 opacity-0 translate-y-8'
      }`}>
        
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Animation de brillance en arrière-plan */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] transform skew-x-12" />
        </div>

        {/* Contenu principal */}
        <div className="text-center space-y-6 relative z-10">
          
          {/* Icône de succès avec animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Cercles d'onde */}
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-green-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Titre de félicitations */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 animate-bounce">
              🎉 Félicitations !
            </h2>
            <p className="text-gray-600">Tu as débloqué une nouvelle récompense</p>
          </div>

          {/* Badge débloqué */}
          <div className="relative">
            <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl ${badge.color} shadow-lg transform hover:scale-105 transition-transform`}>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                {badge.icon}
              </span>
              <div className="text-left">
                <h3 className="font-bold text-lg">{badge.name}</h3>
                <p className="text-sm opacity-90">{badge.days} jour{badge.days > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            {/* Effet de lueur */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl animate-pulse" />
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-700 font-medium">{badge.description}</p>
          </div>

          {/* Message motivationnel */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Continue comme ça !</span>
              <Sparkles className="w-5 h-5" />
            </div>
            
            <p className="text-sm text-gray-600">
              Chaque jour compte dans ton parcours vers la liberté
            </p>
          </div>

          {/* Bouton de fermeture */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Continuer mon parcours
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
      `}</style>
    </div>
  );
};

export default BadgeCelebration;
