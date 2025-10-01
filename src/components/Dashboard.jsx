import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, BookOpen, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Counter from './Counter';
import Badges from './Badges';
import CheckIn from './CheckIn';
import Calendar from './Calendar';
import Message from './Message';
import Journal from './Journal';

const Dashboard = () => {
  const { user, getTodayMessage } = useApp();
  const [showJournal, setShowJournal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  if (!user) return null;

  const message = getTodayMessage();

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Trophy },
    { id: 'calendar', label: 'Calendrier', icon: CalendarIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">SoberTracker</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowJournal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {activeTab === 'home' && (
          <>
            {/* Compteur principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <Counter days={user.currentStreak} />
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <Badges currentStreak={user.currentStreak} />
            </motion.div>

            {/* Message du jour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Message message={message} currentStreak={user.currentStreak} />
            </motion.div>

            {/* Check-in quotidien */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <CheckIn />
            </motion.div>

            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {user.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Streak actuel</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {user.bestStreak}
                </div>
                <div className="text-sm text-gray-600">Meilleur streak</div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <Calendar checkIns={user.checkIns} />
          </motion.div>
        )}
      </div>

      {/* Journal Modal */}
      <Journal isOpen={showJournal} onClose={() => setShowJournal(false)} />
    </div>
  );
};

export default Dashboard;
