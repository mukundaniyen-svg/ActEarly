
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Exercise, WisdomTip, ALL_BODY_PARTS } from "../types";
import { EXERCISE_LIBRARY } from "./exerciseLibrary";

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

const exerciseListSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      durationSeconds: { type: Type.NUMBER },
      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
      benefits: { type: Type.STRING },
      prevention: { type: Type.STRING },
      category: { type: Type.STRING, enum: [...ALL_BODY_PARTS, "General"] },
      posture: { type: Type.STRING, enum: ["Seated", "Standing"] },
      isStandingRecommended: { type: Type.BOOLEAN },
      environmentCompatibility: { type: Type.STRING, enum: ["Office", "Home", "Both"] }
    },
    required: ["name", "durationSeconds", "instructions", "category", "posture", "environmentCompatibility"],
  },
};

export const generateHealthWisdom = async (customInstructions: string = ''): Promise<WisdomTip[]> => {
  const fallbacks: WisdomTip[] = [
    { category: 'Science', text: 'Sitting for 6+ hours drops leg blood flow by 50%.' },
    { category: 'Motivation', text: 'A 2-minute stretch resets your focus timer.' },
    { category: 'Benefit', text: 'Your Ergo Score protects long-term mobility.' },
    { category: 'Quote', text: 'Take rest; a field that has rested gives a bountiful crop.' },
    { category: 'Trivia', text: 'Blinking slows by 66% when looking at screens.' },
    { category: 'Science', text: 'Static posture is harder on the spine than movement.' },
    { category: 'Hack', text: 'Monitor at eye level reduces neck strain by 40%.' },
    { category: 'Quote', text: 'Motion is lotion for the joints.' }
  ];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const contextStr = customInstructions ? `User Context: "${customInstructions}".` : '';
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 10 desk health tips. ${contextStr}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: wisdomSchema,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as WisdomTip[];
    }
    return fallbacks;
  } catch (error) {
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
  excludeNames: string[] = [],
  customInstructions: string = ''
): Promise<Exercise[]> => {
  
  if (customInstructions.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Generate ${durationMinutes} micro-exercises (1m each). Needs: "${customInstructions}". Env: ${workEnvironment}. Exclude: ${excludeNames.join(",")}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: exerciseListSchema,
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 }
        },
      });

      if (response.text) {
        const generated = JSON.parse(response.text) as Exercise[];
        if (generated.length > 0) return generated;
      }
    } catch (error) {
      console.error("AI Generation failed, falling back to local library.");
    }
  }

  // FALLBACK: LOCAL LIBRARY LOGIC
  let filtered = EXERCISE_LIBRARY.filter(ex => 
    ex.environmentCompatibility === 'Both' || 
    ex.environmentCompatibility === workEnvironment
  );

  if (excludeNames.length > 0) {
    const freshOnes = filtered.filter(ex => !excludeNames.includes(ex.name));
    if (freshOnes.length >= durationMinutes) filtered = freshOnes;
  }

  const partsToFocus = [...(prioritizedBodyParts.length > 0 ? prioritizedBodyParts : ALL_BODY_PARTS)];

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
