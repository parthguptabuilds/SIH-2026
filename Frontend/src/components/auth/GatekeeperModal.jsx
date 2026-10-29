import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Check, Lock, Zap, Radio, Hammer, UserCheck, AlertTriangle } from 'lucide-react';
import { useSimulation, ROLES } from '../../context/SimulationContext';

export const GatekeeperModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentRole, selectRole } = useSimulation();

  if (!isAuthModalOpen) return null;

  const roleIcons = {
    DOM: Shield,
    CIVIL: Hammer,
    TRD: Zap,
    ST: Radio,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Click outside backdrop to dismiss */}
        <div
          className="absolute inset-0"
          onClick={() => setIsAuthModalOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-2xl z-10 overflow-hidden"
        >
          {/* Subtle Ambient Scanline Background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500" />
          
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                SECURITY CLEARANCE GATEKEEPER
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Role-Based Access Control (RBAC)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your operational identity or click a demo pill below to switch clearance instantly for judging.
              </p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Judge Switcher Pills */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-amber-500/25">
            <div className="text-[11px] font-mono text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              JUDGE QUICK-SWITCH BAR (1-CLICK DEMO AUTH)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(ROLES).map((role) => {
                const isSelected = currentRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => selectRole(role.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-extrabold'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <span>{role.id}</span>
                    <span className="text-[9px] opacity-80 truncate max-w-full">
                      {role.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Role Cards */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {Object.values(ROLES).map((role) => {
              const Icon = roleIcons[role.id] || Shield;
              const isSelected = currentRole.id === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => selectRole(role.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2.5 rounded-lg shrink-0 mt-0.5"
                        style={{
                          backgroundColor: `${role.color}15`,
                          color: role.color,
                          border: `1px solid ${role.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {role.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                            {role.division}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {role.description}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-amber-400 font-semibold">
                            {role.accessLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700 hover:border-slate-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Clearance Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ACTIVE SESSION: {currentRole.name}</span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs transition-colors"
            >
              Confirm Clearance
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
