import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Clock, TrendingDown, ShieldCheck, Train, Edit3, Lock, Printer, 
  CheckCircle2, AlertTriangle, ArrowRight, X, Sparkles, History, FileText, Check, Shield
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { FormT351Order } from './FormT351Order';
import { handlePrintPdf } from '../../utils/printPdf';

export const Stage3ControllerReview = ({ onOpenAuditDrawer }) => {
  const {
    selectedReqIds,
    requisitions,
    t351Order,
    advanceToStage,
    transmitOrderToCris,
    updateT351Field,
    isTransmitting,
  } = useSimulation();

  const [documentViewMode, setDocumentViewMode] = useState('slate'); // 'slate' | 'paper'
  const [isTweakModalOpen, setIsTweakModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Local state for manual tweaking form
  const [tweakStart, setTweakStart] = useState(t351Order?.startHour || '13:00');
  const [tweakEnd, setTweakEnd] = useState(t351Order?.endHour || '15:30');
  const [tweakSection, setTweakSection] = useState(t351Order?.sanctionedSection || 'Track 2 (DN Main line), KM 131.420 to KM 209.500 (Aligarh–Tundla Section)');
  const [tweakTsr, setTweakTsr] = useState('30 km/h');

  // Synchronize tweak inputs when t351Order changes
  useEffect(() => {
    if (t351Order) {
      if (t351Order.startHour) setTweakStart(t351Order.startHour);
      if (t351Order.endHour) setTweakEnd(t351Order.endHour);
      if (t351Order.sanctionedSection || t351Order.trackSection) {
        setTweakSection(t351Order.sanctionedSection || t351Order.trackSection);
      }
    }
  }, [t351Order]);

  const isTransmitted = t351Order?.isTransmitted;

  const handleApplyTweak = (e) => {
    e.preventDefault();
    updateT351Field('startHour', tweakStart);
    updateT351Field('endHour', tweakEnd);
    updateT351Field('approvedWindow', `${tweakStart} hrs to ${tweakEnd} hrs (Duration: 02h 30m)`);
    updateT351Field('sanctionedSection', tweakSection);
    setIsTweakModalOpen(false);
  };

  const handleConfirmTransmission = () => {
    setIsConfirmModalOpen(false);
    transmitOrderToCris();
  };

  // Train Diversion Manifest Data
  const diversionManifest = [
    {
      trainNo: '12424',
      trainName: 'New Delhi – Dibrugarh Rajdhani Exp',
      eta: '13:42 IST',
      bypassTrack: 'Track 4 (DN Loop via SW #4/#5)',
      tsrSpeed: tweakTsr,
      aspect: 'Yellow-over-Yellow',
      status: 'CLEARED BY KAVACH',
    },
    {
      trainNo: '22436',
      trainName: 'Varanasi – New Delhi Vande Bharat Exp',
      eta: '14:15 IST',
      bypassTrack: 'Track 4 (DN Loop via SW #4/#5)',
      tsrSpeed: tweakTsr,
      aspect: 'Yellow-over-Yellow',
      status: 'CLEARED BY KAVACH',
    },
    {
      trainNo: '12560',
      trainName: 'Shiv Ganga Express (Superfast)',
      eta: '15:05 IST',
      bypassTrack: 'Track 4 (DN Loop via SW #4/#5)',
      tsrSpeed: tweakTsr,
      aspect: 'Yellow-over-Yellow',
      status: 'CLEARED BY KAVACH',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              STAGE 3: EXECUTIVE DECISION & TRANSMISSION
            </span>
            <span className="text-xs font-mono text-slate-400">
              Order No: {t351Order?.controlOrderNo}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">
            Controller Plan Analysis & Higher Authority Sanction
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
            Compare unoptimized blocks vs. AI consolidated schedule, review train diversion manifest, and transmit electronically to CRIS HQ.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => advanceToStage(2)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
          >
            ← Back to AI Plan
          </button>
        </div>
      </div>

      {/* 1. VISUAL GANTT / TIMELINE BAR & KEY METRICS (Interactive Review Card) */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-6 print:hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
          <span className="font-bold text-white uppercase flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            SCHEDULE OPTIMIZATION COMPARATIVE ANALYSIS
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            CP-SAT SHADOW MERGE ACTIVE
          </span>
        </div>

        {/* Visual Comparative Gantt Bar */}
        <div className="space-y-4 font-mono text-xs">
          {/* Baseline Unoptimized */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                1. Unoptimized Separate Blocks (3 Consecutive Line Stoppages):
              </span>
              <span className="text-rose-400 font-bold">390 Mins Total Track Closure (6h 30m)</span>
            </div>
            <div className="h-7 w-full rounded-lg bg-slate-900 p-1 flex gap-1 border border-slate-800">
              <div className="w-[38%] h-full rounded bg-blue-900/60 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-200">
                Civil CSM-09 (150m)
              </div>
              <div className="w-[38%] h-full rounded bg-pink-900/60 border border-pink-500/50 flex items-center justify-center text-[10px] text-pink-200">
                TRD OHE (150m)
              </div>
              <div className="w-[24%] h-full rounded bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center text-[10px] text-emerald-200">
                S&T Point (90m)
              </div>
            </div>
          </div>

          {/* AI Consolidated Single Window */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-amber-400 font-bold">
                2. AI Optimized Consolidated Shadow Block (Parallel Co-Working):
              </span>
              <span className="text-emerald-400 font-bold">150 Mins Unified Closure (02h 30m)</span>
            </div>
            <div className="h-9 w-full rounded-xl bg-slate-900 p-1 flex border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10">
              <div className="w-[38%] h-full rounded-lg bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-between px-3 text-[11px] font-black text-slate-950">
                <span>SHADOW POSSESSION: CIVIL + TRD + S&T</span>
                <span>13:00 - 15:30</span>
              </div>
              <div className="flex-1 flex items-center justify-center text-[10px] text-emerald-400/80 font-bold">
                ✓ 240 MINUTES OF MAINLINE CAPACITY RETURNED TO TRAFFIC
              </div>
            </div>
          </div>
        </div>

        {/* 3 High-Command Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Metric 1 */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 font-mono">
            <div className="flex items-center justify-between text-amber-400 text-xs">
              <span>POSSESSION TIME SAVED</span>
              <TrendingDown className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">-240 MINS</div>
            <div className="text-[10px] text-slate-400">61% reduction in total track occupancy</div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 font-mono">
            <div className="flex items-center justify-between text-emerald-400 text-xs">
              <span>TRAIN DELAY AVOIDANCE</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">0 MINS DELAY</div>
            <div className="text-[10px] text-slate-400">Zero passenger stoppage via Track 4 loop</div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1 font-mono">
            <div className="flex items-center justify-between text-blue-400 text-xs">
              <span>SAFETY CLEARANCE</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">100% SIL-4</div>
            <div className="text-[10px] text-slate-400">Kavach automated headway verified</div>
          </div>
        </div>
      </div>

      {/* 2. TRAIN DIVERSION MANIFEST (Allocated Bypass Loop) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 print:hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
          <h4 className="font-bold text-white uppercase flex items-center gap-2">
            <Train className="w-4 h-4 text-cyan-400" />
            TRAIN DIVERSION MANIFEST (THE BYPASS REGULATION PLAN)
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
            LOOP BYPASS ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2.5">TRAIN NO. & NAME</th>
                <th className="pb-2.5">SCHEDULED ETA</th>
                <th className="pb-2.5">ALLOCATED BYPASS ROUTE</th>
                <th className="pb-2.5">SPEED RESTRICTION</th>
                <th className="pb-2.5">ASPECT</th>
                <th className="pb-2.5 text-right">SAFETY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {diversionManifest.map((tr) => (
                <tr key={tr.trainNo} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-bold text-white">
                    <span className="text-cyan-400 mr-2">{tr.trainNo}</span>
                    <span>{tr.trainName}</span>
                  </td>
                  <td className="py-3 text-slate-300 font-bold">{tr.eta}</td>
                  <td className="py-3 text-emerald-400 font-bold">{tr.bypassTrack}</td>
                  <td className="py-3 text-amber-400 font-bold">{tr.tsrSpeed}</td>
                  <td className="py-3 text-yellow-300">{tr.aspect}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {tr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. THE OFFICIAL FORM T/351 E-CIRCULAR PREVIEW */}
      <div className="space-y-4">
        <FormT351Order
          viewMode={documentViewMode}
          onToggleViewMode={(mode) => setDocumentViewMode(mode)}
        />

        {/* 4. OFFICIAL DECISION ACTIONS BAR */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[11px]">
              CHIEF CONTROLLER DECISION:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Action 1: Manual Tweak */}
            <button
              onClick={() => setIsTweakModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 hover:border-amber-500/50 flex items-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Manual Tweak / Adjust Window</span>
            </button>

            {/* Action 2: Export Official PDF / Print */}
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 hover:border-slate-500 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Export Official PDF / Print Circular</span>
            </button>

            {/* Action 3: View Historical Audit Log */}
            <button
              onClick={onOpenAuditDrawer}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold border border-amber-500/30 hover:border-amber-500/60 flex items-center gap-2 transition-all"
            >
              <History className="w-4 h-4" />
              <span>Audit Log</span>
            </button>

            {/* Action 4: Approve & Proceed to Higher Authorities */}
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isTransmitted}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${
                isTransmitted
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 cursor-default'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isTransmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>LOCKED & DISPATCHED TO CRIS HQ</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Approve & Proceed to Higher Authorities</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: MANUAL TWEAK / ADJUST WINDOW
         ========================================================================= */}
      <AnimatePresence>
        {isTweakModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-950 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-sans">
                      Manual Operational Window Adjustment
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Chief Controller Interlock Override Mode
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsTweakModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplyTweak} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">
                      POSSESSION START TIME:
                    </label>
                    <input
                      type="time"
                      value={tweakStart}
                      onChange={(e) => setTweakStart(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">
                      POSSESSION END TIME:
                    </label>
                    <input
                      type="time"
                      value={tweakEnd}
                      onChange={(e) => setTweakEnd(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">
                    SANCTIONED TRACK SECTION:
                  </label>
                  <input
                    type="text"
                    value={tweakSection}
                    onChange={(e) => setTweakSection(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">
                    TEMPORARY SPEED RESTRICTION (TSR):
                  </label>
                  <select
                    value={tweakTsr}
                    onChange={(e) => setTweakTsr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  >
                    <option value="20 km/h">20 km/h (Strict Ballast Tamping Envelope)</option>
                    <option value="30 km/h">30 km/h (Standard 1-in-12 Turnout Bypass)</option>
                    <option value="50 km/h">50 km/h (1-in-16 High-Speed Crossover)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsTweakModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Apply Window Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: CONFIRMATION PROMPT BEFORE HIGHER AUTHORITY TRANSMISSION
         ========================================================================= */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 font-mono text-xs"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-sans">
                    Higher Authority Transmission Confirmation
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    NORTH CENTRAL RAILWAY • OPERATING BRANCH
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 leading-relaxed text-slate-300">
                <p className="font-sans text-sm text-white font-bold">
                  Transmit Signed Possession Order to Sr. DOM (Divisional Operations) & CRIS HQ Central System?
                </p>
                <div className="text-[11px] space-y-1 text-slate-400">
                  <div>• <strong>Control Order:</strong> {t351Order?.controlOrderNo}</div>
                  <div>• <strong>Section:</strong> {t351Order?.sanctionedSection}</div>
                  <div>• <strong>Window:</strong> {t351Order?.approvedWindow}</div>
                  <div>• <strong>Digital Signee:</strong> Chief Controller / Sr. DOM (PRYJ)</div>
                </div>
                <div className="pt-2 text-[10px] text-amber-400 font-bold">
                  ⚠️ Notice: Upon transmission, this circular will be locked against tampering and published to the active FOIS dispatch board.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold"
                >
                  Review Again
                </button>
                <button
                  onClick={handleConfirmTransmission}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Transmit to CRIS</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
