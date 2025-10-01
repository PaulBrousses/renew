import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles } from 'lucide-react';

const Message = ({ message, currentStreak }) => {
  const getIcon = () => {
    if (currentStreak >= 30) return Sparkles;
    if (currentStreak >= 7) return Star;
    return Heart;
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            Message du jour
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
