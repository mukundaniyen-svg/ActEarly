
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Settings as SettingsIcon, HeartPulse, RefreshCw, Zap, Pause, Play, Info, Building2, Home, BrainCircuit, Activity, Timer as TimerIcon } from 'lucide-react';
import { AppState, Exercise, Settings, BodyPartHistory, ExerciseLogEntry, ALL_BODY_PARTS } from './types';
import { generateSession } from './services/ai/aiClient';
import { EdgeGlow } from './components/EdgeGlow';
import { ExerciseCard } from './components/ExerciseCard';
import { SettingsModal } from './components/SettingsModal';
import { BodyMap } from './components/BodyMap';
import { Celebration } from './components/Celebration';
import { StatsPanel } from './components/StatsPanel';

// Custom Brand Logo: Fitness + Time + Health
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
    {/* Timer/Clock Ring */}
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2 a10 10 0 0 1 10 10" className="opacity-100" />
    <path d="M12 2 v2" />
    {/* Activity/Pulse Line */}
    <path 
      d="M6 12h2l2-4 4 8 2-4h2" 
      strokeDasharray="40"
      className="animate-[pulse-line_3s_ease-in-out_infinite]"
    />
    <style>{`
      @keyframes pulse-line {
        0% { stroke-dashoffset: 40; }
        50% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -40; }
      }
    `}</style>
  </svg>
);

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  // Exercise Session State
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Track which exercises were completed (not skipped) during current session for batch update
  const completedExercisesRef = useRef<Exercise[]>([]);

  // History State
  const [history, setHistory] = useState<BodyPartHistory>({});
  const [exerciseLog, setExerciseLog] = useState<ExerciseLogEntry[]>([]);

  // Hydration State
  const [hydrationTimestamps, setHydrationTimestamps] = useState<number[]>([]);

  // Celebration State
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebrationTime, setLastCelebrationTime] = useState<number>(0);

  // Pre-fetching state
  const [pendingSessionPromise, setPendingSessionPromise] = useState<Promise<Exercise[]> | null>(null);

  // Settings
  const [settings, setSettings] = useState<Settings>({ 
    intervalSeconds: 25 * 60, 
    soundEnabled: false, 
    glowEnabled: true, 
    sessionDurationMinutes: 5, 
    prioritizedBodyParts: [],
    workEnvironment: 'Office',
    theme: 'Light',
    customInstructions: ''
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Timer State
  const [secondsUntilNext, setSecondsUntilNext] = useState(settings.intervalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // --- Theme Effect ---
  useEffect(() => {
    if (settings.theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // --- Derived Data ---
  
  const getDailyHydration = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayTs = startOfDay.getTime();
    
    const todayLogs = hydrationTimestamps.filter(ts => ts >= todayTs);
    return {
      count: todayLogs.length,
      lastTime: todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null
    };
  };

  const { count: hydrationCount, lastTime: lastHydrationTime } = getDailyHydration();

  // --- Celebration Check ---
  useEffect(() => {
    const now = Date.now();
    const isHealthy = (part: string) => {
      const lastTime = history[part] || 0;
      if (lastTime === 0) return false;
      const diffHours = (now - lastTime) / (1000 * 60 * 60);
      return diffHours < 2;
    };

    const allGreen = ALL_BODY_PARTS.every(part => isHealthy(part));
    const COOLDOWN_MS = 4 * 60 * 60 * 1000; 
    const canCelebrate = lastCelebrationTime === 0 || (now - lastCelebrationTime > COOLDOWN_MS);

    if (allGreen && canCelebrate && !showCelebration) {
      setShowCelebration(true);
      setLastCelebrationTime(now);
    }
  }, [history, lastCelebrationTime, showCelebration]);


  const getExcludedExerciseNames = useCallback(() => {
    const now = Date.now();
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
    const recentNames = exerciseLog
      .filter(entry => entry.timestamp > fortyEightHoursAgo)
      .map(entry => entry.name);
    return Array.from(new Set(recentNames));
  }, [exerciseLog]);

  const getSmartPriorities = useCallback(() => {
    if (settings.prioritizedBodyParts && settings.prioritizedBodyParts.length > 0) {
      return settings.prioritizedBodyParts;
    }
    return [...ALL_BODY_PARTS].sort((a, b) => {
      const timeA = history[a] || 0;
      const timeB = history[b] || 0;
      return timeA - timeB;
    });
  }, [settings.prioritizedBodyParts, history]);

  // --- Timer Logic ---
  useEffect(() => {
    setSecondsUntilNext(prev => {
       const newMax = settings.intervalSeconds;
       if (prev > newMax && prev > (120 * 60)) return prev; 
       return prev > newMax ? newMax : prev;
    });
  }, [settings.intervalSeconds]);

  const triggerSessionGeneration = useCallback(() => {
    const excludes = getExcludedExerciseNames();
    const priorities = getSmartPriorities();
    
    const promise = generateSession(
      settings.sessionDurationMinutes || 3, 
      priorities,
      settings.workEnvironment,
      excludes,
      settings.customInstructions 
    );
    setPendingSessionPromise(promise);
  }, [settings.sessionDurationMinutes, settings.workEnvironment, settings.customInstructions, getExcludedExerciseNames, getSmartPriorities]);

  useEffect(() => {
    // Increased pre-fetch window to 30s to hide API latency
    if (
      appState === AppState.IDLE && 
      !isPaused && 
      secondsUntilNext <= 30 && 
      !pendingSessionPromise
    ) {
      triggerSessionGeneration();
    }
  }, [secondsUntilNext, appState, isPaused, pendingSessionPromise, triggerSessionGeneration]);


  const tick = useCallback(() => {
    if (appState !== AppState.IDLE || isPaused) {
        lastTickRef.current = Date.now(); 
        return;
    }

    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    setSecondsUntilNext((prev) => {
      const next = prev - delta;
      if (next <= 0) {
        setAppState(AppState.NOTIFYING);
        if (settings.soundEnabled) {
          try {
             const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
             audio.volume = 0.2; 
             audio.play().catch(e => console.log('Audio autoplay blocked'));
          } catch(e) {}
        }
        return 0;
      }
      return next;
    });
  }, [appState, settings.soundEnabled, isPaused]);

  useEffect(() => {
    lastTickRef.current = Date.now();
    timerRef.current = window.setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tick]);

  // --- Handlers ---

  const handleStartSession = async () => {
    completedExercisesRef.current = [];
    
    // Check if we already have the session ready from pre-fetch
    if (pendingSessionPromise) {
      setAppState(AppState.FETCHING);
      try {
        const exercises = await pendingSessionPromise;
        setExerciseQueue(exercises);
        setCurrentExerciseIndex(0);
        setAppState(AppState.ACTIVE);
        setPendingSessionPromise(null);
        return;
      } catch (e) {
        setPendingSessionPromise(null);
      }
    }

    // Otherwise, generate it now
    setAppState(AppState.FETCHING);
    try {
      const excludes = getExcludedExerciseNames();
      const priorities = getSmartPriorities();
      const exercises = await generateSession(
          settings.sessionDurationMinutes || 3, 
          priorities,
          settings.workEnvironment,
          excludes,
          settings.customInstructions
      );
      setExerciseQueue(exercises);
      setCurrentExerciseIndex(0);
      setAppState(AppState.ACTIVE);
    } catch (error) {
      console.error("Failed to load session", error);
      setAppState(AppState.IDLE);
      setSecondsUntilNext(settings.intervalSeconds);
    }
  };

  const handleQuickPartSession = async (category: string) => {
    completedExercisesRef.current = [];
    setAppState(AppState.FETCHING);
    try {
      const excludes = getExcludedExerciseNames();
      const exercises = await generateSession(
        settings.sessionDurationMinutes || 3,
        [category], 
        settings.workEnvironment,
        excludes,
        settings.customInstructions
      );
      setExerciseQueue(exercises);
      setCurrentExerciseIndex(0);
      setAppState(AppState.ACTIVE);
    } catch (e) {
      console.error("Quick session failed", e);
      setAppState(AppState.IDLE);
    }
  };

  const handleFullBodySession = async () => {
    completedExercisesRef.current = [];
    setAppState(AppState.FETCHING);
    try {
      const excludes = getExcludedExerciseNames();
      const exercises = await generateSession(
        30,
        [...ALL_BODY_PARTS], 
        settings.workEnvironment,
        excludes
      );
      setExerciseQueue(exercises);
      setCurrentExerciseIndex(0);
      setAppState(AppState.ACTIVE);
    } catch (e) {
      console.error("Full body session failed", e);
      setAppState(AppState.IDLE);
    }
  };

  const handleNextExercise = (skipped: boolean, exercise: Exercise) => {
    if (!skipped) {
      completedExercisesRef.current.push(exercise);
    }

    if (currentExerciseIndex < exerciseQueue.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleCompleteSession();
    }
  };

  const handleCompleteSession = () => {
    const now = Date.now();
    const newHistory = { ...history };
    completedExercisesRef.current.forEach(ex => {
      newHistory[ex.category] = now;
    });
    setHistory(newHistory);

    const newEntries: ExerciseLogEntry[] = completedExercisesRef.current.map(ex => ({
      name: ex.name,
      category: ex.category,
      timestamp: now
    }));
    setExerciseLog(prev => [...prev, ...newEntries]);

    setAppState(AppState.IDLE);
    setSecondsUntilNext(settings.intervalSeconds);
    setExerciseQueue([]);
    setCurrentExerciseIndex(0);
    setPendingSessionPromise(null);
  };

  const handleSnooze = () => {
    setAppState(AppState.IDLE);
    setSecondsUntilNext(5 * 60);
    setPendingSessionPromise(null);
  };

  const handleDismiss = () => {
    setAppState(AppState.IDLE);
    setSecondsUntilNext(settings.intervalSeconds);
    setPendingSessionPromise(null);
  };

  const togglePause = () => {
      setIsPaused(!isPaused);
  };

  const setEnvironment = (env: 'Office' | 'Home') => {
    setSettings(prev => ({ ...prev, workEnvironment: env }));
  };

  const activateFocusMode = () => {
    setSecondsUntilNext(60 * 60); 
  };

  const handleLogHydration = () => {
    setHydrationTimestamps(prev => [...prev, Date.now()]);
  };

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const handleDevCompleteAll = () => {
    const now = Date.now();
    const newHistory = { ...history };
    const newLog = [...exerciseLog];

    ALL_BODY_PARTS.forEach(part => {
      newHistory[part] = now;
      newLog.push({ 
        name: 'Dev Simulation', 
        category: part, 
        timestamp: now 
      });
    });

    setHistory(newHistory);
    setExerciseLog(newLog);
    setLastCelebrationTime(0);
    setShowCelebration(false);
  };

  // --- Sub-Components (Card Views) ---

  const renderNotifyingCard = () => {
    const timeText = settings.intervalSeconds < 60 ? "a few seconds" : `${Math.floor(settings.intervalSeconds / 60)} minutes`;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 dark:bg-slate-800/80 rounded-3xl border border-teal-200 dark:border-teal-700/50 p-6 shadow-xl backdrop-blur-sm animate-fade-in text-center z-10">
        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50 animate-pulse mb-6">
          <Zap className="w-8 h-8 text-white dark:text-slate-900" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Time to Refresh</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm text-sm">
          You've been sedentary for {timeText}.<br/>Time to activate your body.
        </p>
        
        <button onClick={handleStartSession} className="w-full max-w-sm py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 mb-4 transition-all hover:scale-105">
           Start Session ({settings.sessionDurationMinutes || 3} min)
        </button>
        
        <div className="flex gap-3 w-full max-w-sm">
           <button onClick={handleSnooze} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">
             Snooze 5m
           </button>
           <button onClick={handleDismiss} className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium">
             Dismiss
           </button>
        </div>
      </div>
    );
  };

  const renderFetchingCard = () => (
     <div className="w-full h-full flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 backdrop-blur-sm animate-fade-in z-10">
        <RefreshCw className="w-12 h-12 text-teal-600 dark:text-teal-500 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 animate-pulse font-medium">Preparing your personalized session...</p>
     </div>
  );

  const totalSeconds = settings.intervalSeconds;
  const effectiveMax = Math.max(totalSeconds, secondsUntilNext);
  const progressPercentage = ((effectiveMax - secondsUntilNext) / effectiveMax) * 100;
  const isLessThanMinute = secondsUntilNext < 60;
  const isFocusMode = secondsUntilNext > totalSeconds + 60;
  const displayValue = isLessThanMinute ? Math.ceil(secondsUntilNext) : Math.ceil(secondsUntilNext / 60);
  const displayUnit = isLessThanMinute ? 'Seconds' : 'Minutes';

  const renderTimerCard = () => (
    <div className="flex flex-col items-center justify-between p-6 bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm relative h-full min-h-[500px] shadow-lg dark:shadow-none transition-colors duration-300 overflow-hidden">
        <div className="w-full flex flex-col items-center justify-center mb-6 relative group">
          <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Where are you working?
              </span>
          </div>
          <div className="relative flex p-1 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-700 w-full max-w-[260px] shadow-inner">
            <button 
              onClick={() => setEnvironment('Office')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 relative z-10 ${
                settings.workEnvironment === 'Office' 
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/10' 
                  : 'text-slate-500 dark:text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${settings.workEnvironment === 'Office' ? 'scale-110' : 'opacity-70'}`} />
              Office
            </button>
            <button 
              onClick={() => setEnvironment('Home')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 relative z-10 ${
                settings.workEnvironment === 'Home' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/10' 
                  : 'text-slate-500 dark:text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${settings.workEnvironment === 'Home' ? 'scale-110' : 'opacity-70'}`} />
              Home
            </button>
          </div>
          <div className="mt-2.5 h-5 flex items-center justify-center px-4">
              <p className={`text-[10px] font-medium transition-all duration-300 text-center ${
                settings.workEnvironment === 'Office' ? 'text-teal-600/70 dark:text-teal-400/70' : 'text-indigo-500/70 dark:text-indigo-400/70'
              }`}>
                  {settings.workEnvironment === 'Office' 
                      ? "Discrete movements • Seated focus" 
                      : "Full range of motion • Freedom to move"}
              </p>
          </div>
        </div>

        <div className="relative w-56 h-56 p-2 flex items-center justify-center mb-4 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="110" className="stroke-slate-200 dark:stroke-slate-800 transition-colors duration-300" strokeWidth="12" fill="transparent"/>
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke={isPaused ? "#64748b" : (isFocusMode ? "#6366f1" : "#14b8a6")} 
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercentage / 100)}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isPaused ? (
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-slate-400 mb-2">PAUSED</span>
                </div>
            ) : (
                <>
                    <span className={`text-4xl font-mono font-bold transition-colors duration-300 ${isFocusMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {displayValue}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{displayUnit}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-600 mt-4">Until next break</span>
                </>
            )}
          </div>
          <button 
            onClick={togglePause}
            className={`absolute bottom-0 right-0 transform translate-y-2 -translate-x-2 bg-white dark:bg-slate-800 border p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-lg z-10 ${isFocusMode ? 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-500' : 'border-slate-200 dark:border-slate-600 text-teal-600 dark:text-teal-500'}`}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>
        </div>
        
        <div className="text-center max-w-xs mb-6 px-4">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
            {isPaused ? "Timer Paused" : (isFocusMode ? "Deep Work Mode" : "Smart Break Timer")}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed italic">
            {isPaused ? "Take your time. Resume when ready." : (isFocusMode ? "Focus on your craft. We'll watch the clock and guide your next reset." : "Focus deep. We'll prompt the reset.")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full mt-auto">
            {!isPaused && !isFocusMode && (
            <button 
                onClick={activateFocusMode}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wide transition-all border border-indigo-100 dark:border-indigo-500/30"
            >
                <BrainCircuit className="w-4 h-4" /> Focus (60m)
            </button>
            )}
            {!isPaused && isFocusMode && (
            <button 
                onClick={() => setSecondsUntilNext(settings.intervalSeconds)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
            >
                Cancel Focus
            </button>
            )}
            {!isPaused && (
                <button onClick={() => setSecondsUntilNext(2)} className="text-[10px] text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500 transition-colors">
                Dev: Skip to end
                </button>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 selection:bg-teal-500/30 overflow-x-hidden transition-colors duration-500">
      <EdgeGlow active={settings.glowEnabled && appState === AppState.NOTIFYING} />
      <Celebration show={showCelebration} onComplete={handleCelebrationComplete} />

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <ActEarlyLogo className="w-7 h-7" />
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white transition-colors">ActEarly</span>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      <main className="w-full max-w-[90rem] px-4 flex flex-col justify-center min-h-screen py-12">
         <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">
            <div className="order-2 lg:order-1 h-full min-h-[500px]">
               {appState === AppState.IDLE && renderTimerCard()}
               {appState === AppState.NOTIFYING && renderNotifyingCard()}
               {appState === AppState.FETCHING && renderFetchingCard()}
               {appState === AppState.ACTIVE && exerciseQueue.length > 0 && (
                   <div className="h-full w-full">
                       <ExerciseCard 
                          key={currentExerciseIndex} 
                          exercise={exerciseQueue[currentExerciseIndex]} 
                          stepIndex={currentExerciseIndex}
                          totalSteps={exerciseQueue.length}
                          onNext={handleNextExercise} 
                          onClose={handleDismiss} 
                       />
                   </div>
               )}
            </div>
            <div className="flex flex-col h-full relative z-10 min-h-[500px] order-1 lg:order-2">
               <BodyMap 
                 history={history} 
                 onStartSession={handleQuickPartSession}
                 onStartFullBodySession={handleFullBodySession}
                 hydrationCount={hydrationCount}
                 lastHydrationTime={lastHydrationTime}
                 onLogHydration={handleLogHydration}
                 currentExercise={appState === AppState.ACTIVE && exerciseQueue.length > 0 ? exerciseQueue[currentExerciseIndex] : null}
               />
            </div>
            <div className="order-3 h-full min-h-[500px] lg:order-3">
               <StatsPanel history={history} exerciseLog={exerciseLog} />
            </div>
         </div>
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
        onDevCompleteAll={handleDevCompleteAll}
      />
    </div>
  );
};

export default App;
