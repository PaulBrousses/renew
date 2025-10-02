import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generatePersonalizedMessage = async (user) => {
  try {
    const firstName = user.firstName;
    const addictions = user.addictions;
    const currentStreak = Math.max(...Object.values(user.currentStreaks || {}).filter(v => v !== null));
    const situation = 'onStreak';
    
    const addictionText = addictions.length === 2 
      ? "l'alcool et la cigarette" 
      : addictions.includes('alcohol') 
        ? "l'alcool" 
        : "la cigarette";

    // Calcul des économies
    const dailySavings = (addictions.includes('alcohol') ? 12 : 0) + (addictions.includes('cigarette') ? 8 : 0);
    const totalSavings = currentStreak * dailySavings;

    const prompt = `Tu es un expert en addictologie et coach de vie spécialisé dans la sobriété. Tu aides ${firstName} dans son parcours.

Contexte:
- Prénom: ${firstName}
- Addiction(s): ${addictionText}
- Streak actuel: ${currentStreak} jours
- Situation: ${situation}
- Économies: ${totalSavings}€

MISSION: Génère un message ULTRA-MOTIVANT et INFORMATIF qui inclut:

1. UN FAIT SCIENTIFIQUE précis sur les bénéfices santé à ${currentStreak} jours
2. UNE DONNÉE CHIFFRÉE impressionnante (économies, santé, statistiques)
3. UN ENCOURAGEMENT personnalisé avec le prénom
4. UNE ASTUCE PRATIQUE ou conseil pour continuer

STYLE:
- Ton expert mais accessible
- Données scientifiques vulgarisées
- Motivant et énergique
- 3-4 phrases maximum
- Utilise des emojis pertinents

EXEMPLES de QUALITÉ attendue:
"${firstName}, après ${currentStreak} jours sans ${addictionText}, ton foie a éliminé 85% des toxines accumulées ! 🧬 Tu as économisé ${totalSavings}€ et gagné l'équivalent de 2 semaines d'espérance de vie. Ton système immunitaire est 40% plus efficace qu'au jour 1. 💪 Astuce: bois un grand verre d'eau au réveil pour booster cette détox naturelle !"

Génère maintenant ton message expert:`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Erreur OpenAI:', error)
    
    // Message de fallback riche basé sur les données locales
    const { getRichMessageForDay } = await import('../utils/messages.js');
    const richMsg = getRichMessageForDay(currentStreak, situation, addictions, firstName);
    
    return `${richMsg.title}\n\n${richMsg.message}\n\n${richMsg.tip || '💪 Continue, tu es sur la bonne voie !'}`
  }
}
