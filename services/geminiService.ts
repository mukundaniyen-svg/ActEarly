
console.log(
  "GEMINI KEY AT RUNTIME:",
  import.meta.env.VITE_GEMINI_API_KEY
);


import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Exercise, WisdomTip, ALL_BODY_PARTS } from "../types";
import { EXERCISE_LIBRARY } from "./exerciseLibrary";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('❌ CRITICAL: Gemini API key is not set. Set VITE_GEMINI_API_KEY in your .env.local file.');
}

const ai = new GoogleGenAI({ apiKey });

const wisdomSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: ['Science', 'Motivation', 'Hack', 'Quote', 'Trivia', 'Benefit'],
      },
      text: {
        type: Type.STRING,
      },
    },
    required: ["category", "text"],
  },
};

export const generateHealthWisdom = async (): Promise<WisdomTip[]> => {
  const fallbacks: WisdomTip[] = [
    { category: 'Science', text: 'Sitting for 6+ hours drops leg blood flow by 50%.' },
    { category: 'Motivation', text: 'A 2-minute stretch resets your focus timer.' },
    { category: 'Benefit', text: 'Your Ergo Score is protecting your long-term mobility.' },
    { category: 'Quote', text: 'Take rest; a field that has rested gives a bountiful crop.' },
    { category: 'Trivia', text: 'Blinking slows by 66% when looking at screens.' },
    { category: 'Science', text: 'Static posture is harder on the spine than movement.' },
    { category: 'Hack', text: 'Place your monitor at eye level to reduce neck strain by 40%.' },
    { category: 'Quote', text: 'Motion is lotion for the joints.' }
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 10 diverse desk worker health tips in categories Science, Motivation, Hack, Quote, Trivia, Benefit.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: wisdomSchema,
        temperature: 0.85,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as WisdomTip[];
    }
    return fallbacks;
  } catch (error) {
    console.error("Gemini Wisdom Error (using fallbacks):", error);
    return fallbacks;
  }
};

/**
 * Smart Local Session Generator
 * Picks exercises from the library based on user context.
 */
export const generateSession = async (
  durationMinutes: number = 3, 
  prioritizedBodyParts: string[] = [],
  workEnvironment: 'Office' | 'Home' = 'Office',
  excludeNames: string[] = []
): Promise<Exercise[]> => {
  // Simulate a very short "thinking" delay for UI feedback consistency
  await new Promise(resolve => setTimeout(resolve, 400));

  // 1. Filter library by environment compatibility
  let filtered = EXERCISE_LIBRARY.filter(ex => 
    ex.environmentCompatibility === 'Both' || 
    ex.environmentCompatibility === workEnvironment
  );

  // 2. Filter out recently done exercises
  if (excludeNames.length > 0) {
    const freshOnes = filtered.filter(ex => !excludeNames.includes(ex.name));
    if (freshOnes.length >= durationMinutes) {
      filtered = freshOnes;
    }
  }

  // 3. Selection Logic
  const session: Exercise[] = [];
  const partsToFocus = prioritizedBodyParts.length > 0 ? prioritizedBodyParts : [...ALL_BODY_PARTS];
  const shuffledParts = [...partsToFocus].sort(() => Math.random() - 0.5);

  // 4. standing requirement logic for Office
  let standingCount = 0;
  const minStanding = durationMinutes >= 3 ? 2 : 1;

  let currentPartIndex = 0;
  while (session.length < durationMinutes) {
    const targetPart = shuffledParts[currentPartIndex % shuffledParts.length];
    
    // Find candidates for this part
    let candidates = filtered.filter(ex => 
      ex.category.toLowerCase() === targetPart.toLowerCase() &&
      !session.find(s => s.name === ex.name)
    );

    // If we need more standing options, prioritize those candidates
    if (standingCount < minStanding) {
        const standingCandidates = candidates.filter(ex => ex.isStandingRecommended || ex.posture === 'Standing');
        if (standingCandidates.length > 0) {
            candidates = standingCandidates;
        }
    }

    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      session.push(picked);
      if (picked.isStandingRecommended || picked.posture === 'Standing') standingCount++;
    }

    currentPartIndex++;
    if (currentPartIndex > 200) break;
  }

  // Final fill if needed
  if (session.length < durationMinutes) {
    const remainingCount = durationMinutes - session.length;
    const moreCandidates = filtered.filter(ex => !session.find(s => s.name === ex.name));
    const randomAdditions = moreCandidates.sort(() => Math.random() - 0.5).slice(0, remainingCount);
    session.push(...randomAdditions);
  }

  // Sort logically (Top-Down)
  const categoryOrder = [...ALL_BODY_PARTS];
  session.sort((a, b) => {
    return categoryOrder.indexOf(a.category as any) - categoryOrder.indexOf(b.category as any);
  });

  return session;
};
