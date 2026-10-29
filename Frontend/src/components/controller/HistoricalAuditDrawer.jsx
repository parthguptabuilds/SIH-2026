import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2, QrCode, Clock, Shield, Printer, ExternalLink, Hash, ArrowRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { handlePrintPdf } from '../../utils/printPdf';

export const HistoricalAuditDrawer = ({ isOpen, onClose, onSelectOrder }) => {
  const { historicalAuditLogs } = useSimulation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-xl bg-slate-950 border-l border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-8 flex flex-col h-full z-10 font-mono text-xs overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      OFFICIAL DISPATCH LEDGER
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-sans mt-0.5">
                    Historical Transmission Audit Log
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header description */}
            <div className="py-3 text-[11px] text-slate-400 border-b border-slate-900 shrink-0">
              Immutable record of Form T/351 Sanction Orders dispatched over FOIS/CRIS to Prayagraj Division Central Operations.
            </div>

            {/* Circulars List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {(historicalAuditLogs || []).map((log, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-amber-400 font-bold text-xs">
                        {log.orderNo}
                      </span>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.date} • {log.time}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                      {log.complianceStatus || 'TRANSMITTED'}
                    </span>
                  </div>

                  <div className="text-slate-200 text-[11px] font-sans">
                    <strong>Section:</strong> {log.section}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>
                      <strong>Window:</strong> <span className="text-slate-300">{log.window}</span>
                    </div>
                    <div>
                      <strong>Officer:</strong> <span className="text-slate-300">{log.controllerId}</span>
                    </div>
                  </div>

                  {/* Bundled departments badge & cryptographic hash snippet */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      {(log.bundledDepts || []).map((dept, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>

                    <div className="text-[9px] text-slate-500 font-mono truncate max-w-[180px]">
                      HASH: {log.sha256?.substring(0, 16)}...
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        handlePrintPdf();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3 h-3 text-slate-400" />
                      <span>Print Circular</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="pt-4 border-t border-slate-800 shrink-0 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% REGULATORY AUDIT COMPLIANT</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-sans text-xs transition-colors"
              >
                Close Ledger
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
