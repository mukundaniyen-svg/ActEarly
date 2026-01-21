
export interface Exercise {
  name: string;
  durationSeconds: number;
  instructions: string[];
  benefits: string; // General benefits
  prevention: string; // Specific medical prevention
  category: 'Neck' | 'Back' | 'Wrists' | 'Hips' | 'Knees' | 'Ankles' | 'Shoulders' | 'Elbows' | 'Eyes' | 'General';
  posture: 'Seated' | 'Standing';
  isStandingRecommended?: boolean; // New flag for office-friendly standing options
  equipment?: string; 
  environmentCompatibility: 'Office' | 'Home' | 'Both';
}

export interface Settings {
  intervalSeconds: number;
  soundEnabled: boolean;
  glowEnabled: boolean; 
  sessionDurationMinutes: number; 
  prioritizedBodyParts: string[]; 
  workEnvironment: 'Office' | 'Home'; 
  theme: 'Dark' | 'Light'; 
}

export enum AppState {
  IDLE = 'IDLE',          
  NOTIFYING = 'NOTIFYING', 
  FETCHING = 'FETCHING',   
  ACTIVE = 'ACTIVE',      
}

export interface WisdomTip {
  category: 'Science' | 'Motivation' | 'Hack' | 'Quote' | 'Trivia' | 'Benefit';
  text: string;
}

export type BodyPartHistory = Record<string, number>;

export interface ExerciseLogEntry {
  name: string;
  category: string;
  timestamp: number;
}

export const ALL_BODY_PARTS = [
  'Eyes',
  'Neck', 
  'Shoulders', 
  'Elbows', 
  'Wrists',
  'Back', 
  'Hips', 
  'Knees', 
  'Ankles'
] as const;

export type BodyPart = typeof ALL_BODY_PARTS[number];
