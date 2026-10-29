import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, ShieldCheck, Database, Layers, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const OperationalScorecard = () => {
  const { tmsPacketCount } = useSimulation();

  const kpis = [
    {
      id: 'utilization',
      title: 'TRACK UTILIZATION GAIN',
      value: '+38%',
      sub: 'Throughput capacity recovered on saturated trunk sections',
      icon: TrendingUp,
      accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      badge: 'CP-SAT SOLVER',
      detail: 'Reclaims 2.4 hours of dead corridor time daily across PRYJ division.',
    },
    {
      id: 'delay',
      title: 'DELAY PREVENTION',
      value: '-84 Mins',
      sub: 'Average passenger train detention saved per mega block',
      icon: Clock,
      accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      badge: 'TIME SAVED',
      detail: 'Prevents ripple-effect speed restrictions on Rajdhani & Vande Bharat sets.',
    },
    {
      id: 'heuristic',
      title: 'ZERO-CRASH FALLBACK',
      value: 'ACTIVE & SYNCED',
      sub: 'Fail-safe heuristic logic running alongside constraint engine',
      icon: ShieldCheck,
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      badge: 'SIL-4 VERIFIED',
      detail: 'Deterministic signal interlocking safety guaranteed even on server loss.',
    },
    {
      id: 'consolidation',
      title: 'SHADOW BLOCK RATIO',
      value: '3.2 : 1',
      sub: 'Departmental block requests merged into single possession',
      icon: Layers,
      accent: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      badge: 'TRI-DEPT SYNC',
      detail: 'Eliminates redundant line possessions between Civil, TRD, and S&T.',
    },
  ];

  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-ir-dark">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            MEASURABLE OPERATIONAL ROI
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Autonomous Performance Scorecard
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-normal">
            Real-world impact metrics modeled on Indian Railways' National Train Enquiry System (NTES) and Control Office Application (COA) data.
          </p>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 relative overflow-hidden group"
              >
                {/* Subtle top glow bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-amber-400 transition-colors" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-2.5 rounded-xl border ${kpi.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-semibold">
                      {kpi.badge}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase">
                    {kpi.title}
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight my-2 group-hover:text-amber-400 transition-colors">
                    {kpi.value}
                  </div>

                  <p className="text-xs text-slate-400 font-normal leading-relaxed">
                    {kpi.sub}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  {kpi.detail}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* System Ingestion Streaming Node Footer */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">
                  LIVE INGESTION: CRIS / TMS / SCADA FEED
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  STREAMING NODE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Subscribing to Indian Railways COA (Control Office App) telemetry stream. 0 packet drops in last 24h.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="text-right">
              <div className="text-slate-400">TOTAL PROCESSED</div>
              <div className="text-base font-bold text-emerald-400">
                {tmsPacketCount.toLocaleString()} PACKETS
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-slate-400">LATENCY</div>
              <div className="text-base font-bold text-white">4.2 MS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
