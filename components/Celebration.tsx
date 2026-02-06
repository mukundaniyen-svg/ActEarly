import React, { useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ show, onComplete }) => {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onComplete(); // ⬅️ this unmounts banner + confetti
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  // ✅ SINGLE SOURCE OF TRUTH
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex justify-center">
      {/* Banner */}
      <div className="absolute top-8 bg-white dark:bg-slate-800 border border-teal-400/50 rounded-xl px-6 py-4 shadow-2xl animate-slide-down">
        <h3 className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          All Systems Green!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Great job taking care of your body.
        </p>
      </div>

      {/* Confetti */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-2 h-2 rounded-full bg-teal-400 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`
          }}
        />
      ))}

      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }

        @keyframes confetti {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100vh); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
};
