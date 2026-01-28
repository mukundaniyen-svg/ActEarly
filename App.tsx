import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings as SettingsIcon,
  RefreshCw,
  Zap,
  Pause,
  Play,
  Building2,
  Home,
  BrainCircuit,
  Info
} from "lucide-react";

import {
  AppState,
  Exercise,
  Settings,
  BodyPartHistory,
  ExerciseLogEntry,
  ALL_BODY_PARTS,
} from "./types";

import { generateSession } from "./services/ai/aiClient";
// Corrected imports for your specific file structure
import { loadPreferences, savePreferences } from "./src/api/utils/preferencesStorage";
import { DEFAULT_PREFERENCES } from "./src/api/constants/defaultPreferences";

import { EdgeGlow } from "./components/EdgeGlow";
import { ExerciseCard } from "./components/ExerciseCard";
import { SettingsModal } from "./components/SettingsModal";
import { BodyMap } from "./components/BodyMap";
import { Celebration } from "./components/Celebration";
import { StatsPanel } from "./components/StatsPanel";

/* ------------------------------------------------------------------ */
/* LOGO                                                               */
/* ------------------------------------------------------------------ */

const ActEarlyLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`${className} text-teal-600 dark:text-teal-400`}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2 a10 10 0 0 1 10 10" />
    <path d="M12 2 v2" />
    <path d="M6 12h2l2-4 4 8 2-4h2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* APP                                                                */
/* ------------------------------------------------------------------ */

