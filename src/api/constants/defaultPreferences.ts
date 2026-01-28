import { Settings } from "../types";

export const DEFAULT_PREFERENCES: Settings = {
  customNotes: "",
  intensity: "medium",
  posture: "any",
  intervalSeconds: 25 * 60,
  soundEnabled: false,
  glowEnabled: true,
  sessionDurationMinutes: 5, 
  prioritizedBodyParts: [],
  workEnvironment: 'Office',
  theme: 'Light',
  customInstructions: "",
};
