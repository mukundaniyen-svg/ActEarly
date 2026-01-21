import React from 'react';

interface EdgeGlowProps {
  active: boolean;
}

export const EdgeGlow: React.FC<EdgeGlowProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 border-8 border-transparent animate-edge-glow">
      {/* This div creates the visual overlay. The actual animation is defined in index.html styles */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-teal-500/90 text-slate-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-teal-500/50 backdrop-blur-sm">
        TIME TO MOVE
      </div>
    </div>
  );
};