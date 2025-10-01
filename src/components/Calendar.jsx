import React from 'react';
import { motion } from 'framer-motion';

const Calendar = ({ checkIns = [] }) => {
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const getCheckInForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return checkIns.find(checkIn => checkIn.date === dateString);
  };

  const getDayColor = (date, checkIn) => {
    const today = new Date().toDateString();
    const isToday = date.toDateString() === today;
    const isFuture = date > new Date();
    
    if (isFuture) return 'bg-gray-100';
    if (!checkIn) return 'bg-gray-200';
    if (checkIn.success) return 'bg-secondary';
    return 'bg-red-300';
  };

  const days = getLast30Days();
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Tes 30 derniers jours</h3>
      
      <div className="space-y-2">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
          {dayNames.map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const checkIn = getCheckInForDate(date);
            const dayColor = getDayColor(date, checkIn);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.div
                key={date.toISOString()}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  w-8 h-8 rounded-md ${dayColor} flex items-center justify-center text-xs font-medium
                  ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                  ${checkIn ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
                `}
                title={`${date.toLocaleDateString('fr-FR')} - ${
                  checkIn 
                    ? checkIn.success ? 'Tenu' : 'Rechute'
                    : date > new Date() ? 'Futur' : 'Pas de données'
                }`}
              >
                {checkIn?.success && '✓'}
                {checkIn && !checkIn.success && '✗'}
                {isToday && !checkIn && '●'}
              </motion.div>
            );
          })}
        </div>
        
        {/* Légende */}
        <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-secondary rounded-sm"></div>
            <span>Tenu</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-300 rounded-sm"></div>
            <span>Rechute</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            <span>Pas de données</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
