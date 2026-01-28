import { Settings } from "../types";

const STORAGE_KEY = "actearly_preferences_v1";

export function savePreferences(prefs: Settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(prefs)
    );
  } catch (err) {
    console.error("Failed to save preferences", err);
  }
}

export function loadPreferences(): Settings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Settings;
  } catch (err) {
    console.error("Failed to load preferences", err);
    return null;
  }
}
