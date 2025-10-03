import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generatePersonalizedMessage = async (user) => {
  try {
    const firstName = user.firstName;
    const addictions = user.addictions;
    const today = new Date().toISOString().split('T')[0];
    
    // Vérifier les rechutes d'aujourd'hui
    const todayRelapses = user.relapses?.filter(relapse => relapse.date === today) || [];
    const todayCheckIns = user.checkIns?.filter(checkIn => checkIn.date === today) || [];
    
    // Calculer les streaks réels en tenant compte des rechutes d'aujourd'hui
    const realStreaks = {};
    addictions.forEach(addiction => {
      const hasRelapseToday = todayRelapses.some(r => r.addiction === addiction);
      const hasFailedCheckIn = todayCheckIns.some(c => c.addiction === addiction && c.success === false);
      
      if (hasRelapseToday || hasFailedCheckIn) {
        realStreaks[addiction] = 0; // Rechute aujourd'hui = 0 jour
      } else {
        realStreaks[addiction] = user.currentStreaks?.[addiction] || 0;
      }
    });
    
    const currentStreak = Math.max(...Object.values(realStreaks).filter(v => v !== null));
    const hasRelapseToday = todayRelapses.length > 0 || todayCheckIns.some(c => c.success === false);
    const situation = hasRelapseToday ? 'relapse' : 'onStreak';
    
    const addictionText = addictions.length === 2 
      ? "l'alcool et la cigarette" 
      : addictions.includes('alcohol') 
        ? "l'alcool" 
        : "la cigarette";

    // Calcul des économies (seulement si pas de rechute aujourd'hui)
    const dailySavings = (addictions.includes('alcohol') ? 12 : 0) + (addictions.includes('cigarette') ? 8 : 0);
    const totalSavings = currentStreak * dailySavings;
    
    // Récupérer les données du journal d'aujourd'hui
    const todayJournalEntries = todayCheckIns.filter(c => c.note && c.note.trim() !== '');
    const journalContext = todayJournalEntries.length > 0 
      ? `Journal d'aujourd'hui: ${todayJournalEntries.map(e => `${e.addiction}: "${e.note}"`).join(', ')}`
      : '';
    
    // Identifier les addictions en rechute aujourd'hui
    const relapseAddictions = todayRelapses.map(r => r.addiction).concat(
      todayCheckIns.filter(c => c.success === false).map(c => c.addiction)
    );

    const prompt = `Tu es un expert en addictologie et coach de vie spécialisé dans la sobriété. Tu aides ${firstName} dans son parcours.

Contexte:
- Prénom: ${firstName}
- Addiction(s): ${addictionText}
- Streak réel: ${currentStreak} jours
- Situation: ${situation}
- Économies: ${totalSavings}€
- Rechutes aujourd'hui: ${relapseAddictions.length > 0 ? relapseAddictions.join(', ') : 'aucune'}
${journalContext ? `- ${journalContext}` : ''}

MISSION: ${situation === 'relapse' ? 'Génère un message BIENVEILLANT et MOTIVANT pour une rechute' : 'Génère un message ULTRA-MOTIVANT et INFORMATIF'} qui inclut:

${situation === 'relapse' ? `
1. BIENVEILLANCE - Pas de jugement, c'est normal dans le parcours
2. PERSPECTIVE - Les rechutes font partie du processus d'apprentissage
3. ENCOURAGEMENT - Se concentrer sur le redémarrage immédiat
4. ASTUCE PRATIQUE - Comment éviter la prochaine rechute
${journalContext ? '5. RÉACTION au journal - Commenter ce qui a été écrit' : ''}
` : `
1. UN FAIT SCIENTIFIQUE précis sur les bénéfices santé à ${currentStreak} jours
2. UNE DONNÉE CHIFFRÉE impressionnante (économies, santé, statistiques)
3. UN ENCOURAGEMENT personnalisé avec le prénom
4. UNE ASTUCE PRATIQUE ou conseil pour continuer
${journalContext ? '5. RÉACTION au journal - Commenter positivement ce qui a été écrit' : ''}
`}

STYLE:
- Ton expert mais ${situation === 'relapse' ? 'bienveillant et compréhensif' : 'accessible et motivant'}
- ${situation === 'relapse' ? 'Empathique sans dramatiser' : 'Données scientifiques vulgarisées'}
- ${situation === 'relapse' ? 'Encourageant pour redémarrer' : 'Motivant et énergique'}
- 3-4 phrases maximum
- Utilise des emojis pertinents

${situation === 'relapse' ? `
EXEMPLE pour rechute:
"${firstName}, une rechute ne définit pas ton parcours ! 💪 C'est une étape d'apprentissage que 90% des personnes vivent. Ton cerveau a déjà commencé à changer lors de tes ${user.bestStreaks ? Math.max(...Object.values(user.bestStreaks)) : 0} jours précédents. 🧠 Astuce: identifie ce qui a déclenché cette rechute pour mieux l'anticiper la prochaine fois."
` : `
EXEMPLE pour succès:
"${firstName}, après ${currentStreak} jours sans ${addictionText}, ton foie a éliminé 85% des toxines accumulées ! 🧬 Tu as économisé ${totalSavings}€ et gagné l'équivalent de 2 semaines d'espérance de vie. Ton système immunitaire est 40% plus efficace qu'au jour 1. 💪 Astuce: bois un grand verre d'eau au réveil pour booster cette détox naturelle !"
`}

Génère maintenant ton message expert:`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    
    // Message de fallback riche basé sur les données locales
    const { getRichMessageForDay } = await import('../utils/messages.js');
    const richMsg = getRichMessageForDay(currentStreak, situation, addictions, firstName);
    
    return `${richMsg.title}\n\n${richMsg.message}\n\n${richMsg.tip || '💪 Continue, tu es sur la bonne voie !'}`
  }
}
