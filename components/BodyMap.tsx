
import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Activity, Dumbbell, Sparkles } from 'lucide-react';
import { BodyPartHistory, Exercise } from '../types';

interface BodyPoint {
  id: string;
  category: string;
  x: number;
  y: number;
  label: string;
}

interface BodyDetail {
  impact: string;
  benefit: string;
  partDescription: string;
}

interface BodyMapProps {
  history?: BodyPartHistory;
  onStartSession?: (category: string) => void;
  onStartFullBodySession?: () => void;
  hydrationCount?: number;
  lastHydrationTime?: number | null;
  onLogHydration?: () => void;
  currentExercise?: Exercise | null;
}

// Coordinates mapped to the Schematic 90-90-90 Seated Figure
const BODY_POINTS: BodyPoint[] = [
  { id: 'eyes', category: 'Eyes', x: 152, y: 65, label: 'Eyes' }, 
  { id: 'neck', category: 'Neck', x: 135, y: 100, label: 'Neck' },
  { id: 'shoulders', category: 'Shoulders', x: 135, y: 125, label: 'Shoulders' },
  { id: 'back', category: 'Back', x: 135, y: 190, label: 'Back' }, 
  { id: 'elbows', category: 'Elbows', x: 175, y: 195, label: 'Elbows' },
  { id: 'wrists', category: 'Wrists', x: 235, y: 195, label: 'Wrists' },
  { id: 'hips', category: 'Hips', x: 135, y: 260, label: 'Hips' },
  { id: 'knees', category: 'Knees', x: 255, y: 260, label: 'Knees' },
  { id: 'ankles', category: 'Ankles', x: 255, y: 380, label: 'Ankles' },
];

const BODY_DETAILS: Record<string, BodyDetail> = {
  'Eyes': {
    partDescription: "Ocular muscles & blinking reflex",
    impact: "Reduced blink rate causes dryness; fixed focal length leads to digital eye strain.",
    benefit: "Lubricates eyes and resets ciliary muscles to reduce fatigue."
  },
  'Neck': {
    partDescription: "Cervical Spine (C1-C7)",
    impact: "Forward head posture ('Tech Neck') increases effective head weight on spine by up to 400%.",
    benefit: "Realigns cervical curvature and reduces tension headaches."
  },
  'Shoulders': {
    partDescription: "Trapezius & Rotator Cuff",
    impact: "Internal rotation (slouching) shortens pectorals and weakens upper back (Upper Cross Syndrome).",
    benefit: "Opens the chest cavity for better breathing and corrects posture."
  },
  'Back': {
    partDescription: "Thoracic & Lumbar Spine",
    impact: "Static loading compresses intervertebral discs and reduces nutrient exchange.",
    benefit: "Decompresses the spine and stimulates nutrient-rich fluid flow to discs."
  },
  'Elbows': {
    partDescription: "Ulnar Nerve & Flexors",
    impact: "Fixed flexion can compress the ulnar nerve (Cubital Tunnel).",
    benefit: "Releases nerve tension and restores full range of extension."
  },
  'Wrists': {
    partDescription: "Carpal Tunnel & Extensors",
    impact: "Extension while typing compresses the median nerve and strains tendons.",
    benefit: "Promotes nerve gliding and reduces risk of repetitive strain injury (RSI)."
  },
  'Hips': {
    partDescription: "Hip Flexors (Psoas)",
    impact: "Prolonged sitting shortens hip flexors, leading to anterior pelvic tilt and lower back pain.",
    benefit: "Lengthens the psoas muscle and restores pelvic neutrality."
  },
  'Knees': {
    partDescription: "Patella & Popliteal",
    impact: "90-degree flexion restricts blood flow and can cause patellar tracking issues.",
    benefit: "Stimulates synovial fluid production to lubricate the joint."
  },
  'Ankles': {
    partDescription: "Talocrural Joint",
    impact: "Lack of movement causes fluid pooling (edema) in lower extremities.",
    benefit: "Activates the 'calf muscle pump' to return venous blood to the heart."
  }
};

