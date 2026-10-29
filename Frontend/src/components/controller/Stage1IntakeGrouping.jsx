import React, { useState } from 'react';
import { 
  Layers, CheckSquare, Square, Shield, Zap, Hammer, Radio, ArrowRight, 
  Sparkles, Clock, AlertTriangle, TrendingDown, CheckCircle2, Shuffle, Check
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Stage1IntakeGrouping = () => {
  const {
    requisitions,
    loadSameTrackScenario,
    loadMultiTrackScenario,
    prepareAiPlan,
  } = useSimulation();

  const [selectedReqIds, setSelectedReqIds] = useState([]);

  const toggleSelectReq = (id) => {
    setSelectedReqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllReqs = () => {
    setSelectedReqIds((requisitions || []).map((r) => r.id));
  };

  const clearSelectedReqs = () => {
    setSelectedReqIds([]);
  };

  const reqList = requisitions || [];

  // Group into Bucket A (Same-Track Overlap, count >= 2 on same track) and Bucket B (Independent/Cross-Track)
  const trackGroups = {};
  reqList.forEach(r => {
    const trackKey = r.trackId || r.track || 'track2';
    if (!trackGroups[trackKey]) trackGroups[trackKey] = [];
    trackGroups[trackKey].push(r);
  });

  const bucketA = [];
  const bucketB = [];

  Object.entries(trackGroups).forEach(([trackKey, items]) => {
    if (items.length >= 2) {
      bucketA.push(...items);
    } else {
      bucketB.push(...items);
    }
  });

  // Calculate potential time savings for Bucket A
  const bucketATotalSeparateMins = bucketA.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
  const bucketAMaxSingleWindow = bucketA.length > 0
    ? Math.max(...bucketA.map(r => r.durationMinutes || 0))
    : 0;
  const potentialSavingsMins = Math.max(0, bucketATotalSeparateMins - bucketAMaxSingleWindow);
  const potentialSavingsHours = (potentialSavingsMins / 60).toFixed(1);

  const isAllSelected = reqList.length > 0 && selectedReqIds.length === reqList.length;
  const selectedCount = selectedReqIds.length;

  return (
    <div className="space-y-6">
      {/* Top Scenario Presets Bar (For Evaluators / Judges) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-400 uppercase text-[11px] block">
              SIH 2026 EVALUATION PRESETS:
            </span>
            <span className="text-[11px] text-slate-400">
              One-click demonstration of automated conflict grouping & multi-track scheduling.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadSameTrackScenario}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Load Same-Track Conflict Scenario</span>
          </button>

          <button
            onClick={loadMultiTrackScenario}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Load Multi-Track Scenario</span>
          </button>
        </div>
      </div>

      {/* Header & Selection Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              STAGE 1: PRE-AI INTAKE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total Ingested: {reqList.length} Requisitions
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
            Requisition Inspection & Track Conflict Grouping
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Incoming field maintenance bids are automatically segregated into co-location candidates vs. independent cross-track corridors.
          </p>
        </div>

        {/* Checkbox Quick Actions & Submit CTA */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <button
            onClick={() => isAllSelected ? clearSelectedReqs() : selectAllReqs()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
          </button>

          <button
            onClick={prepareAiPlan}
            disabled={selectedCount === 0}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${
              selectedCount > 0
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Prepare AI Plan for Selected ({selectedCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TWO VISUAL BUCKETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* =========================================================================
            BUCKET A: SAME-TRACK CO-LOCATION CANDIDATES (POSSESSION OVERLAP)
           ========================================================================= */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-amber-500/40 space-y-5 bg-gradient-to-b from-amber-950/10 via-slate-950 to-slate-950">
          {/* Bucket Header */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                POTENTIAL SHADOW BLOCK MERGER: 2+ DEPTS ON SAME TRACK
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {bucketA.length} Requests
              </span>
            </div>

            <h4 className="text-base font-bold text-white font-sans">
              Bucket A: Same-Track Co-Location Candidates
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Multiple departments requesting overlapping track possession on the exact same line.
            </p>

            {/* Potential Time Savings Metric Pill */}
            {bucketA.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                  <span>PROJECTED TIME SAVED:</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-400">
                    -{potentialSavingsMins} MINS
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    ({potentialSavingsHours} hrs less downtime)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bucket A Items */}
          <div className="space-y-3">
            {bucketA.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
                No same-track conflicts detected. Click "Load Same-Track Conflict Scenario" above to test.
              </div>
            ) : (
              bucketA.map((req) => {
                const isSelected = selectedReqIds.includes(req.id);
                return (
                  <div
                    key={req.id}
                    onClick={() => toggleSelectReq(req.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-amber-950/25 border-amber-500/70 text-slate-200 shadow-md shadow-amber-500/5'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-amber-400 font-bold">{req.id}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                              {req.deptCode || (req.dept || '').toUpperCase()}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              {req.priority}
                            </span>
                          </div>
                          <div className="text-white font-bold font-sans text-sm mt-1">
                            {req.asset}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] shrink-0">
                        <div className="text-slate-200 font-bold">{req.startTime} - {req.endTime}</div>
                        <div className="text-slate-500">{req.durationMinutes} mins</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-amber-300/80">
                        📍 {req.section || req.track}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {req.notes || 'Co-working candidate ready for consolidation'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================================
            BUCKET B: CROSS-TRACK / INDEPENDENT OPERATIONS
           ========================================================================= */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-blue-500/40 space-y-5 bg-gradient-to-b from-blue-950/10 via-slate-950 to-slate-950">
          {/* Bucket Header */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                MULTI-TRACK PARALLEL EXECUTION
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {bucketB.length} Requests
              </span>
            </div>

            <h4 className="text-base font-bold text-white font-sans">
              Bucket B: Cross-Track / Independent Operations
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Requests targeting separate lines (e.g., Track 1 UP Main vs. Track 4 Loop). Can execute in parallel or staggered to prevent bypass starvation.
            </p>

            <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3 font-mono text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>CORRIDOR CAPACITY POLICY:</span>
              </div>
              <span className="text-[10px] text-slate-300">
                Independent track paths available
              </span>
            </div>
          </div>

          {/* Bucket B Items */}
          <div className="space-y-3">
            {bucketB.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
                No independent cross-track requests. Click "Load Multi-Track Scenario" above to test.
              </div>
            ) : (
              bucketB.map((req) => {
                const isSelected = selectedReqIds.includes(req.id);
                return (
                  <div
                    key={req.id}
                    onClick={() => toggleSelectReq(req.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-blue-950/25 border-blue-500/70 text-slate-200 shadow-md shadow-blue-500/5'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-blue-400 font-bold">{req.id}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                              {req.deptCode || (req.dept || '').toUpperCase()}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                              {req.priority}
                            </span>
                          </div>
                          <div className="text-white font-bold font-sans text-sm mt-1">
                            {req.asset}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] shrink-0">
                        <div className="text-slate-200 font-bold">{req.startTime} - {req.endTime}</div>
                        <div className="text-slate-500">{req.durationMinutes} mins</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-blue-300/80">
                        📍 {req.section || req.track}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Parallel track corridor line
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
