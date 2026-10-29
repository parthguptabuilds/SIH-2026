import React from 'react';
import { Gauge, Clock, ShieldCheck, Zap, Radio, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TelemetryHUD = () => {
  const { trainSpeed, setTrainSpeed, blockDurationSeconds, isBlocked, bypassActive } = useSimulation();

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TRAIN SPEEDOMETER & THROTTLE */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="hud-chip text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            TELEMETRY SPEED
          </span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
            LIMIT: 130 KM/H
          </span>
        </div>

        <div className="my-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {trainSpeed}
            </span>
            <span className="text-sm font-mono text-slate-400">KM/H</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            {bypassActive
              ? 'Loop Turnout Speed Capped at 50 km/h then 110 km/h'
              : 'Direct Main Line High Speed Run'}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>SPEED THROTTLE SIMULATOR</span>
            <span>{trainSpeed} KM/H</span>
          </div>
          <input
            type="range"
            min="30"
            max="160"
            value={trainSpeed}
            onChange={(e) => setTrainSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* 2. BLOCK WINDOW ETA COUNTDOWN */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="hud-chip text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            BLOCK WINDOW REMAINING
          </span>
          <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border ${
            isBlocked
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isBlocked ? 'COUNTDOWN' : 'STANDBY'}
          </span>
        </div>

        <div className="my-1">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-tight">
            {isBlocked ? formatTime(blockDurationSeconds) : '00:00:00'}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Consolidated Shadow Mega Block Duration: 180 Mins
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>PROGRESS: 38%</span>
          <span className="text-emerald-400 font-semibold">ON SCHEDULE</span>
        </div>
      </div>

      {/* 3. HEADWAY SAFETY RADAR (KAVACH) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="hud-chip text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            HEADWAY SAFETY RADAR
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
            SIL-4 FAIL-SAFE
          </span>
        </div>

        <div className="my-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
              2.4
            </span>
            <span className="text-sm font-mono text-slate-400">KM CLEAR</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Rear Train 12452 Shram Shakti at 4.8 km safe headway
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">COLLISION PROB:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ZERO (MATHEMATICALLY PROVEN)
          </span>
        </div>
      </div>

      {/* 4. MULTI-DEPARTMENT SHADOW MERGE STATE */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="hud-chip text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            TRI-DEPT SYNC MATRIX
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold border border-purple-500/30">
            CP-SAT LOCKED
          </span>
        </div>

        <div className="space-y-1.5 my-1 text-[11px] font-mono">
          <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-300">P-Way CSM 9102:</span>
            <span className="text-emerald-400 font-semibold">TAMPING ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-300">TRD 25kV OHE:</span>
            <span className="text-pink-400 font-semibold">ISOLATED & EARTHED</span>
          </div>
          <div className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-300">S&T Point 14B:</span>
            <span className="text-cyan-400 font-semibold">LOCKED REVERSE</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-400">
          <span>SHADOW CONFLICTS:</span>
          <span className="font-bold">0 DETECTED</span>
        </div>
      </div>
    </div>
  );
};
