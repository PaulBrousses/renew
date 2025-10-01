export const messages = {
  day1: {
    alcohol: "Le premier jour est toujours le plus dur. Mais regarde, tu l'as fait. 💪",
    cigarette: "Première journée sans cigarette. Ton corps commence déjà à guérir. 🌬️",
    both: "Double défi, double courage. Tu es plus fort que tu le crois. 🎯"
  },
  day3: {
    alcohol: "Trois jours. Le pic de difficulté physique est bientôt passé. Tiens bon.",
    cigarette: "72h sans nicotine. Le pire est derrière toi. Continue.",
    both: "Trois jours de liberté. Ton corps te remercie déjà."
  },
  day7: {
    alcohol: "Une semaine complète. 🎉 Tu as prouvé que tu peux le faire.",
    cigarette: "Sept jours smoke-free. Ton goût et ton odorat reviennent. Sens la différence.",
    both: "Une semaine de sobriété totale. C'est énorme. Continue."
  },
  day14: {
    alcohol: "Deux semaines. Ton sommeil s'améliore, ton énergie aussi. Tu le sens ?",
    cigarette: "Deux semaines. Tes poumons commencent à se régénérer. Respire profondément.",
    both: "14 jours. Tu es officiellement sur le chemin de la transformation. 🔥"
  },
  day21: {
    alcohol: "Trois semaines ! L'habitude se casse. Tu deviens quelqu'un de nouveau.",
    cigarette: "21 jours. Scientifiquement, c'est le temps pour créer une nouvelle habitude. Bravo !",
    both: "Trois semaines de liberté totale. Tu réécris ton histoire. 📖"
  },
  day30: {
    alcohol: "UN MOIS. 🏆 Regarde tout le chemin parcouru. Tu n'es plus la même personne.",
    cigarette: "30 jours sans fumer. Tes risques cardiovasculaires ont déjà baissé. Continue !",
    both: "Un mois de sobriété complète. C'est rare, c'est puissant, c'est toi. 👑"
  },
  day60: {
    alcohol: "Deux mois ! Ton foie te dit merci. Ton portefeuille aussi. 💰",
    cigarette: "60 jours. Tes poumons se régénèrent activement. Respire cette victoire.",
    both: "Deux mois complets. Tu es dans le top 5% des gens qui y arrivent. 🌟"
  },
  day90: {
    alcohol: "Trois mois. C'est officiel : tu as cassé l'habitude. C'est un mode de vie maintenant.",
    cigarette: "90 jours. Tes poumons fonctionnent à 30% mieux qu'avant. Incroyable non ?",
    both: "Trois mois sans rien. Tu es une inspiration. Continue. 🌟"
  },
  day180: {
    alcohol: "Six mois ! Ton corps s'est complètement régénéré. Tu es une nouvelle personne.",
    cigarette: "180 jours. Tes risques d'infarctus ont chuté drastiquement. La vie est belle.",
    both: "Six mois de liberté totale. Tu as prouvé que tout est possible. 🚀"
  },
  day365: {
    alcohol: "UN AN ! 365 jours de liberté. Tu as écrit une nouvelle histoire. Fier de toi.",
    cigarette: "Une année complète ! Tes poumons sont comme neufs. Tu as gagné des années de vie.",
    both: "365 jours de sobriété totale. Tu es devenu légendaire. Continue l'aventure ! 🏆"
  },
  relapse: {
    alcohol: "La rechute ne supprime pas tes progrès précédents. Elle fait partie du chemin. Prêt à recommencer ?",
    cigarette: "Tu as fumé une cigarette. OK. Et maintenant ? Tu recommences ou tu abandonnes ? Choisis.",
    both: "Rechute sur une addiction. Pas grave. Garde tes autres victoires. Chaque progrès compte.",
    general: "Tu n'as pas échoué. Tu as juste trouvé une façon qui ne marche pas. Recommence. 💙"
  },
  motivation: [
    "Chaque jour sobre est une victoire. Célèbre-la.",
    "Tu es plus fort que tes addictions. Prouve-le aujourd'hui.",
    "Ton futur toi te remercie pour ce que tu fais maintenant.",
    "La liberté n'a pas de prix. Tu es en train de l'acheter.",
    "Regarde comme tu as grandi depuis le premier jour.",
    "Tes proches sont fiers de toi. Même s'ils ne le disent pas.",
    "Chaque 'non' que tu dis te rend plus fort.",
    "Tu construis une nouvelle version de toi. Brick by brick.",
    "La sobriété n'est pas une punition. C'est un cadeau que tu te fais.",
    "Tu as déjà prouvé que tu peux le faire. Continue."
  ]
};

export const getMessageForDay = (day, status, addictions) => {
  if (status === 'relapse') {
    if (addictions.length === 1) {
      return messages.relapse[addictions[0]] || messages.relapse.general;
    }
    return messages.relapse.both;
  }

  const addictionKey = addictions.length === 1 ? addictions[0] : 'both';
  
  if (day === 1) return messages.day1[addictionKey];
  if (day === 3) return messages.day3[addictionKey];
  if (day === 7) return messages.day7[addictionKey];
  if (day === 14) return messages.day14[addictionKey];
  if (day === 21) return messages.day21[addictionKey];
  if (day === 30) return messages.day30[addictionKey];
  if (day === 60) return messages.day60[addictionKey];
  if (day === 90) return messages.day90[addictionKey];
  if (day === 180) return messages.day180[addictionKey];
  if (day === 365) return messages.day365[addictionKey];
  
  const randomMotivation = messages.motivation[Math.floor(Math.random() * messages.motivation.length)];
  return randomMotivation;
};