function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_PREFERENCES);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = loadPreferences();
    if (saved) setSettings(saved);
  }, []);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    savePreferences(newSettings);
  };

  // Session State
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const completedExercisesRef = useRef<Exercise[]>([]);
  
  // History & Tracking
  const [history, setHistory] = useState<BodyPartHistory>({});
  const [exerciseLog, setExerciseLog] = useState<ExerciseLogEntry[]>([]);
  const [hydrationTimestamps, setHydrationTimestamps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pendingSessionPromise, setPendingSessionPromise] = useState<Promise<any> | null>(null);

  // Timer Engine
  const [secondsUntilNext, setSecondsUntilNext] = useState(settings.intervalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (settings.theme === "Dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [settings.theme]);

  // Logic Helpers
  const getDailyHydration = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayLogs = hydrationTimestamps.filter(ts => ts >= startOfDay.getTime());
    return { count: todayLogs.length, lastTime: todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null };
  };

  const { count: hydrationCount, lastTime: lastHydrationTime } = getDailyHydration();

  const getExcludedExerciseNames = useCallback(() => {
    const fortyEightHoursAgo = Date.now() - (48 * 60 * 60 * 1000);
    return Array.from(new Set(exerciseLog.filter(e => e.timestamp > fortyEightHoursAgo).map(e => e.name)));
  }, [exerciseLog]);

  const getSmartPriorities = useCallback(() => {
    if (settings.prioritizedBodyParts?.length > 0) return settings.prioritizedBodyParts;
    return [...ALL_BODY_PARTS].sort((a, b) => (history[a] || 0) - (history[b] || 0));
  }, [settings.prioritizedBodyParts, history]);

  // Timer Tick
  const tick = useCallback(() => {
    if (appState !== AppState.IDLE || isPaused) {
      lastTickRef.current = Date.now();
      return;
    }
    const delta = (Date.now() - lastTickRef.current) / 1000;
    lastTickRef.current = Date.now();
    setSecondsUntilNext(prev => {
      if (prev - delta <= 0) {
        setAppState(AppState.NOTIFYING);
        if (settings.soundEnabled) new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
        return 0;
      }
      return prev - delta;
    });
  }, [appState, isPaused, settings.soundEnabled]);

  useEffect(() => {
    timerRef.current = window.setInterval(tick, 1000);
    return () => clearInterval(timerRef.current!);
  }, [tick]);

  const handleStartSession = async () => {
    completedExercisesRef.current = [];
    setAppState(AppState.FETCHING);
    try {
      const result = await generateSession(
        settings.sessionDurationMinutes || 3, 
        getSmartPriorities(), 
        settings.workEnvironment, 
        getExcludedExerciseNames(), 
        settings.customInstructions
      );
      setExerciseQueue(result.exercises);
      setCurrentExerciseIndex(0);
      setAppState(AppState.ACTIVE);
    } catch {
      setAppState(AppState.IDLE);
      setSecondsUntilNext(settings.intervalSeconds);
    }
  };

  const handleNextExercise = (skipped: boolean, exercise: Exercise) => {
    if (!skipped) completedExercisesRef.current.push(exercise);
    if (currentExerciseIndex < exerciseQueue.length - 1) {
      setCurrentExerciseIndex(p => p + 1);
    } else {
      const now = Date.now();
      const newHistory = { ...history };
      completedExercisesRef.current.forEach(ex => { newHistory[ex.category] = now; });
      setHistory(newHistory);
      setExerciseLog(prev => [...prev, ...completedExercisesRef.current.map(ex => ({ 
        name: ex.name, 
        category: ex.category, 
        timestamp: now 
      }))]);
      setAppState(AppState.IDLE);
      setSecondsUntilNext(settings.intervalSeconds);
    }
  };

  /* -------------------- UI: TIMER CARD -------------------- */

  const renderTimerCard = () => {
    const totalSeconds = settings.intervalSeconds;
    const effectiveMax = Math.max(totalSeconds, secondsUntilNext);
    const progressPercentage = ((effectiveMax - secondsUntilNext) / effectiveMax) * 100;
    const isLessThanMinute = secondsUntilNext < 60;
    const isFocusMode = secondsUntilNext > totalSeconds + 60;

    return (
      <div className="flex flex-col items-center justify-between p-6 bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm h-full shadow-lg relative overflow-hidden">
        {/* Environment Toggle Section */}
        <div className="w-full flex flex-col items-center mb-6">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
            WHERE ARE YOU WORKING?
          </span>
          <div className="flex p-1 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-700 w-full max-w-[260px] shadow-inner">
            <button 
              onClick={() => setSettings(s => ({...s, workEnvironment: 'Office'}))} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                settings.workEnvironment === 'Office' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Office
            </button>
            <button 
              onClick={() => setSettings(s => ({...s, workEnvironment: 'Home'}))} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                settings.workEnvironment === 'Home' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-teal-600/80 dark:text-teal-400/80">
            {settings.workEnvironment === 'Office' ? "Discrete movements • Seated focus" : "Full range of motion • Freedom to move"}
          </p>
        </div>

        {/* Circular Timer Display */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="110" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="transparent"/>
            <circle 
              cx="128" cy="128" r="110" 
              stroke={isPaused ? "#94a3b8" : (isFocusMode ? "#6366f1" : "#14b8a6")} 
              strokeWidth="10" 
              fill="transparent" 
              strokeDasharray={691} 
              strokeDashoffset={691 * (1 - progressPercentage / 100)} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-linear" 
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">
              {isLessThanMinute ? Math.ceil(secondsUntilNext) : Math.ceil(secondsUntilNext / 60)}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
              MINUTES
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-600 mt-2 font-medium">Until next break</span>
          </div>
          <button onClick={() => setIsPaused(!isPaused)} className="absolute bottom-0 right-4 p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform">
            {isPaused ? <Play className="w-6 h-6 fill-current text-slate-400" /> : <Pause className="w-6 h-6 fill-current text-teal-600" />}
          </button>
        </div>

        {/* Timer Titles */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Smart Break Timer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">Focus deep. We'll prompt the reset.</p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4 w-full">
          <button onClick={() => setSecondsUntilNext(3600)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-extrabold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all">
            <BrainCircuit className="w-4 h-4" /> FOCUS (60M)
          </button>
          
          <button 
            onClick={() => setSecondsUntilNext(2)} 
            className="text-[10px] font-bold text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500 uppercase tracking-widest transition-colors mb-2"
          >
            Dev: Skip to end
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <EdgeGlow active={settings.glowEnabled && appState === AppState.NOTIFYING} />
      <Celebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

      {/* Header */}
      <div className="w-full p-6 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <ActEarlyLogo className="w-7 h-7" />
          <span className="font-bold text-xl tracking-tight">ActEarly</span>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Main Grid: items-stretch ensures equal height columns */}
      <main className="flex-1 w-full max-w-[95rem] mx-auto px-4 pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[650px]">
            {/* Column 1: Timer/Notifications */}
            <div className="h-full">
               {appState === AppState.IDLE && renderTimerCard()}
               {appState === AppState.NOTIFYING && (
                 <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-8 rounded-3xl text-center h-full border border-teal-100 shadow-xl">
                    <Zap className="w-16 h-16 text-teal-500 mb-6 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-3">Time to Refresh</h2>
                    <p className="text-slate-500 mb-8 text-sm">Your focus session is complete.<br/>Time for a quick movement break.</p>
                    <button onClick={handleStartSession} className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95">Start Session</button>
                    <div className="flex gap-3 w-full mt-4">
                      <button onClick={() => { setAppState(AppState.IDLE); setSecondsUntilNext(300); }} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium">Snooze 5m</button>
                      <button onClick={() => { setAppState(AppState.IDLE); setSecondsUntilNext(settings.intervalSeconds); }} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium">Dismiss</button>
                    </div>
                 </div>
               )}
               {appState === AppState.FETCHING && (
                 <div className="flex flex-col items-center justify-center h-full bg-white/40 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300">
                    <RefreshCw className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                    <p className="font-medium animate-pulse">Personalizing your session...</p>
                 </div>
               )}
               {appState === AppState.ACTIVE && exerciseQueue.length > 0 && (
                 <ExerciseCard 
                    exercise={exerciseQueue[currentExerciseIndex]} 
                    stepIndex={currentExerciseIndex}
                    totalSteps={exerciseQueue.length}
                    onNext={handleNextExercise} 
                    onClose={() => setAppState(AppState.IDLE)} 
                 />
               )}
            </div>
            
            {/* Column 2: Body Analysis */}
            <div className="h-full">
               <BodyMap 
                 history={history} 
                 hydrationCount={hydrationCount}
                 lastHydrationTime={lastHydrationTime}
                 onLogHydration={() => setHydrationTimestamps(p => [...p, Date.now()])}
                 onStartSession={async (cat) => {
                    setAppState(AppState.FETCHING);
                    const res = await generateSession(3, [cat], settings.workEnvironment, getExcludedExerciseNames());
                    setExerciseQueue(res.exercises);
                    setCurrentExerciseIndex(0);
                    setAppState(AppState.ACTIVE);
                 }}
               />
            </div>

            {/* Column 3: Wellness Stats & Wisdom (Horizontal line removed) */}
            <div className="h-full flex flex-col gap-6">
               <div className="flex-1 bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm">
                  {/* Seamless Header - removed border-b */}
                  <div className="p-4 pb-0 flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">WELLNESS STATS & WISDOM</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <StatsPanel history={history} exerciseLog={exerciseLog} />
                  </div>
               </div>
            </div>
         </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSave={handleSaveSettings} />
    </div>
  );
}

export default App;