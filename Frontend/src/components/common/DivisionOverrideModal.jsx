import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle2, ShieldAlert, Cpu, Check, AlertTriangle, FileCheck } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const DivisionOverrideModal = () => {
  const { isOverrideModalOpen, setIsOverrideModalOpen, lockMegaBlock, currentRole, megaBlockLocked } = useSimulation();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOverrideModalOpen) return null;

  const handleLock = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      lockMegaBlock();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div
          className="absolute inset-0"
          onClick={() => setIsOverrideModalOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-slate-950/95 border border-amber-500/40 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-2xl z-10 overflow-hidden"
        >
          {/* Header Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300" />

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                DIVISION CONTROLLER DISPATCH CONSOLE
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Approve & Lock Shadow Mega Block
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Executing formal inter-departmental block consolidation under Operating Rule GR 15.06 & SR 15.06/1.
              </p>
            </div>

            <button
              onClick={() => setIsOverrideModalOpen(false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Consolidated Block Dossier */}
          <div className="space-y-3 mb-6 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                CORRIDOR SECTION
              </div>
              <div className="text-white font-bold text-sm">
                PRYJ JN (KM 640.200) ⇄ SUBEDARGANJ (KM 645.800)
              </div>
              <div className="text-amber-400 text-[11px] mt-0.5">
                TRACK 2 (DOWN MAIN LINE) • DURATION: 180 MINUTES (11:00 TO 14:00 HRS)
              </div>
            </div>

            {/* Department Sync Checklist */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">1. Civil Engineering (P-Way):</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> CSM 9102 Tamping Machine Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">2. Electrical TRD:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Feeder F-04 25kV Isolation Synced
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">3. Signalling & Telecom:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Point Machine 14B Reversed & Clamped
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                <span className="text-slate-300">4. Dynamic Bypass Routing:</span>
                <span className="text-cyan-400 font-semibold">
                  Track 4 Loop Line Safe Clear Path
                </span>
              </div>
            </div>
          </div>

          {/* Controller Authority Verification */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2.5 mb-6">
            <FileCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">SIGNING AUTHORITY:</span> {currentRole.name} ({currentRole.division})
              <div className="text-[10px] text-slate-400 mt-0.5">
                Clearance will be digitally broadcast to CRIS-COA, TMS Server, and Station Master consoles immediately.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsOverrideModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleLock}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              {isProcessing ? 'COMPUTING CP-SAT...' : 'APPROVE & LOCK MEGA BLOCK'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