export const BodyMap: React.FC<BodyMapProps> = ({ 
  history = {}, 
  onStartSession,
  onStartFullBodySession,
  hydrationCount = 0,
  onLogHydration,
  currentExercise
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<BodyPoint | null>(null);

  const getPointStatus = (category: string) => {
    const lastTime = history[category] || 0;
    const now = Date.now();
    if (lastTime === 0) return { color: '#f59e0b', status: 'Needs Focus', desc: 'No recent activity recorded.' }; 
    const diffHours = (now - lastTime) / (1000 * 60 * 60);
    
    if (diffHours < 2) return { color: '#22c55e', status: 'Healthy', desc: 'Active within last 2 hours.' }; 
    if (diffHours < 4) return { color: '#f59e0b', status: 'Warning', desc: 'Inactive for > 2 hours.' }; 
    return { color: '#ef4444', status: 'Critical', desc: 'Inactive for > 4 hours.' }; 
  };

  return (
    <div className="relative flex flex-col items-center h-full w-full bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-300 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden transition-all duration-500 p-6 pb-48">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Header Label */}
      <div className="absolute top-6 left-0 w-full text-center z-10 pointer-events-none">
        <h3 className="text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Target className="w-4 h-4" /> Body Map Analysis
        </h3>
      </div>

       {/* Water Bottle Tracker (Top Right) */}
       <div 
         className="absolute top-6 right-6 z-20 cursor-pointer group flex flex-col items-center" 
         onClick={onLogHydration}
       >
           <svg width="24" height="60" viewBox="0 0 40 100" className="drop-shadow-md transition-transform group-hover:scale-110">
                <defs>
                   <clipPath id="bottleClip">
                      <path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" />
                   </clipPath>
                </defs>
                <path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" 
                      fill="#334155" className="fill-slate-700 dark:fill-slate-600" opacity="0.2" />
                <rect x="0" y="0" width="40" height="100" 
                      fill="#0ea5e9" 
                      clipPath="url(#bottleClip)"
                      transform={`translate(0, ${100 - (Math.min(hydrationCount, 10) * 10)})`} 
                      className="transition-transform duration-500 ease-out"
                />
                <path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" 
                      fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
           </svg>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
             +
           </div>
       </div>

      {/* The Map SVG Container */}
      <div className="relative z-0 flex-1 w-full flex items-center justify-center animate-fade-in my-4">
        <svg viewBox="0 0 320 400" className="h-full w-auto max-h-[400px] overflow-visible">
            {/* --- Environment Schematic --- */}
            <path d="M135,130 L135,260" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.5" />
            <path d="M100,260 L135,260" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.5" />
            <path d="M135,260 L135,420" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.5" />

            {/* --- Mannequin Shapes --- */}
            <g fill="rgba(148, 163, 184, 0.15)" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-slate-400">
               <circle cx="135" cy="65" r="28" />
               <rect x="127" y="85" width="16" height="25" />
               <path d="M 110 110 L 160 110 L 155 260 L 115 260 Z" />
               <rect x="125" y="242" width="140" height="36" rx="4" />
               <rect x="241" y="260" width="28" height="120" rx="4" />
               <path d="M241,375 L285,375 L285,395 L241,395 Z" />
               <path d="M125,130 L145,130 L185,195 L165,195 Z" />
               <rect x="165" y="185" width="80" height="20" rx="2" />
            </g>

            {/* --- Internal Skeleton --- */}
            <g stroke="#64748b" strokeWidth="2" fill="none" className="dark:stroke-slate-500" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                <line x1="135" y1="90" x2="135" y2="260" />
                <line x1="135" y1="260" x2="255" y2="260" />
                <line x1="255" y1="260" x2="255" y2="380" />
                <line x1="255" y1="380" x2="285" y2="380" />
                <polyline points="135,130 175,195 235,195" />
            </g>
            
            {/* --- Interactive Joints --- */}
            {BODY_POINTS.map((point) => {
                const status = getPointStatus(point.category);
                const isTargeted = currentExercise?.category === point.category;
                const isHovered = hoveredPoint?.id === point.id;

                return (
                    <g 
                        key={point.id} 
                        className="cursor-pointer group"
                        onClick={() => onStartSession && onStartSession(point.category)}
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        {isTargeted && (
                           <circle cx={point.x} cy={point.y} r="18" fill={status.color} opacity="0.3" className="animate-pulse" />
                        )}
                        <circle cx={point.x} cy={point.y} r="20" fill="transparent" />
                        <circle 
                            cx={point.x} cy={point.y} r={isHovered ? 8 : 5}
                            fill={status.color} 
                            stroke="white" 
                            strokeWidth="1.5"
                            className="shadow-sm transition-all duration-300 dark:stroke-slate-800"
                        />
                    </g>
                );
            })}
        </svg>
      </div>

      {/* --- Tooltip (Moved out of constrained parent to ensure visibility above footer) --- */}
      {hoveredPoint && (
        <div 
          className="absolute z-50 w-64 bg-slate-900/95 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md border border-slate-700 animate-fade-in-up pointer-events-none"
          style={{
            // Position relative to the main BodyMap container
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
            <div>
               <h4 className="font-bold text-lg leading-none">{hoveredPoint.label}</h4>
               <span className="text-[10px] text-slate-400 font-medium">{BODY_DETAILS[hoveredPoint.label]?.partDescription}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getPointStatus(hoveredPoint.category).color }}>
              {getPointStatus(hoveredPoint.category).status}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 mb-0.5">
                <AlertCircle className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase text-rose-400">Impact</span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">{BODY_DETAILS[hoveredPoint.label]?.impact}</p>
            </div>
            <div>
               <div className="flex items-center gap-1.5 text-teal-400 mb-0.5">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase text-teal-400">Benefit</span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">{BODY_DETAILS[hoveredPoint.label]?.benefit}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Unified Footer (Fixed at bottom) --- */}
      <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
          {/* Full Body Session Button Section */}
          <div className="px-6 py-4 bg-transparent">
              <button 
                onClick={onStartFullBodySession}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                <span>Full Body Reset (15 min)</span>
                <Dumbbell className="w-4 h-4 opacity-70" />
              </button>
          </div>

          {/* Posture Checklist Section */}
          <div className="bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 py-4 px-6 backdrop-blur-md">
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] text-center mb-1">Ergonomic Posture Check</span>
                 <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Eye Level
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Back Supported
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Knees 90°
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Feet Flat
                    </div>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};
