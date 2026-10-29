import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Minimize2, Maximize2, Video, Compass, Radio, AlertOctagon, ArrowRight, Train } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ExplodedTrackCanvas } from '../3d/ExplodedTrackCanvas';
import { Corridor2DFallback } from '../3d/Corridor2DFallback';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const CorridorTelemetryPip = () => {
  const { isBlocked, bypassActive, trainSpeed, t351Order } = useSimulation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [pipMode, setPipMode] = useState('2d'); // '2d' (clean schematic) | '3d' (WebGL twin)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`transition-all duration-300 print:hidden ${
        isExpanded
          ? 'fixed inset-4 sm:inset-10 z-50 flex flex-col bg-slate-950/95 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl'
          : 'glass-panel rounded-2xl border border-slate-800 p-4 relative overflow-hidden'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-black text-white tracking-wide">
            LIVE CORRIDOR TELEMETRY (HDN-1)
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-amber-400 text-[10px] hidden sm:inline font-bold">
            ALJN ⇄ TDL (KM 131.420 - 209.500)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 2D Schematic / 3D Canvas Switcher */}
          <div className="p-0.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center text-[10px]">
            <button
              onClick={() => setPipMode('2d')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                pipMode === '2d'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Schematic
            </button>
            <button
              onClick={() => setPipMode('3d')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                pipMode === '3d'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Twin
            </button>
          </div>

          {/* Expand / Maximize Button */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            title={isExpanded ? 'Restore View' : 'Expand Monitor'}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Minimize toggle */}
          {!isExpanded && (
            <button
              onClick={() => setIsMinimized(prev => !prev)}
              className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-white text-[10px] font-bold border border-slate-800"
            >
              {isMinimized ? 'Show' : 'Hide'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!isMinimized && (
        <div className={`mt-3 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 ${isExpanded ? 'flex-1 min-h-[400px]' : 'h-64 sm:h-72'}`}>
          {pipMode === '3d' ? (
            <div className="w-full h-full relative">
              <ErrorBoundary fallback={<Corridor2DFallback isBlocked={isBlocked} bypassActive={bypassActive} />}>
                <ExplodedTrackCanvas />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="w-full h-full p-3 sm:p-4 flex flex-col justify-between select-none">
              {/* High-legibility 2D Track Block Circuit SVG */}
              <div className="flex-1 flex items-center justify-center">
                <svg viewBox="0 0 740 190" className="w-full h-auto font-mono text-[9px]">
                  <defs>
                    <pattern id="pip_hazard" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="3" />
                    </pattern>
                  </defs>

                  {/* Track 1: UP Main */}
                  <g>
                    <text x="20" y="32" fill="#64748b" fontWeight="bold">TRACK 1 (UP MAIN): CNB ➔ PRYJ [NORMAL TRAFFIC 130 KM/H]</text>
                    <line x1="15" y1="42" x2="725" y2="42" stroke="#334155" strokeWidth="4" />
                    <line x1="15" y1="42" x2="725" y2="42" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
                  </g>

                  {/* Track 2: DN Main (DEAD FOR TRAFFIC / WORKZONE) */}
                  <g>
                    <text x="20" y="86" fill="#f87171" fontWeight="bold">TRACK 2 (DN MAIN): KM 131.420 - 209.500 [DEAD FOR TRAFFIC]</text>
                    <line x1="15" y1="96" x2="725" y2="96" stroke="#334155" strokeWidth="4" />

                    {/* Red Hazard Striped Overlay */}
                    <rect x="230" y="82" width="280" height="28" fill="url(#pip_hazard)" rx="4" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="245" y="100" fill="#fca5a5" fontWeight="bold">⚠️ WORKZONE: CIVIL + TRD + S&T OCCUPIED</text>
                    <circle cx="215" cy="96" r="4" fill="#ef4444" className="animate-ping" />
                    <circle cx="215" cy="96" r="4" fill="#ef4444" />
                  </g>

                  {/* Turnout SW #4/#5 (Divergence to Loop) */}
                  <path
                    d="M 170 96 Q 205 125 240 152"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                  />
                  <text x="140" y="122" fill="#10b981" fontWeight="bold">SW #4/#5</text>

                  {/* Turnout 18A (Rejoin Main Line) */}
                  <path
                    d="M 520 152 Q 555 125 590 96"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                  />
                  <text x="545" y="122" fill="#10b981" fontWeight="bold">SW #18A</text>

                  {/* Track 4: DN Loop Line (GREEN BYPASS) */}
                  <g>
                    <text x="20" y="142" fill="#34d399" fontWeight="bold">TRACK 4 (DN LOOP): LIVE DIVERSION BYPASS [TSR 30 KM/H]</text>
                    <line x1="150" y1="152" x2="610" y2="152" stroke="#334155" strokeWidth="4" />
                    <line x1="150" y1="152" x2="610" y2="152" stroke="#10b981" strokeWidth="2.5" strokeDasharray="8 3" />

                    {/* Active Diverted Train Badge */}
                    <g transform="translate(370, 152)">
                      <rect x="-48" y="-11" width="96" height="22" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                      <text x="-42" y="3" fill="#a7f3d0" fontWeight="bold" fontSize="7.5">12424 RAJDHANI (30 KM/H)</text>
                    </g>
                  </g>

                  {/* Signal 14-D */}
                  <g transform="translate(130, 85)">
                    <circle cx="0" cy="0" r="5" fill="#eab308" />
                    <circle cx="0" cy="10" r="5" fill="#eab308" />
                    <text x="-35" y="6" fill="#facc15" fontSize="7">SIG 14-D (Y/Y)</text>
                  </g>
                </svg>
              </div>

              {/* Bottom Real-time Line Status Strip */}
              <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                    TRK 2: DEAD
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    TRK 4: BYPASS (30 KM/H)
                  </span>
                </div>
                <div className="text-slate-400">
                  KAVACH BRAKING CURVE: <span className="text-emerald-400 font-bold">LOCKED SIL-4</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
