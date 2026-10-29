import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Server, CheckCircle2, QrCode, Cpu, Loader2, ArrowRight, X } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TransmissionModal = () => {
  const { isTransmitting, transmissionStep, t351Order } = useSimulation();

  if (!isTransmitting) return null;

  const steps = [
    {
      step: 1,
      title: 'Cryptographic Hash Generated',
      detail: `SHA-256: ${t351Order?.sha256?.substring(0, 24)}... verified with SIL-4 PKI key.`,
      icon: QrCode,
    },
    {
      step: 2,
      title: 'Transmitted to Divisional Server',
      detail: 'Establishing TLS tunnel to FOIS/CRIS Gateway (PRYJ Central Division Server)...',
      icon: Server,
    },
    {
      step: 3,
      title: 'Audit Log Appended & Order Locked',
      detail: 'Immutable entry recorded into Master Dispatch Ledger. Active Block in Effect.',
      icon: Lock,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-lg bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/20 space-y-6 font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  CRIS / FOIS GATEWAY DISPATCH
                </span>
                <span className="text-slate-500 text-[10px]">TLS 1.3 ENCRYPTED</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-sans mt-0.5">
                Transmitting Possession Order T/351
              </h4>
            </div>
          </div>

          {/* Real-time Step Sequence */}
          <div className="space-y-3.5">
            {steps.map((item) => {
              const Icon = item.icon;
              const isCurrent = transmissionStep === item.step;
              const isPast = transmissionStep > item.step;

              return (
                <div
                  key={item.step}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPast
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : isCurrent
                      ? 'bg-amber-950/30 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isPast
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                      </div>
                      <span className="font-bold text-xs">{item.title}</span>
                    </div>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        PROCESSING
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        COMPLETED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans pl-8">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>DISPATCH PROGRESS</span>
              <span className="text-emerald-400 font-bold">
                {Math.min(100, Math.round((transmissionStep / 3) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(transmissionStep / 3) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-500">
            North Central Railway • Central Control Network Node PRYJ-CC-01
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
