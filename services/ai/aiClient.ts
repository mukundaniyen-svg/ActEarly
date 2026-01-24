import { Exercise, WisdomTip, ALL_BODY_PARTS } from "../../types";
import { EXERCISE_LIBRARY } from "../exerciseLibrary";
import { callAI } from "../../src/api/backendClient";

// ============================================================================
// FALLBACK DATA
// ============================================================================

const FALLBACK_WISDOM: WisdomTip[] = [
  { category: 'Science', text: 'Sitting for 6+ hours drops leg blood flow by 50%.' },
  { category: 'Motivation', text: 'A 2-minute stretch resets your focus timer.' },
  { category: 'Benefit', text: 'Your Ergo Score protects long-term mobility.' },
  { category: 'Quote', text: 'Take rest; a field that has rested gives a bountiful crop.' },
  { category: 'Trivia', text: 'Blinking slows by 66% when looking at screens.' },
  { category: 'Science', text: 'Static posture is harder on the spine than movement.' },
  { category: 'Hack', text: 'Monitor at eye level reduces neck strain by 40%.' },
  { category: 'Quote', text: 'Motion is lotion for the joints.' }
];

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Generate health wisdom tips via backend AI.
 * Falls back to hardcoded tips if API unavailable.
 * Returns both tips and AI availability status.
 */
export const generateHealthWisdom = async (customInstructions: string = ''): Promise<{ tips: WisdomTip[], aiAvailable: boolean }> => {
  try {
    const contextStr = customInstructions ? `User Context: "${customInstructions}".` : '';
    const prompt = `Generate 10 desk health tips. ${contextStr}`;
    
    const result = await callAI('health_wisdom', { prompt });
    
    if (result.data?.text) {
      const responseText = result.data.text.trim();
      const aiAvailable = !responseText.includes('AI temporarily unavailable');
      
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        try {
          const tips = JSON.parse(responseText) as WisdomTip[];
          return { tips, aiAvailable };
        } catch (parseError) {
          // If JSON parse fails, treat as unavailable and fall through
        }
      }
      
      return { tips: FALLBACK_WISDOM, aiAvailable: false };
    }
    return { tips: FALLBACK_WISDOM, aiAvailable: true };
  } catch (error) {
    console.warn('Health wisdom generation failed, using fallbacks:', error);
    return { tips: FALLBACK_WISDOM, aiAvailable: true };
  }
};

/**
 * Generate a personalized exercise session via backend AI.
 * Uses custom instructions if provided, otherwise falls back to local library selection logic.
 * Returns both exercises and AI availability status.
 */
export const generateSession = async (
  durationMinutes: number = 3,
  prioritizedBodyParts: string[] = [],
  workEnvironment: 'Office' | 'Home' = 'Office',
  excludeNames: string[] = [],
  customInstructions: string = ''
): Promise<{ exercises: Exercise[], aiAvailable: boolean }> => {
  // Try AI generation if custom instructions are provided
  if (customInstructions.trim().length > 0) {
    try {
      const prompt = `Generate ${durationMinutes} unique micro-exercises (60 seconds each). 
User Instructions: "${customInstructions}". 
Environment: ${workEnvironment}. 
Do NOT generate exercises from: ${excludeNames.length > 0 ? excludeNames.join(", ") : "none"}.
Return exercises that directly address the user's specific needs.`;

      console.log('Generating customized exercises with prompt:', prompt);
      
      const result = await callAI('generate_session', { prompt });

      if (result.data?.text) {
        const responseText = result.data.text.trim();
        const aiAvailable = !responseText.includes('AI temporarily unavailable');
        
        if (responseText.startsWith('{') || responseText.startsWith('[')) {
          try {
            const generated = JSON.parse(responseText) as Exercise[];
            console.log('Generated exercises:', generated);
            if (generated.length > 0) {
              console.log(`Successfully generated ${generated.length} customized exercises`);
              return { exercises: generated, aiAvailable };
            }
          } catch (parseError) {
            // If JSON parse fails, treat as unavailable and fall through
          }
        }
        
        return { exercises: generateLocalSession(durationMinutes, prioritizedBodyParts, workEnvironment, excludeNames), aiAvailable: false };
      }
    } catch (error) {
      console.error("AI Generation failed, falling back to local library:", error);
      // Return fallback with AI marked as unavailable when custom instructions were provided
      return { exercises: generateLocalSession(durationMinutes, prioritizedBodyParts, workEnvironment, excludeNames), aiAvailable: false };
    }
  }

  // FALLBACK: LOCAL LIBRARY SELECTION LOGIC
  return { exercises: generateLocalSession(durationMinutes, prioritizedBodyParts, workEnvironment, excludeNames), aiAvailable: true };
};

// ============================================================================
// PRIVATE HELPER FUNCTIONS
// ============================================================================

/**
 * Local session generation without AI.
 * Picks exercises from EXERCISE_LIBRARY based on user preferences.
 */
const generateLocalSession = (
  durationMinutes: number,
  prioritizedBodyParts: string[],
  workEnvironment: 'Office' | 'Home',
  excludeNames: string[]
): Exercise[] => {
  let filtered = EXERCISE_LIBRARY.filter(ex =>
    ex.environmentCompatibility === 'Both' ||
    ex.environmentCompatibility === workEnvironment
  );

  if (excludeNames.length > 0) {
    const freshOnes = filtered.filter(ex => !excludeNames.includes(ex.name));
    if (freshOnes.length >= durationMinutes) filtered = freshOnes;
  }

  const partsToFocus = [...(prioritizedBodyParts.length > 0 ? prioritizedBodyParts : ALL_BODY_PARTS)];
  const session: Exercise[] = [];
  const shuffledParts = [...partsToFocus].sort(() => Math.random() - 0.5);

  let standingCount = 0;
  const minStanding = durationMinutes >= 3 ? 2 : 1;

  let currentPartIndex = 0;
  while (session.length < durationMinutes) {
    const targetPart = shuffledParts[currentPartIndex % shuffledParts.length];

    let candidates = filtered.filter(ex =>
      ex.category.toLowerCase() === targetPart.toLowerCase() &&
      !session.find(s => s.name === ex.name)
    );

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
