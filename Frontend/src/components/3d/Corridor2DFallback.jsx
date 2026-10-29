import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const Corridor2DFallback = ({ isBlocked = true, bypassActive = true }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 relative select-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Corridor HUD Title */}
      <div className="z-10 flex items-center justify-between w-full max-w-4xl mb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">2.5D CORRIDOR DIGITAL TWIN [ENGINE ACTIVE]</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400">PRYJ ⇄ SUBEDARGANJ (MP 640.200 TO 645.800)</span>
        </div>
        <div className="text-slate-400">
          HDN-1 QUADRUPLE TRUNK LINE
        </div>
      </div>

      {/* Clean 2.5D SVG Schematic */}
      <div className="z-10 w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <svg viewBox="0 0 800 220" className="w-full h-auto font-mono text-[10px]">
          <defs>
            <pattern id="fb_stripes" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="4" />
            </pattern>
          </defs>

          {/* Track 1: UP Main */}
          <text x="30" y="45" fill="#64748b" fontWeight="bold">TRACK 1 (UP MAIN): CNB ➔ PRYJ</text>
          <line x1="20" y1="55" x2="780" y2="55" stroke="#334155" strokeWidth="5" />
          <line x1="20" y1="55" x2="780" y2="55" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />

          {/* Track 2: DN Main (Subject of Block) */}
          <text x="30" y="105" fill="#f59e0b" fontWeight="bold">TRACK 2 (DN MAIN): PRYJ ➔ CNB</text>
          <line x1="20" y1="115" x2="780" y2="115" stroke="#334155" strokeWidth="5" />

          {isBlocked && (
            <>
              <rect x="300" y="100" width="240" height="30" fill="url(#fb_stripes)" rx="4" stroke="#ef4444" strokeWidth="1.5" />
              <text x="320" y="119" fill="#fca5a5" fontWeight="bold">⚠️ SHADOW BLOCK: CIVIL + TRD + S&T</text>
              <circle cx="280" cy="115" r="4" fill="#ef4444" className="animate-ping" />
              <circle cx="280" cy="115" r="4" fill="#ef4444" />
            </>
          )}

          {/* Track 4: DN Loop Line (Bypass) */}
          <text x="30" y="175" fill="#38bdf8" fontWeight="bold">TRACK 4 (DN LOOP): AUTOMATIC BYPASS ROUTE</text>
          <line x1="180" y1="185" x2="680" y2="185" stroke="#334155" strokeWidth="5" />
          <line x1="180" y1="185" x2="680" y2="185" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 3" />

          {/* Turnout 14B Crossover */}
          <path
            d="M 200 115 Q 240 150 280 185"
            fill="none"
            stroke={bypassActive ? "#f59e0b" : "#475569"}
            strokeWidth="3.5"
          />
          <text x="180" y="145" fill="#f59e0b" fontSize="8">TURNOUT 14B</text>

          {/* Turnout 18A Return */}
          <path
            d="M 580 185 Q 620 150 660 115"
            fill="none"
            stroke={bypassActive ? "#f59e0b" : "#475569"}
            strokeWidth="3.5"
          />
          <text x="600" y="145" fill="#f59e0b" fontSize="8">TURNOUT 18A</text>

          {/* Moving train badge indicator */}
          <g transform="translate(420, 185)">
            <rect x="-40" y="-12" width="80" height="24" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <rect x="-38" y="-3" width="76" height="6" fill="#f97316" />
            <text x="-32" y="4" fill="#0369a1" fontWeight="bold" fontSize="8">TRAIN 22436 VB</text>
          </g>
        </svg>

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>KAVACH SIL-4 INTERLOCKING CONFIRMED</span>
          </div>
          <div>BYPASS SPEED: 110 KM/H • DELAY: 0 MINS</div>
        </div>
      </div>
    </div>
  );
};
