import React, { useState, useRef } from 'react';
import { AlertTriangle, Target, CheckCircle2, HeartPulse, Dumbbell, Sparkles } from 'lucide-react';
import { BodyPartHistory, Exercise } from '../types';
import { createPortal } from "react-dom";

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

const getSideTooltipStyle = (x: number, y: number) => {
  const TOOLTIP_WIDTH = 260;
  const OFFSET_X = 40;   // Increased to push it clearly to the right of the point
  const PADDING = 20;

  // We want the tooltip to appear to the RIGHT of the X coordinate
  return {
    left: x + OFFSET_X, 
    top: Math.min(
      Math.max(y - 100, PADDING), // Adjusted vertical centering
      window.innerHeight - 300
    ),
    position: 'fixed' as const,
    zIndex: 9999
  };
};

const BODY_DETAILS: Record<string, BodyDetail> = {
  'Eyes': { partDescription: "Ocular muscles & blinking reflex", impact: "Reduced blink rate causes dryness; fixed focal length leads to digital eye strain.", benefit: "Lubricates eyes and resets ciliary muscles to reduce fatigue." },
  'Neck': { partDescription: "Cervical Spine (C1-C7)", impact: "Forward head posture ('Tech Neck') increases effective head weight on spine.", benefit: "Realigns cervical curvature and reduces tension headaches." },
  'Shoulders': { partDescription: "Trapezius & Rotator Cuff", impact: "Internal rotation shortens pectorals and weakens upper back.", benefit: "Opens the chest cavity for better breathing." },
  'Back': { partDescription: "Thoracic & Lumbar Spine", impact: "Static loading compresses intervertebral discs.", benefit: "Decompresses the spine and stimulates nutrient-rich fluid flow." },
  'Elbows': { partDescription: "Ulnar Nerve & Flexors", impact: "Fixed flexion can compress the ulnar nerve.", benefit: "Releases nerve tension and restores full range of extension." },
  'Wrists': { partDescription: "Carpal Tunnel & Extensors", impact: "Extension while typing compresses the median nerve.", benefit: "Promotes nerve gliding and reduces risk of RSI." },
  'Hips': { partDescription: "Hip Flexors (Psoas)", impact: "Prolonged sitting shortens hip flexors, leading to lower back pain.", benefit: "Lengthens the psoas muscle and restores pelvic neutrality." },
  'Knees': { partDescription: "Patella & Popliteal", impact: "90-degree flexion restricts blood flow.", benefit: "Stimulates synovial fluid production to lubricate the joint." },
  'Ankles': { partDescription: "Talocrural Joint", impact: "Lack of movement causes fluid pooling in lower extremities.", benefit: "Activates the 'calf muscle pump' to return blood to the heart." }
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
  const hoverTimeout = useRef<number | null>(null);

  const handleHover = (point: BodyPoint | null) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setHoveredPoint(point), 40);
  };

  const getPointStatus = (category: string) => {
    const lastTime = history[category] || 0;
    const diffHours = (Date.now() - lastTime) / (1000 * 60 * 60);
    if (lastTime === 0) return { color: '#f59e0b', status: 'Needs Focus' }; 
    if (diffHours < 2) return { color: '#22c55e', status: 'Healthy' }; 
    if (diffHours < 4) return { color: '#f59e0b', status: 'Warning' }; 
    return { color: '#ef4444', status: 'Critical' }; 
  };

  return (
    <div className="relative flex flex-col items-center h-full w-full bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-300 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden p-6 pb-48">
      
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px'}}></div>

      <div className="absolute top-6 left-0 w-full text-center z-10 pointer-events-none">
        <h3 className="text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Target className="w-4 h-4" /> Body Map Analysis
        </h3>
      </div>

       <div className="absolute top-6 right-6 z-20 cursor-pointer group flex flex-col items-center" onClick={onLogHydration}>
           <svg width="24" height="60" viewBox="0 0 40 100" className="drop-shadow-md transition-transform group-hover:scale-110">
                <defs><clipPath id="bottleClip"><path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" /></clipPath></defs>
                <path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" fill="#334155" className="fill-slate-700 dark:fill-slate-600" opacity="0.2" />
                <rect x="0" y="0" width="40" height="100" fill="#0ea5e9" clipPath="url(#bottleClip)" transform={`translate(0, ${100 - (Math.min(hydrationCount, 10) * 10)})`} className="transition-transform duration-500 ease-out" />
                <path d="M10,0 L30,0 L30,20 L38,25 L38,92 C38,96 36,100 32,100 L8,100 C4,100 2,96 2,92 L2,25 L10,20 Z" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
           </svg>
       </div>

      <div className="body-map-svg-container relative z-0 flex-1 w-full flex items-center justify-center animate-fade-in my-4">  <svg viewBox="0 0 320 400" className="h-full w-auto max-h-[400px] overflow-visible">
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

            {BODY_POINTS.map((point) => {
                const status = getPointStatus(point.category);
                const isTargeted = currentExercise?.category === point.category;
                const isHovered = hoveredPoint?.id === point.id;
                return (
                    <g key={point.id} className="cursor-pointer group" onClick={() => onStartSession?.(point.category)} onMouseEnter={() => handleHover(point)} onMouseLeave={() => handleHover(null)}>
                        {isTargeted && <circle cx={point.x} cy={point.y} r="18" fill={status.color} opacity="0.3" className="animate-pulse" />}
                        <circle cx={point.x} cy={point.y} r="20" fill="transparent" />
                        <circle cx={point.x} cy={point.y} r={isHovered ? 8 : 5} fill={status.color} stroke="white" strokeWidth="1.5" className="transition-all duration-300 dark:stroke-slate-800" />
                    </g>
                );
            })}
        </svg>
      </div>

      {hoveredPoint && createPortal(
  (() => {
    // 1. Calculate status and data
    const lastTime = history[hoveredPoint.label] || 0;
    const isNeedsFocus = (Date.now() - lastTime) > (2 * 60 * 60 * 1000);
    const details = BODY_DETAILS[hoveredPoint.label] || { 
      partDescription: "Body Part", 
      impact: "Data unavailable", 
      benefit: "Keep moving" 
    };

    // 2. Get the screen position of the Body Map container
    const container = document.querySelector('.body-map-svg-container');
    const rect = container?.getBoundingClientRect();
    
    // 3. Calculate screen coordinates
    // We take the container's left edge + the point's X + a 40px gap to push it right
    const screenX = (rect?.left || 0) + (hoveredPoint.x * ((rect?.width || 0) / 320)) + 40;
    const screenY = (rect?.top || 0) + (hoveredPoint.y * ((rect?.height || 0) / 400)) - 60;

    return (
      <div 
        className="fixed z-[9999] pointer-events-none transition-all duration-200 ease-out"
        style={{ 
          left: screenX, 
          top: Math.max(20, Math.min(screenY, window.innerHeight - 300)) 
        }}
      >
        <div className="bg-slate-900/95 text-white rounded-xl shadow-2xl p-4 w-64 border border-slate-700 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-bold text-sm">{hoveredPoint.label}</div>
              <div className="text-xs text-slate-400">{details.partDescription}</div>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${isNeedsFocus ? "text-amber-400" : "text-emerald-400"}`}>
              <HeartPulse className="w-3 h-3" />
              {isNeedsFocus ? "Needs Focus" : "Healthy"}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase mb-1">
              <AlertTriangle className="w-3 h-3" /> Sedentary Impact
            </div>
            <p className="text-xs text-slate-300 leading-snug">{details.impact}</p>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase mb-1">
              <Sparkles className="w-3 h-3" /> ActEarly Benefit
            </div>
            <p className="text-xs text-slate-300 leading-snug">{details.benefit}</p>
          </div>
        </div>
      </div>
    );
  })(),
  document.getElementById("tooltip-root")!
)}

      <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
          <div className="px-6 py-4 bg-transparent">
              <button onClick={onStartFullBodySession} className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden">
                <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                <span>Full Body Reset (15 min)</span>
                <Dumbbell className="w-4 h-4 opacity-70" />
              </button>
          </div>
          <div className="bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 py-4 px-6 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Eye Level</div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Back Supported</div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Knees 90°</div>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Feet Flat</div>
              </div>
          </div>
      </div>
    </div>
  );
};