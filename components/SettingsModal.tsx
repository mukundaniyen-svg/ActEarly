
import React from 'react';
import { Settings as SettingsType } from '../types';
import { X, Clock, Bell, Zap, Timer, CheckCircle2, Circle, Sun, Moon, Code, Building2, Home, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onSave: (newSettings: SettingsType) => void;
  onDevCompleteAll?: () => void;
}

const AVAILABLE_BODY_PARTS = ['Eyes', 'Neck', 'Shoulders', 'Back', 'Elbows', 'Wrists', 'Hips', 'Knees', 'Ankles'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onDevCompleteAll }) => {
  if (!isOpen) return null;

  const displayMinutes = Math.floor(settings.intervalSeconds / 60);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      onSave({ ...settings, intervalSeconds: val * 60 });
    }
  };

  const setToTestMode = () => {
    onSave({ ...settings, intervalSeconds: 5 });
  };

  const handleSessionDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onSave({ ...settings, sessionDurationMinutes: val });
  };

  const toggleBodyPart = (part: string) => {
    const currentList = settings.prioritizedBodyParts || [];
    const index = currentList.indexOf(part);

    let newList;
    if (index > -1) {
      newList = currentList.filter(p => p !== part);
    } else {
      newList = [...currentList, part];
    }
    onSave({ ...settings, prioritizedBodyParts: newList });
  };

  const toggleTheme = (theme: 'Light' | 'Dark') => {
    onSave({ ...settings, theme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm overflow-y-auto py-10 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl m-auto transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Preferences</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Theme Settings */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
             {/* Visual Theme */}
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                 Visual Theme
               </label>
               <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 relative">
                  <button
                    onClick={() => toggleTheme('Light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${settings.theme === 'Light' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    onClick={() => toggleTheme('Dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${settings.theme === 'Dark' ? 'bg-slate-700 text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
               </div>
             </div>

             {/* Environment Settings */}
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                 Default Environment
               </label>
               <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 relative">
                  <button
                    onClick={() => onSave({ ...settings, workEnvironment: 'Office' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${settings.workEnvironment === 'Office' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Office
                  </button>
                  <button
                    onClick={() => onSave({ ...settings, workEnvironment: 'Home' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${settings.workEnvironment === 'Home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    <Home className="w-3.5 h-3.5" /> Home
                  </button>
               </div>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
                 Office mode suggests discrete exercises. Home mode allows full range of motion.
               </p>
             </div>
          </div>

          {/* Interval Settings */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Reminder Frequency
            </label>
            
            <div className="flex gap-2 mb-2">
               <input
                type="number"
                min="0"
                max="120"
                value={displayMinutes}
                onChange={handleTimeChange}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                placeholder="Minutes"
              />
              <button 
                onClick={setToTestMode}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-500/20 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 rounded-lg text-sm font-medium transition-colors border border-slate-300 dark:border-slate-600 hover:border-teal-500 flex items-center gap-2 whitespace-nowrap"
                title="Set timer to 5 seconds for testing"
              >
                <Zap className="w-3 h-3" /> Test (5s)
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Break reminder every {settings.intervalSeconds < 60 ? `${settings.intervalSeconds} seconds (Test Mode)` : `${displayMinutes} minutes`}.
            </p>
          </div>

          {/* Session Length */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Timer className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Session Length
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={settings.sessionDurationMinutes || 3}
                onChange={handleSessionDurationChange}
                className="flex-1 accent-teal-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded text-teal-600 dark:text-teal-400 font-mono">
                {settings.sessionDurationMinutes || 3} min
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              We'll generate {settings.sessionDurationMinutes || 3} one-minute exercises per session.
            </p>
          </div>

          {/* Body Focus Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Focus Priority
              </span>
              <span className="text-xs text-slate-500 font-normal">Click to order</span>
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_BODY_PARTS.map((part) => {
                const priorityIndex = (settings.prioritizedBodyParts || []).indexOf(part);
                const isSelected = priorityIndex > -1;
                
                return (
                  <button
                    key={part}
                    onClick={() => toggleBodyPart(part)}
                    className={`
                      relative flex items-center justify-between px-3 py-2 rounded-lg border transition-all
                      ${isSelected 
                        ? 'bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-500/10 dark:text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <span className="text-xs font-medium">{part}</span>
                    {isSelected ? (
                      <span className="flex items-center justify-center w-4 h-4 bg-teal-500 text-white dark:text-slate-900 text-[10px] font-bold rounded-full">
                        {priorityIndex + 1}
                      </span>
                    ) : (
                      <Circle className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Numbered items will be prioritized by the AI when generating exercises.
            </p>
          </div>
          
          {/* Visual & Audio Notification Toggles */}
          <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                 <div className="flex items-center gap-3">
                   <Bell className={`w-5 h-5 ${settings.soundEnabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`} />
                   <span className="text-slate-700 dark:text-slate-300">Sound Notification</span>
                 </div>
                 <button 
                   onClick={() => onSave({ ...settings, soundEnabled: !settings.soundEnabled })}
                   className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${settings.soundEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                 >
                   <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                 <div className="flex items-center gap-3">
                   <Sparkles className={`w-5 h-5 ${settings.glowEnabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`} />
                   <span className="text-slate-700 dark:text-slate-300">Edge Screen Glow</span>
                 </div>
                 <button 
                   onClick={() => onSave({ ...settings, glowEnabled: !settings.glowEnabled })}
                   className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${settings.glowEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                 >
                   <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${settings.glowEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>
          </div>

          {/* Dev Zone */}
          {onDevCompleteAll && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-3 h-3" /> Developer Zone
              </label>
              <button
                onClick={() => {
                   onDevCompleteAll();
                   onClose();
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-indigo-500/20"
              >
                Simulate "All Green" Celebration
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
          <div className="mt-4 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
            <span className="text-xs text-slate-400 dark:text-slate-600 font-mono tracking-widest uppercase">Module 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
