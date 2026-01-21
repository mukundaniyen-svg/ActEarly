
import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { Play, CheckCircle, Info, ShieldCheck, ChevronRight, X, SkipForward, Armchair, ArrowUp, AlertCircle, Volume2, VolumeX, Sparkles, Target } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  stepIndex: number;
  totalSteps: number;
  onNext: (skipped: boolean, exercise: Exercise) => void;
  onClose: () => void; 
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  stepIndex, 
  totalSteps, 
  onNext, 
  onClose 
}) => {
  const duration = 60; 
  
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true); 
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // TTS Logic
  useEffect(() => {
    window.speechSynthesis.cancel();

    if (!isMuted && isActive) {
      const standingNote = exercise.isStandingRecommended ? "Standing is highly recommended for this stretch to reduce sitting time." : "";
      const text = `${exercise.name}. ${standingNote} ${exercise.instructions.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; 
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
      if (preferredVoice) utterance.voice = preferredVoice;

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [exercise, isMuted, isActive]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const isLastStep = stepIndex === totalSteps - 1;

  const handleFinish = () => {
    window.speechSynthesis.cancel();
    onNext(false, exercise);
  };

  const handleSkip = () => {
    window.speechSynthesis.cancel();
    onNext(true, exercise);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full h-full min-h-[500px] shadow-xl border border-slate-200 dark:border-slate-700 relative flex flex-col animate-fade-in overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500 rounded-full blur-[80px] opacity-10 dark:opacity-20 pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="relative z-10 p-6 pb-2 shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="inline-block w-fit px-3 py-1 bg-slate-100 dark:bg-slate-700 text-teal-700 dark:text-teal-400 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors">
               Step {stepIndex + 1} of {totalSteps}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
               <Target className="w-3 h-3" />
               <span className="text-[10px] font-extrabold uppercase tracking-widest">Focus: {exercise.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className={`rounded-full p-2 transition-all z-50 ${isMuted ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300' : 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20'}`}
              title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full p-2 transition-all z-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight transition-colors">{exercise.name}</h2>
          <div className="text-right shrink-0">
             <div className="text-3xl font-mono font-bold text-teal-600 dark:text-teal-400 transition-colors">
               {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
             </div>
             <span className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">Remaining</span>
          </div>
        </div>

        {/* Posture Recommendation */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${
             exercise.posture === 'Standing' 
               ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400' 
               : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-600 dark:text-indigo-400'
           }`}>
             {exercise.posture === 'Standing' ? <ArrowUp className="w-3 h-3" /> : <Armchair className="w-3 h-3" />}
             {exercise.posture === 'Standing' ? "Stand Up" : "Seated"}
           </div>

           {exercise.isStandingRecommended && (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-wide animate-pulse-slight shadow-sm">
               <Sparkles className="w-3 h-3" />
               Stand to Reset
             </div>
           )}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0 custom-scrollbar">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-slate-800 dark:text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-white dark:bg-slate-800 py-2 z-10 transition-colors">
              <Info className="w-4 h-4 text-teal-600 dark:text-teal-500" /> Instructions
            </h3>
            <ul className="space-y-3">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-teal-50/50 dark:bg-teal-900/20 border border-teal-500/10 rounded-xl p-4 transition-colors">
             <h3 className="text-teal-700 dark:text-teal-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2">
               <ShieldCheck className="w-4 h-4" /> Prevention Focus
             </h3>
             <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed italic">
               "{exercise.prevention}"
             </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-6 pt-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/50 relative z-20 transition-colors">
         <div className="w-full flex gap-3 mb-4">
             {timeLeft > 0 && (
               <>
                 {!isActive && timeLeft === duration && (
                   <button 
                     onClick={() => setIsActive(true)}
                     className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                   >
                     <Play className="w-5 h-5" /> Start Timer
                   </button>
                 )}
                 {isActive && (
                   <button 
                     onClick={() => setIsActive(false)}
                     className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold rounded-xl transition-all"
                   >
                     Pause
                   </button>
                 )}
                 {!isActive && timeLeft !== duration && (
                    <button 
                     onClick={() => setIsActive(true)}
                     className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-900 font-bold rounded-xl transition-all"
                   >
                     Resume
                   </button>
                 )}
                 <button 
                   onClick={handleSkip}
                   className="group relative px-4 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-xl transition-all flex items-center justify-center"
                   title="Skip to next"
                 >
                   <SkipForward className="w-5 h-5" />
                 </button>
               </>
             )}

             {timeLeft === 0 && (
               <button 
                 onClick={handleFinish}
                 className="w-full py-3 bg-green-600 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-400 text-white dark:text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 animate-pulse-slight"
               >
                 {isLastStep ? <><CheckCircle className="w-5 h-5" /> Finish Session</> : <>Next Exercise <ChevronRight className="w-5 h-5" /></>}
               </button>
             )}
         </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-green-400 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};
