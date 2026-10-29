import React from 'react';
import { 
  Cpu, CheckCircle2, Shield, Zap, AlertTriangle, ArrowRight, Clock, 
  Layers, Shuffle, Activity, RefreshCw, Radio, Check, CornerDownRight
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Stage2AiPlanning = () => {
  const {
    requisitions,
    selectedReqIds,
    aiPlanningMode,
    isOptimizing,
    advanceToStage,
    t351Order,
  } = useSimulation();

  const selectedReqs = requisitions.filter(r => selectedReqIds.includes(r.id));
  const isSameTrack = aiPlanningMode === 'SAME_TRACK_SHADOW';

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              STAGE 2: AUTONOMOUS CP-SAT SOLVER
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              isSameTrack
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
            }`}>
              MODE: {isSameTrack ? 'SAME-TRACK SHADOW BLOCK CONSOLIDATION' : 'MULTI-TRACK CORRIDOR STAGGERING'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">
            Autonomous AI Maintenance Planning Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
            OR-Tools mathematical solver enforces Headway Buffer constraints, co-working safety envelopes, and dynamic diversion interlocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => advanceToStage(1)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
          >
            ← Back to Grouping
          </button>

          <button
            onClick={() => advanceToStage(3)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Proceed to Controller Review (Stage 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Solver Performance Strip */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">SOLVER CONVERGENCE</div>
            <div className="text-emerald-400 font-bold">OPTIMAL (0 CONFLICTS)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">SOLVER EXECUTION</div>
            <div className="text-slate-200 font-bold">14.2 MS (5,200 NODES)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">HEADWAY VALIDATION</div>
            <div className="text-blue-400 font-bold">KAVACH SIL-4 COMPLIANT</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">PASSENGER DELAY</div>
            <div className="text-emerald-400 font-bold">0 MINUTES DELAY</div>
          </div>
        </div>
      </div>

      {/* DYNAMIC BREAKDOWN BASED ON MODE */}
      {isSameTrack ? (
        /* =========================================================================
           MODE 1: SAME-TRACK SHADOW BLOCK CONSOLIDATION
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Consolidation Breakdown (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white font-mono flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-amber-400" />
                1. CONSOLIDATED SHADOW BLOCK SCHEDULE
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                1 UNIFIED CLOSURE
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {t351Order?.plainSummary || (
                <>
                  Consolidated possession plan for <strong>{t351Order?.trackSection || 'Track 2 (DN Main)'}</strong>:
                </>
              )}
            </p>

            {/* Unified Window Highlight Card */}
            <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">
                  SANCTIONED WINDOW ({t351Order?.trackSection || 'TRACK 2 DN MAIN'}):
                </span>
                <span className="text-lg font-black text-white">
                  {t351Order?.approvedWindow || '11:00 - 13:00 IST'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">TOTAL WINDOW:</span>
                <span className="text-base font-bold text-amber-400">{t351Order?.duration || '120 MINS (02H 00M)'}</span>
              </div>
            </div>

            {/* Bundled Requisitions List */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="text-[11px] text-slate-400 font-bold uppercase">
                CO-WORKING CONCURRENT ASSETS DEPLOYED:
              </div>

              {selectedReqs.map((req, idx) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white text-xs block font-sans">
                        {req.asset}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {req.deptName || req.deptCode} • {req.section || req.track}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                    SHADOW MERGED ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Safety Matrix & Automated Bypass Route (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Safety Matrix */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="font-bold text-white uppercase flex items-center gap-2 pb-2.5 border-b border-slate-800 text-xs">
                <Shield className="w-4 h-4 text-emerald-400" />
                2. SAFETY MATRIX & CO-WORKING CLEARANCE
              </h4>

              <div className="space-y-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-200 font-bold">
                    <span>25kV OHE Isolation Verification</span>
                    <span className="text-emerald-400 font-bold">SECURED</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Feeder F-04 locked OPEN. Discharge rods bonded before Civil CSM-09 machine deployment.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-200 font-bold">
                    <span>Turnout SW #4/#5 Clamping</span>
                    <span className="text-emerald-400 font-bold">REVERSE LOCKED</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Mechanical padlocking verified with Station Master Tundla & Aligarh.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-200 font-bold">
                    <span>Machine Physical Envelope</span>
                    <span className="text-emerald-400 font-bold">CLEAR OF GAUGE</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Maximum moving dimensions confirmed below de-energized OHE catenary.
                  </p>
                </div>
              </div>
            </div>

            {/* Automated Bypass Calculation */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3 font-mono text-xs bg-slate-900/40">
              <h4 className="font-bold text-cyan-300 uppercase flex items-center gap-2 pb-2.5 border-b border-slate-800 text-xs">
                <Zap className="w-4 h-4 text-cyan-400" />
                3. AUTOMATED BYPASS ROUTE CALCULATION
              </h4>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>TRACK 2 (DN MAIN):</strong> Declared DEAD for all traffic between KM 131.420 and 209.500.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>DIVERSION DETOUR:</strong> Divert incoming premium traffic via <strong>Turnout SW #4/#5</strong> to <strong>Track 4 (DN Loop)</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>SPEED RESTRICTION:</strong> TSR <strong>30 km/h</strong> over turnouts; 110 km/h on loop line.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           MODE 2: MULTI-TRACK CORRIDOR SCHEDULING
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white font-mono flex items-center gap-2 text-sm">
                <Shuffle className="w-4 h-4 text-blue-400" />
                MULTI-TRACK DIVISION-WIDE CAPACITY EVALUATION
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40">
                PARALLEL CORRIDOR DISPATCH
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Requests target distinct track sections across the division. The CP-SAT engine has staggered possession windows to guarantee that at least one mainline or dynamic loop path remains available at all times, preventing corridor starvation:
            </p>

            {/* Staggered Schedule Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="pb-2.5">TRACK LINE</th>
                    <th className="pb-2.5">DEPARTMENT & ASSET</th>
                    <th className="pb-2.5">TIME WINDOW</th>
                    <th className="pb-2.5">CORRIDOR STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedReqs.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3 font-bold text-blue-400">
                        {req.track}
                      </td>
                      <td className="py-3 text-white">
                        <div>{req.asset}</div>
                        <div className="text-[10px] text-slate-400">{req.deptName || req.deptCode}</div>
                      </td>
                      <td className="py-3 font-bold text-slate-300">
                        {req.startTime} - {req.endTime} ({req.durationMinutes}m)
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          STAGGERED NON-CONFLICT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white uppercase flex items-center gap-2 pb-2.5 border-b border-slate-800 text-xs">
              <Shield className="w-4 h-4 text-emerald-400" />
              THROUGH-TRAFFIC GUARANTEE
            </h4>

            <div className="space-y-3 text-[11px] text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">
                  ✓ NO SIMULTANEOUS MAINLINE DEADLOCK
                </span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Staggering ensures Track 1 UP Main and Track 2 DN Main are never shut down concurrently.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold block">
                  ✓ DEDICATED LOOP ALLOCATION
                </span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Track 4 Loop preserved for bypass during Track 2 window, maintaining express train headway.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
