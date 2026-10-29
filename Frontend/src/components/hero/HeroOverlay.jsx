import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ChevronDown, Play, Sliders, Cpu, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const HeroOverlay = ({ scrollProgress }) => {
  const { currentRole, logoutToGateway, approveAndLockSchedule } = useSimulation();

  // Fade out as scroll progress increases
  const opacity = Math.max(0, 1 - scrollProgress * 3.5);
  const pointerEvents = scrollProgress > 0.25 ? 'none' : 'auto';

  return (
    <div
      style={{ opacity, pointerEvents }}
      className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-300 pointer-events-none"
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                SIH FLAGSHIP INNOVATION
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              MINISTRY OF RAILWAYS | GOVT. OF INDIA
            </div>
          </div>
        </div>

        {/* Current Active Role Pill */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 backdrop-blur-xl text-xs font-mono text-slate-200 transition-all shadow-lg"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentRole?.color || '#f59e0b' }}
          />
          <span className="font-semibold">{currentRole?.name || 'Operating Desk'}</span>
          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
            {currentRole?.id || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Main Kinetic Headline Center-Left */}
      <div className="max-w-3xl pointer-events-auto my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/85 border border-amber-500/30 text-amber-300 font-mono text-xs mb-4 backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            AUTONOMOUS RAILWAY BLOCK OPTIMIZATION ENGINE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            RailBlock<span className="text-amber-400">.AI</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed drop-shadow">
            Eliminating chronic Indian Railways maintenance delays with mathematical{' '}
            <span className="text-amber-300 font-semibold">"Shadow Mega Blocks"</span> and automated real-time dynamic crossover bypass scheduling for high-density corridors.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#simulation-section"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Live PRYJ Corridor Bypass
            </a>

            <button
              onClick={logoutToGateway}
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 backdrop-blur-xl transition-all hover:border-amber-500/40"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              Gateway Portals
            </button>

            <button
              onClick={approveAndLockSchedule}
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 backdrop-blur-xl transition-all hover:border-cyan-500/40"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              Approve & Lock Schedule
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Corridor Telemetry Strip & Scroll Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto border-t border-slate-800/60 pt-4">
        {/* Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CORRIDOR: DELHI–HOWRAH TRUNK</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            DIV: PRYJ (PRAYAGRAJ)
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-amber-400 font-semibold">
            CP-SAT SOLVER: OPTIMAL
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 animate-bounce">
          <span>SCROLL TO DISASSEMBLE 3D TWIN</span>
          <ChevronDown className="w-4 h-4 text-amber-400" />
        </div>
      </div>
    </div>
  );
};
