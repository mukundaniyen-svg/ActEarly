import { getCurrentSessionId, startSession, clearSession } from "../lib/session";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "../lib/firebase";

export const useExerciseAnalytics = () => {
  const ensureSession = async () => {
    let sessionId = getCurrentSessionId();

    if (!sessionId) {
      const analytics = await getFirebaseAnalytics();
      sessionId = startSession();

      logEvent(analytics, "exercise_session_start", {
        session_id: sessionId,
      });

      console.log("🔥 SESSION START", sessionId);
    }

    return sessionId;
  };

  const trackExerciseStart = async (exercise) => {
    const analytics = await getFirebaseAnalytics();
    const sessionId = await ensureSession();

    logEvent(analytics, "exercise_started", {
      session_id: sessionId,
      exercise_name: exercise.name,
    });

    console.log("▶️ EXERCISE START", exercise.name, sessionId);
  };

  const trackExerciseComplete = async (exercise) => {
    const analytics = await getFirebaseAnalytics();
    const sessionId = getCurrentSessionId();

    if (!sessionId) return;

    logEvent(analytics, "exercise_completed", {
      session_id: sessionId,
      exercise_name: exercise.name,
    });

    console.log("✅ EXERCISE COMPLETE", exercise.name, sessionId);
  };

  const trackSessionComplete = async () => {
    const analytics = await getFirebaseAnalytics();
    const sessionId = getCurrentSessionId();

    if (!sessionId) return;

    logEvent(analytics, "exercise_session_completed", {
      session_id: sessionId,
    });

    console.log("🏁 SESSION COMPLETE", sessionId);

    clearSession();
  };

  return {
    trackExerciseStart,
    trackExerciseComplete,
    trackSessionComplete,
  };
};