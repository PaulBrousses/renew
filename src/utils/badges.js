export const badges = [
  { id: 1, days: 1, icon: "🌱", name: "Premier jour", color: "bg-green-100 text-green-800" },
  { id: 2, days: 3, icon: "💪", name: "Solide", color: "bg-blue-100 text-blue-800" },
  { id: 3, days: 7, icon: "⭐", name: "Une semaine", color: "bg-yellow-100 text-yellow-800" },
  { id: 4, days: 14, icon: "🔥", name: "Deux semaines", color: "bg-red-100 text-red-800" },
  { id: 5, days: 21, icon: "💎", name: "Trois semaines", color: "bg-purple-100 text-purple-800" },
  { id: 6, days: 30, icon: "🏆", name: "Un mois", color: "bg-indigo-100 text-indigo-800" },
  { id: 7, days: 60, icon: "🚀", name: "Deux mois", color: "bg-pink-100 text-pink-800" },
  { id: 8, days: 90, icon: "👑", name: "Trois mois", color: "bg-amber-100 text-amber-800" },
  { id: 9, days: 180, icon: "🌟", name: "Six mois", color: "bg-emerald-100 text-emerald-800" },
  { id: 10, days: 365, icon: "🏅", name: "Un an", color: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" }
];

export const getUnlockedBadges = (currentStreak) => {
  return badges.filter(badge => currentStreak >= badge.days);
};

export const getNextBadge = (currentStreak) => {
  return badges.find(badge => currentStreak < badge.days);
};
