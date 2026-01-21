
import React, { useEffect, useState, useMemo } from 'react';
import { BodyPartHistory, ExerciseLogEntry, ALL_BODY_PARTS, WisdomTip } from '../types';
import { generateHealthWisdom } from '../services/geminiService';
import { Trophy, TrendingUp, AlertCircle, Quote, Brain, Lightbulb, Zap, Activity, ChevronLeft, ChevronRight, Heart, Dumbbell, Flame } from 'lucide-react';

interface StatsPanelProps {
  history: BodyPartHistory;
  exerciseLog: ExerciseLogEntry[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ history, exerciseLog }) => {
  const [tips, setTips] = useState<WisdomTip[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);
  
  // Carousel State
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // --- Metrics Calculation ---

  // 1. Ergo Score (0-100)
  const ergoScore = useMemo(() => {
    const now = Date.now();
    let greenCount = 0;
    ALL_BODY_PARTS.forEach(part => {
      const lastTime = history[part] || 0;
      if (lastTime > 0) {
        const diffHours = (now - lastTime) / (1000 * 60 * 60);
        if (diffHours < 2) greenCount++;
      }
    });
    return Math.round((greenCount / ALL_BODY_PARTS.length) * 100);
  }, [history]);

  // 2. Active Minutes (Total)
  const activeMinutes = exerciseLog.length;

  // 3. Today's Reps
  const todaysReps = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    return exerciseLog.filter(e => e.timestamp >= startOfDay.getTime()).length;
  }, [exerciseLog]);

  // 4. Current Streak (Consecutive Days)
  const streakDays = useMemo(() => {
    if (exerciseLog.length === 0) return 0;
    
    // Get unique dates YYYY-MM-DD
    const uniqueDays: string[] = (Array.from(new Set(
        exerciseLog.map(e => new Date(e.timestamp).toISOString().split('T')[0])
    )) as string[]).sort().reverse();

    if (uniqueDays.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    
    // If most recent is not today or yesterday, streak is broken
    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

    let streak = 1;
    let current = new Date(uniqueDays[0]);
    
    for (let i = 1; i < uniqueDays.length; i++) {
        const prev = new Date(uniqueDays[i]);
        // Calculate difference in days (ignoring time)
        const diffTime = Math.abs(current.getTime() - prev.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
            streak++;
            current = prev;
        } else {
            break;
        }
    }
    return streak;
  }, [exerciseLog]);

  // 5. Neglected Body Part
  const mostNeglected = useMemo(() => {
    let oldestTime = Date.now();
    let neglected = 'None';
    
    const neverDone = ALL_BODY_PARTS.find(p => !history[p]);
    if (neverDone) return neverDone;

    ALL_BODY_PARTS.forEach(part => {
      const time = history[part] || 0;
      if (time < oldestTime) {
        oldestTime = time;
        neglected = part;
      }
    });
    return neglected;
  }, [history]);

  useEffect(() => {
    let mounted = true;
    const fetchTips = async () => {
      const data = await generateHealthWisdom();
      if (mounted) {
        setTips(data);
        setLoadingTips(false);
      }
    };
    fetchTips();
    return () => { mounted = false; };
  }, []);

  // --- Auto Advance Logic ---
  useEffect(() => {
    if (loadingTips || tips.length === 0 || isHovering) return;

    const intervalId = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 20000); // 20 seconds

    return () => clearInterval(intervalId);
  }, [loadingTips, tips.length, isHovering]);

  const handleNext = () => {
    if (tips.length === 0) return;
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    if (tips.length === 0) return;
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const getCardStyle = (cat: WisdomTip['category']) => {
    // Pastel Logic:
    // 1. Use the lightest shade (-50) and reduce opacity to 50% for very subtle tint.
    // 2. Use a thinner border (-2) with reduced opacity.
    // 3. Use slightly softer icon colors (-400).
    switch(cat) {
      case 'Science':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          borderClass: 'border-l-2 border-rose-300',
          textClass: 'font-bold text-slate-700 dark:text-slate-200',
          bgHighlight: 'bg-rose-50/50 dark:bg-rose-500/5'
        };
      case 'Motivation':
        return {
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
          borderClass: 'border-l-2 border-amber-300',
          textClass: 'font-bold text-slate-700 dark:text-slate-200',
          bgHighlight: 'bg-amber-50/50 dark:bg-amber-500/5'
        };
      case 'Benefit':
        return {
          icon: <Heart className="w-5 h-5 text-pink-400" />,
          borderClass: 'border-l-2 border-pink-300',
          textClass: 'font-medium text-slate-700 dark:text-slate-200',
          bgHighlight: 'bg-pink-50/50 dark:bg-pink-500/5'
        };
      case 'Hack':
        return {
          icon: <Zap className="w-5 h-5 text-sky-400" />,
          borderClass: 'border-l-2 border-sky-300',
          textClass: 'font-medium text-slate-700 dark:text-slate-200',
          bgHighlight: 'bg-sky-50/50 dark:bg-sky-500/5'
        };
      case 'Quote':
        return {
          icon: <Quote className="w-5 h-5 text-teal-400" />,
          borderClass: 'border-l-2 border-teal-300',
          textClass: 'italic font-serif text-lg text-slate-600 dark:text-slate-300',
          bgHighlight: 'bg-teal-50/50 dark:bg-teal-500/5'
        };
      case 'Trivia':
        return {
          icon: <Brain className="w-5 h-5 text-indigo-400" />,
          borderClass: 'border-l-2 border-indigo-300',
          textClass: 'font-medium text-slate-700 dark:text-slate-200',
          bgHighlight: 'bg-indigo-50/50 dark:bg-indigo-500/5'
        };
      default:
        return {
          icon: <Lightbulb className="w-5 h-5 text-slate-400" />,
          borderClass: 'border-l-2 border-slate-300',
          textClass: 'text-slate-600',
          bgHighlight: 'bg-slate-50/50'
        };
    }
  };

  const currentTip = tips[currentTipIndex];
  const cardStyle = currentTip ? getCardStyle(currentTip.category) : null;

  const scoreColor = ergoScore > 80 ? 'text-green-500' : ergoScore > 50 ? 'text-yellow-500' : 'text-red-500';
  const scoreStroke = ergoScore > 80 ? '#22c55e' : ergoScore > 50 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col h-full bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-lg dark:shadow-none transition-colors duration-300 overflow-hidden relative">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[50px] pointer-events-none"></div>

      {/* --- Header --- */}
      <div className="p-5 pb-0 shrink-0">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Wellness Stats
        </h2>
      </div>

      {/* --- KPI Section --- */}
      <div className="px-5 py-3 flex gap-4 shrink-0 h-48"> 
        
        {/* Left: Ergo Score */}
        <div className="w-5/12 bg-white dark:bg-slate-800/80 rounded-2xl p-2 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center relative">
          <div className="w-full aspect-square max-w-[120px] max-h-[120px] relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-700" />
              <circle 
                cx="40" cy="40" r="36" 
                stroke={scoreStroke} strokeWidth="6" fill="transparent" 
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 * (1 - ergoScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${scoreColor}`}>{ergoScore}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400 mt-2 tracking-wide text-center">Ergo Score</span>
        </div>

        {/* Right: Metrics Stack (Now with 4 items for 5 total KPIs) */}
        <div className="flex-1 flex flex-col gap-2 h-full justify-between">
          
          {/* Item 1: Time */}
          <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-xl px-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between min-h-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Total Active</span>
              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">
                {activeMinutes}<span className="text-[10px] text-slate-400 ml-0.5">m</span>
              </span>
            </div>
            <Activity className="w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* Item 2: Streak (NEW) */}
          <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-xl px-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between min-h-0">
             <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Day Streak</span>
              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">
                {streakDays}<span className="text-[10px] text-slate-400 ml-0.5">d</span>
              </span>
            </div>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>

          {/* Item 3: Today's Reps */}
           <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-xl px-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between min-h-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Today's Reps</span>
              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 leading-none">
                {todaysReps}
              </span>
            </div>
            <Dumbbell className="w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* Item 4: Focus */}
          <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-xl px-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between min-h-0">
            <div className="flex flex-col max-w-[80%]">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Needs Focus</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none truncate" title={mostNeglected}>
                {mostNeglected}
              </span>
            </div>
            <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
          </div>

        </div>
      </div>

      {/* --- Wisdom Feed (Carousel) --- */}
      <div className="flex-1 px-5 py-4 flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-2 tracking-widest flex items-center gap-2">
          <Lightbulb className="w-3 h-3" /> Daily Wisdom
        </h3>
        
        <div 
          className="relative group w-full flex-1 min-h-[140px]" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {loadingTips ? (
            <div className="h-full bg-slate-200 dark:bg-slate-700/50 rounded-xl animate-pulse w-full"></div>
          ) : tips.length > 0 && cardStyle ? (
            <>
               {/* Left Arrow */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 text-slate-400 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Previous tip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Right Arrow */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 text-slate-400 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Next tip"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Content Card */}
              <div className="relative w-full h-full overflow-hidden">
                <div 
                    key={currentTipIndex}
                    className={`h-full w-full bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center animate-fade-in select-none relative overflow-hidden ${cardStyle.borderClass} ${cardStyle.bgHighlight}`}
                >
                    {/* Watermark Icon - subtle background */}
                    <div className="absolute top-2 right-2 opacity-5 pointer-events-none transform scale-150">
                        {cardStyle.icon}
                    </div>

                    {/* Active small icon top-left */}
                    <div className="absolute top-4 left-4">
                        {cardStyle.icon}
                    </div>

                    <div className="pl-10 pr-2 flex-1 flex items-center">
                        <p className={`text-sm leading-relaxed ${cardStyle.textClass}`}>
                           {currentTip.text}
                        </p>
                    </div>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 left-0 w-full flex gap-1.5 justify-center">
                        {tips.map((_, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setCurrentTipIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentTipIndex ? 'w-4 bg-slate-400 dark:bg-slate-400' : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`} 
                        />
                        ))}
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-800/30 rounded-xl">
               Wisdom unavailable offline
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
