// story-config.js

const name = 'John’s Reflective Journey';

/**
 * A large bank of potential questions for the AI to incorporate into responses.
 * Used when the AI is not presenting a scenario.
 */
const questionBank = [
  "How does remembering that moment make you feel, John?",
  "Would you do anything differently if you had another chance?",
  "Do you think this situation still influences your decisions?",
  "How might this affect your future relationships?",
  "What personal challenge do you see here?",
  "Is there a lesson you’ve already taken from this?",
  "Is this path aligned with your hopes or your fears?",
  "Are you willing to risk failure to grow?",
  "Do you think acknowledging your father's efforts helps you move on?",
  "Do you sense any guilt or relief about this scenario?",
  "Is there a part of you that craves a fresh start?",
  "How might you balance your own needs with your father's legacy?",
  "Are you feeling more hopeful or anxious now?",
  "Does this spark a desire to reach out to relatives you argued with?",
  "Do you think your father would be proud of your decisions so far?",

  // BELOW ARE NEW LINES WE ADDED, INTEGRATING BACKSTORY DIRECTLY
  "Your father never talked much about his struggles, but there were times he seemed distant and worried. Does that affect how you handle stress?",
  "Despite closing the store, your father left a note expressing pride in you, hoping you'd find a path he never could. How do you feel about his words?",
  "A financial advisor recently contacted you regarding debts your father left behind. Does that add to your sense of responsibility?",
  "Looking back, do you wish your father had been more open about the store’s challenges, so you could've prepared better?",
  "Is it difficult to reconcile your father's hidden debts with the pride and love he had for you?"
];

/**
 * A pool of 15 short scenarios referencing John's background, each ending with a question.
 * The AI must use these in a random interval of 3–7 user responses, never repeating a scenario.
 */
const scenarioPool = [
  // Greedy-flavored
  "You stumble upon old financial records hinting at secret savings your father had. Do you quietly keep it for yourself, or share it with family?",
  "A wealthy neighbor offers to buy any relics from the store. Are you tempted to sell them all for quick cash?",
  "You hear rumors that your father took out hidden loans. Someone suggests forging documents to wipe part of that debt. Would you consider it?",

  // Aggressive-flavored
  "Your uncle accuses you of mismanaging the store’s closure. How do you respond, John?",
  "An old friend at the store claims you left them in the dark about financial troubles. Do you confront them or seek peace?",
  "During a tense conversation, a relative blames you entirely for the store’s downfall. Do you fight back or back off?",

  // Extraversion-flavored
  "A local business forum asks you to share your story publicly to inspire others. Are you eager to speak or reluctant?",
  "Friends want to plan a tribute event for your father at the now-closed store location. Do you join as an organizer?",
  "You're invited to host a small community gathering to discuss local business lessons learned. Are you comfortable in the spotlight?",

  // Agreeableness-flavored
  "A neighbor struggling to afford groceries asks if you have leftover stock from the store. Do you help them?",
  "Your aunt begs you to help mediate a dispute over who inherits the store’s remaining assets. Are you willing to intervene?",
  "Someone close to your father approaches you for emotional support, blaming themselves for his debts. Do you console them wholeheartedly?",

  // Neuroticism-flavored
  "Late at night, you recall ignoring the signs of your father’s deteriorating health. Does regret keep you awake?",
  "Debt collectors keep calling, stirring anxiety about your father's legacy. Do you shut them out or try to negotiate head-on?",
  "You discover an old journal of your father's expressing hopes you'd continue the store. Guilt weighs on you. How do you process it?"
];

const instructions = `
You are Dr. Morgan, helping John navigate the aftermath of his father’s store closure. 
Unveil fragments of John's past in your responses (mention father’s health, hidden debts, or emotional struggles).
Proceed through 4 scenes in 8–15 user turns:

1) Opening: Introduce Dr. Morgan, mention father and the store's closure. Invite John to share.
2) Crisis: Present at least one scenario referencing John’s regrets or moral dilemma.
3) Confrontation: Let John respond, revealing more of himself. Keep unveiling backstory bits.
4) Ending: Propose a final job after analyzing the top 3 personality categories. Also ask if John would change anything if he could go back. If yes, produce an offer letter; if not, politely end.

Mechanics remain:
- After each user message, choose exactly one category (never random).
- Always pose at least one question per response (scenario or from questionBank).
- Every 3–7 user messages, present exactly one scenario from scenarioPool. 
- In the end, combine top two categories' descriptors with a job from the third.

Never reveal numeric scores or categories. Keep your responses empathetic and relatively short.
`;

const openingLine = `
Hello, John. I'm Dr. Morgan. I understand you've been carrying heavy burdens since your father passed and the store closed and left you without a job. Let's take this step by step.
`;

const firstCallToAction = `
What’s been weighing on your mind the most about your own future, John?
`;

export const storyConfig = {
  name,
  instructions,
  openingLine,
  firstCallToAction,
  questionBank,
  scenarioPool
};
