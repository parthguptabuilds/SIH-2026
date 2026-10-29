import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Radio, Hammer, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ExplodedHudCards = ({ scrollProgress }) => {
  const { setFocusedLayer, focusedLayer } = useSimulation();

  // Cards fade in as scrollProgress goes from 0.15 to 0.5
  const opacity = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.35));
  const isVisible = scrollProgress > 0.1;

  if (!isVisible) return null;

  const layers = [
    {
      id: 'trd',
      title: '01. ELECTRICAL TRD LAYER',
      sub: '25kV AC Traction Distribution & Catenary Masts',
      icon: Zap,
      accent: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
      badge: '25kV POWER CUT',
      tech: 'Catenary contact wire renewal + neutral section isolator testing.',
      aiBenefit: 'CP-SAT merges 25kV power cut into identical Civil track possession, avoiding separate corridor deadheads.',
      metric: 'FEEDER ISOLATION: 180 MIN',
    },
    {
      id: 'st',
      title: '02. SIGNALLING & TELECOM (S&T)',
      sub: 'Electronic Interlocking & Multi-Aspect Automatic Signals',
      icon: Radio,
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      badge: 'SIL-4 FAIL-SAFE',
      tech: 'Turnout switch point motor calibration & Kavach track beacon alignment.',
      aiBenefit: 'Locks interlocking route without causing cascade red signals down the PRYJ-CNB trunk route.',
      metric: 'POINT SWITCH: MOTOR 14B',
    },
    {
      id: 'civil',
      title: '03. CIVIL TRACK & BALLAST (P-WAY)',
      sub: 'PSC Concrete Sleepers, 60kg Continuous Welded Rails & Ballast',
      icon: Hammer,
      accent: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      badge: 'HEAVY MACHINE BLOCK',
      tech: 'CSM Duomatic tamping machine + ultrasonic rail flaw detection (USFD).',
      aiBenefit: 'Tamping and ballast regulating units deployed concurrently under same protected block window.',
      metric: 'BALLAST CUSHION: 350MM',
    },
  ];

  return (
    <div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-8 lg:p-12 transition-opacity duration-300"
    >
      {/* Header Exploded Indicator */}
      <div className="max-w-md pointer-events-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium backdrop-blur-md mb-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          CP-SAT EXPLODED DIGITAL TWIN
        </motion.div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Autonomous "Shadow Block" Decomposition
        </h3>
        <p className="text-xs md:text-sm text-slate-300 mt-1 drop-shadow">
          Scroll down to inspect how RailBlock.AI mathematically unifies 3 conflicting departmental track requests into a single, seamless corridor window.
        </p>
      </div>

      {/* Floating HUD Cards right side */}
      <div className="self-end max-w-sm w-full space-y-3 pointer-events-auto mt-4">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isSelected = focusedLayer === layer.id;

          return (
            <div
              key={layer.id}
              onMouseEnter={() => setFocusedLayer(layer.id)}
              onMouseLeave={() => setFocusedLayer(null)}
              className={`p-3.5 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-950/75 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${layer.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {layer.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {layer.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug mb-2 font-normal">
                {layer.aiBenefit}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                <span>{layer.metric}</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  SHADOW MERGED <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Consolidated Window Bar */}
      <div className="self-center w-full max-w-2xl pointer-events-auto">
        <div className="p-3 md:p-4 rounded-xl bg-slate-950/85 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              3:1
            </div>
            <div>
              <div className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                Consolidation Ratio Achieved
              </div>
              <div className="text-xs text-slate-300">
                3 separate track possessions collapsed into 1 single 180-min window
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
              Zero Traffic Stoppage
            </div>
            <a
              href="#simulation-section"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-sans text-xs transition-colors"
            >
              Live Bypass Demo <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
