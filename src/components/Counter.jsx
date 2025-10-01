import React from 'react';
import { motion } from 'framer-motion';

const Counter = ({ days, isAnimating = false }) => {
  return (
    <div className="text-center py-8">
      <motion.div
        key={days}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.6 
        }}
        className="relative"
      >
        <div className="text-8xl font-bold gradient-text mb-2">
          {days}
        </div>
        <div className="text-2xl text-gray-600 font-medium">
          {days === 0 ? 'Commence aujourd\'hui' : days === 1 ? 'jour' : 'jours'}
        </div>
        
        {isAnimating && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 border-4 border-secondary rounded-full"
          />
        )}
      </motion.div>
      
      {days > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mt-4"
        >
          de sobriété continue
        </motion.p>
      )}
    </div>
  );
};

export default Counter;
