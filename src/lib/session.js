// Generate a unique session ID
export const createSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Store session ID in memory (optional helper)
let currentSessionId = null;

export const startSession = () => {
  currentSessionId = createSessionId();
  return currentSessionId;
};

export const getCurrentSessionId = () => {
  return currentSessionId;
};

export const clearSession = () => {
  currentSessionId = null;
};