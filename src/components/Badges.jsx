import React from 'react';
import { motion } from 'framer-motion';
import { getUnlockedBadges, getNextBadge } from '../utils/badges';

const Badges = ({ currentStreak }) => {
  const unlockedBadges = getUnlockedBadges(currentStreak);
  const nextBadge = getNextBadge(currentStreak);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Tes badges</h3>
      
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {unlockedBadges.slice(-4).map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex-shrink-0 px-4 py-3 rounded-xl ${badge.color} text-center min-w-[100px]`}
          >
            <div className="text-2xl mb-1">{badge.icon}</div>
            <div className="text-xs font-medium">{badge.name}</div>
            <div className="text-xs opacity-75">{badge.days}j</div>
          </motion.div>
        ))}
        
        {nextBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-shrink-0 px-4 py-3 rounded-xl bg-gray-100 text-gray-400 text-center min-w-[100px] border-2 border-dashed border-gray-300"
          >
            <div className="text-2xl mb-1 grayscale">{nextBadge.icon}</div>
            <div className="text-xs font-medium">{nextBadge.name}</div>
            <div className="text-xs">
              {nextBadge.days - currentStreak}j restants
            </div>
          </motion.div>
        )}
      </div>
      
      {unlockedBadges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🌱</div>
          <p>Ton premier badge t'attend demain !</p>
        </div>
      )}
    </div>
  );
};

export default Badges;
