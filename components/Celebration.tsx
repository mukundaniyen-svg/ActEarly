
import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, X } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<number[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsExiting(false);
      // Generate static list of particles to animate
      setParticles(Array.from({ length: 60 }, (_, i) => i));
      
      // Start exit animation slightly before the total duration ends (3s total)
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 2400); // Trigger exit at 2.4s

      // Complete callback
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 3000); // Fully remove at 3.0s

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setParticles([]);
      setIsExiting(false);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden flex justify-center">
      {/* Banner */}
      <div className={`absolute top-8 z-[10001] max-w-lg w-[90%] pointer-events-auto ${isExiting ? 'animate-slide-up-fade' : 'animate-slide-down'}`}>
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-teal-400/50 shadow-[0_0_30px_rgba(45,212,191,0.3)] rounded-2xl p-4 flex items-center gap-4 text-center md:text-left relative pr-10">
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors z-50 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="hidden md:flex w-12 h-12 bg-teal-100 dark:bg-teal-500/20 rounded-full items-center justify-center shrink-0 animate-bounce-slight">
            <Trophy className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-teal-700 dark:text-teal-400 font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4" /> All Systems Green!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-1">
              "Caring for your health is the sign of a wise mind."
            </p>
          </div>
        </div>
      </div>

      {/* Confetti Particles */}
      {particles.map((i) => {
        const left = Math.random() * 100;
        const animDelay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const colorClass = [
          'bg-teal-400', 'bg-yellow-400', 'bg-purple-400', 'bg-blue-400', 'bg-red-400'
        ][Math.floor(Math.random() * 5)];
        
        return (
          <div
            key={i}
            className={`absolute top-[-20px] w-2 h-2 rounded-full ${colorClass} opacity-80`}
            style={{
              left: `${left}%`,
              animation: `fall ${duration}s linear ${animDelay}s forwards`
            }}
          />
        );
      })}

      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-150%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up-fade {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-150%); opacity: 0; }
        }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-slide-down {
          animation: slide-down 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};
