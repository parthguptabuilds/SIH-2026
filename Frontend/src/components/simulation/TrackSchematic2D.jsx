import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TrackSchematic2D = () => {
  const { isBlocked, bypassActive, trainSpeed, toggleBypass, toggleBlockState } = useSimulation();
  const [trainProgress, setTrainProgress] = useState(15); // percentage 0 to 100

  // Train animation loop along track
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainProgress(prev => (prev >= 98 ? 2 : prev + 0.8));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Compute train path based on bypassActive:
  // If bypassActive and train is between 25% and 75%:
  // train diverts from Track 2 (y=160) to Loop Line Track 4 (y=240)
  const getTrainCoordinates = () => {
    const p = trainProgress;
    const x = (p / 100) * 800 + 40; // SVG coordinate range 40 to 840
    let y = 160; // Track 2 Down Main Line

    if (bypassActive) {
      if (p < 25) {
        y = 160;
      } else if (p >= 25 && p <= 40) {
        // Crossover Turnout 14B: 160 -> 240
        const factor = (p - 25) / 15;
        y = 160 + factor * 80;
      } else if (p > 40 && p < 65) {
        // Riding on Loop Line Track 4
        y = 240;
      } else if (p >= 65 && p <= 80) {
        // Return Turnout 18A: 240 -> 160
        const factor = (p - 65) / 15;
        y = 240 - factor * 80;
      } else {
        y = 160;
      }
    }

    return { x, y };
  };

  const trainPos = getTrainCoordinates();

  return (
    <div className="w-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 md:p-6 backdrop-blur-xl relative overflow-hidden">
      {/* Title & Division Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                PRYJ JUNCTION ⇄ SUBEDARGANJ SECTION SCHEMATIC
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                LIVE INTERLOCKING
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              CORRIDOR KMS: MP 640.200 TO 645.800 (QUADRUPLE LINE AUTOMATIC BLOCK)
            </div>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">STATUS:</span>
          {isBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              TRACK 2 MEGA-BLOCK ACTIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ALL TRACKS CLEAR
            </span>
          )}
        </div>
      </div>

      {/* SVG Interactive Track Schematic */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 900 320"
          className="w-full min-w-[720px] h-auto font-mono text-[11px] select-none"
        >
          {/* Background Grid Lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            {/* Warning striped pattern for active maintenance block */}
            <pattern id="stripes" width="16" height="16" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(239, 68, 68, 0.45)" strokeWidth="6" />
            </pattern>
          </defs>
          <rect width="900" height="320" fill="url(#grid)" />

          {/* TRACK 1: UP MAIN LINE (y=80) */}
          <g>
            <text x="30" y="65" fill="#94a3b8" fontWeight="bold">TRACK 1: UP MAIN LINE (CNB ➔ PRYJ)</text>
            <line x1="20" y1="80" x2="880" y2="80" stroke="#334155" strokeWidth="6" />
            <line x1="20" y1="80" x2="880" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 4" opacity="0.6" />
            {/* Signals Track 1 */}
            <circle cx="160" cy="70" r="4" fill="#10b981" />
            <circle cx="500" cy="70" r="4" fill="#10b981" />
            <circle cx="780" cy="70" r="4" fill="#10b981" />
          </g>

          {/* TRACK 2: DOWN MAIN LINE (y=160) - SUBJECT OF BLOCK */}
          <g>
            <text x="30" y="145" fill="#f59e0b" fontWeight="bold">TRACK 2: DOWN MAIN LINE (PRYJ ➔ CNB)</text>
            {/* Base line */}
            <line x1="20" y1="160" x2="880" y2="160" stroke="#334155" strokeWidth="6" />
            
            {/* Blocked Section Highlight (x=380 to x=620) */}
            {isBlocked && (
              <>
                <rect x="360" y="145" width="260" height="30" fill="url(#stripes)" rx="6" stroke="#ef4444" strokeWidth="1.5" />
                <text x="380" y="164" fill="#fca5a5" fontWeight="bold" fontSize="10">
                  ⚠️ SHADOW MEGA BLOCK: CIVIL CSM 9102 + TRD OHE + S&T
                </text>
                {/* Red Danger Signal before block */}
                <circle cx="340" cy="150" r="5" fill="#ef4444" className="animate-ping" />
                <circle cx="340" cy="150" r="5" fill="#ef4444" />
              </>
            )}

            {!isBlocked && (
              <line x1="20" y1="160" x2="880" y2="160" stroke="#10b981" strokeWidth="2" strokeDasharray="8 4" opacity="0.8" />
            )}
          </g>

          {/* TRACK 4: DOWN LOOP LINE (y=240) - BYPASS ROUTE */}
          <g>
            <text x="30" y="275" fill="#38bdf8" fontWeight="bold">TRACK 4: DOWN LOOP LINE (BYPASS ROUTE)</text>
            <line x1="200" y1="240" x2="740" y2="240" stroke="#334155" strokeWidth="6" />
            <line x1="200" y1="240" x2="740" y2="240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 3" />
          </g>

          {/* TURNOUT 14B: Crossover from Track 2 to Track 4 (x=240 to x=360) */}
          <g>
            <path
              d="M 240 160 Q 300 200 360 240"
              fill="none"
              stroke={bypassActive ? "#f59e0b" : "#475569"}
              strokeWidth="4"
              strokeDasharray={bypassActive ? "none" : "4 4"}
            />
            <circle cx="240" cy="160" r="4" fill={bypassActive ? "#f59e0b" : "#64748b"} />
            <text x="220" y="195" fill="#f59e0b" fontSize="9">TURNOUT 14B (REVERSE)</text>
            {/* Active turnout indicator */}
            {bypassActive && (
              <circle cx="300" cy="200" r="3" fill="#10b981" className="animate-pulse" />
            )}
          </g>

          {/* TURNOUT 18A: Return Crossover from Track 4 to Track 2 (x=620 to x=740) */}
          <g>
            <path
              d="M 620 240 Q 680 200 740 160"
              fill="none"
              stroke={bypassActive ? "#f59e0b" : "#475569"}
              strokeWidth="4"
              strokeDasharray={bypassActive ? "none" : "4 4"}
            />
            <circle cx="740" cy="160" r="4" fill={bypassActive ? "#f59e0b" : "#64748b"} />
            <text x="635" y="215" fill="#f59e0b" fontSize="9">TURNOUT 18A (NORMAL)</text>
          </g>

          {/* SIGNALS ALONG TRACK 2 & LOOP LINE */}
          {/* Signal AS-124 (Before Divert) */}
          <g transform="translate(210, 135)">
            <rect x="0" y="0" width="12" height="24" rx="2" fill="#0f172a" stroke="#334155" />
            <circle cx="6" cy="7" r="3" fill={bypassActive ? "#f59e0b" : "#10b981"} />
            <circle cx="6" cy="17" r="3" fill={bypassActive ? "#f59e0b" : "#1e293b"} />
            <text x="-15" y="-5" fill="#94a3b8" fontSize="8">AS-124</text>
          </g>

          {/* Signal LS-04 (On Loop Line Entry) */}
          <g transform="translate(370, 215)">
            <rect x="0" y="0" width="12" height="24" rx="2" fill="#0f172a" stroke="#334155" />
            <circle cx="6" cy="7" r="3" fill="#10b981" />
            <circle cx="6" cy="17" r="3" fill="#1e293b" />
            <text x="18" y="15" fill="#10b981" fontSize="8">LS-04 [PROCEED]</text>
          </g>

          {/* DYNAMIC MOVING TRAIN: 22436 VANDE BHARAT EXPRESS */}
          <g transform={`translate(${trainPos.x}, ${trainPos.y})`}>
            {/* Train Locomotive & Coaches body */}
            <rect
              x="-35"
              y="-10"
              width="70"
              height="20"
              rx="5"
              fill="#ffffff"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Front nose aerodynamic taper */}
            <path d="M 35 -10 L 45 0 L 35 10 Z" fill="#0284c7" />
            {/* Blue and Orange livery stripe */}
            <rect x="-33" y="-3" width="66" height="6" fill="#f97316" />
            {/* Headlights */}
            <circle cx="43" cy="-4" r="2" fill="#fef08a" />
            <circle cx="43" cy="4" r="2" fill="#fef08a" />
            {/* Headlight beam projection */}
            <polygon points="45,-6 90,-16 90,16 45,6" fill="rgba(254, 240, 138, 0.15)" />

            {/* Train Label */}
            <text x="-40" y="-16" fill="#38bdf8" fontWeight="bold" fontSize="10">
              TRAIN 22436 VB EXPRESS ({trainSpeed} KM/H)
            </text>
          </g>
        </svg>
      </div>

      {/* Bypass Action Controls Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleBypass}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              bypassActive
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${bypassActive ? 'animate-spin' : ''}`} />
            DYNAMIC BYPASS: {bypassActive ? 'ACTIVE (LOOP TRACK 4)' : 'OFF (MAIN LINE)'}
          </button>

          <button
            onClick={toggleBlockState}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isBlocked
                ? 'bg-rose-500/20 border border-rose-500 text-rose-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            MAINTENANCE BLOCK: {isBlocked ? 'TRACK 2 BLOCKED' : 'TRACK 2 OPEN'}
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>COLLISION AVOIDANCE (KAVACH): ARMED</span>
        </div>
      </div>
    </div>
  );
};
