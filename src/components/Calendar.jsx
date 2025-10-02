import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Target } from 'lucide-react';
import { useApp } from '../hooks/useApp';

const Calendar = () => {
  const { user } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getCurrentMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Commencer le lundi
    
    const days = [];
    const current = new Date(startDate);
    
    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  const getCheckInForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    // Utiliser les vraies données de l'utilisateur
    const checkIns = user?.checkIns || [];
    return checkIns.find(checkIn => checkIn.date === dateString);
  };

  const getRelapseForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    // Utiliser les vraies données de rechutes
    const relapses = user?.relapses || [];
    return relapses.find(relapse => relapse.date === dateString);
  };

  const getDayStatus = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    const isFuture = compareDate > today;
    const isToday = compareDate.getTime() === today.getTime();
    
    const checkIns = user?.checkIns || [];
    const relapses = user?.relapses || [];
    const dateString = date.toISOString().split('T')[0];
    
    // Chercher les check-ins et rechutes pour cette date
    const dayCheckIns = checkIns.filter(checkIn => checkIn.date === dateString);
    const dayRelapses = relapses.filter(relapse => relapse.date === dateString);
    
    // Vérifier s'il y a eu des succès ou des rechutes
    const hasSuccess = dayCheckIns.some(checkIn => checkIn.success === true);
    const hasFailure = dayCheckIns.some(checkIn => checkIn.success === false) || dayRelapses.length > 0;
    
    if (isFuture) return { type: 'future', color: 'bg-gray-50 text-gray-300', icon: null };
    
    if (isToday) {
      if (hasFailure) return { type: 'today-fail', color: 'bg-red-500 text-white ring-2 ring-red-300', icon: '✗' };
      if (hasSuccess) return { type: 'today-success', color: 'bg-green-500 text-white ring-2 ring-green-300', icon: '✓' };
      return { type: 'today', color: 'bg-blue-100 text-blue-600 ring-2 ring-blue-300', icon: '●' };
    }
    
    if (hasFailure) return { type: 'fail', color: 'bg-red-500 text-white shadow-sm', icon: '✗' };
    if (hasSuccess) return { type: 'success', color: 'bg-green-500 text-white shadow-sm', icon: '✓' };
    
    return { type: 'no-data', color: 'bg-gray-100 text-gray-400', icon: null };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getStreakStats = () => {
    if (!user) return { currentStreak: 0, longestStreak: 0 };
    
    // Utiliser les streaks calculés de l'utilisateur
    const currentStreak = Math.max(
      user.currentStreaks?.alcohol || 0,
      user.currentStreaks?.cigarette || 0
    );
    
    const longestStreak = Math.max(
      user.bestStreaks?.alcohol || 0,
      user.bestStreaks?.cigarette || 0
    );
    
    return { currentStreak, longestStreak };
  };

  const { days, firstDay, lastDay } = getCurrentMonth();
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const { currentStreak, longestStreak } = getStreakStats();
  const checkIns = user?.checkIns || [];
  const successRate = checkIns.length > 0 ? Math.round((checkIns.filter(c => c.success).length / checkIns.length) * 100) : 0;

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Chargement du calendrier...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Calendrier</h2>
            <p className="text-gray-600 text-xs">Suivi de tes journées</p>
          </div>
        </div>
        
        {/* Statistiques compactes */}
        <div className="flex space-x-2">
          <div className="bg-green-50 rounded-lg px-2 py-1 text-center min-w-[50px]">
            <div className="text-lg font-bold text-green-600">{currentStreak}</div>
            <div className="text-xs text-green-700">Actuel</div>
          </div>
          <div className="bg-blue-50 rounded-lg px-2 py-1 text-center min-w-[50px]">
            <div className="text-lg font-bold text-blue-600">{longestStreak}</div>
            <div className="text-xs text-blue-700">Record</div>
          </div>
          <div className="bg-purple-50 rounded-lg px-2 py-1 text-center min-w-[50px]">
            <div className="text-lg font-bold text-purple-600">{successRate}%</div>
            <div className="text-xs text-purple-700">Réussite</div>
          </div>
        </div>
      </div>

      {/* Calendrier principal compact */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {/* Navigation du mois */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <h3 className="text-sm font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(day => (
            <div key={day} className="p-1 text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier compacte */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const status = getDayStatus(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const checkIn = getCheckInForDate(date);
            const relapse = getRelapseForDate(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`
                  relative w-full h-8 flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105
                  ${status.color}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
                title={`${date.toLocaleDateString('fr-FR')} - ${
                  relapse 
                    ? 'Rechute ✗'
                    : checkIn?.success 
                      ? 'Journée réussie ✓' 
                      : date > new Date() ? 'Futur' : 'Pas de données'
                }`}
              >
                <span className="absolute top-0 left-0 text-xs leading-none">
                  {date.getDate()}
                </span>
                {status.icon && (
                  <span className="text-sm">
                    {status.icon}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende compacte */}
        <div className="flex justify-center gap-3 mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-xs text-gray-600">Réussi</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-xs text-gray-600">Rechute</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Aujourd'hui</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
