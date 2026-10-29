import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Zap, Radio, Lock, ArrowRight, CheckCircle2, Cpu, Sparkles, ExternalLink } from 'lucide-react';
import { ROLE_INFO } from '../../context/SimulationContext';

export const GatewayAuth = () => {
  const roleCards = [
    {
      id: 'civil',
      code: 'CIVIL',
      role: ROLE_INFO.civil,
      icon: Hammer,
      badge: 'TRACK REQUISITION DESK',
      border: 'border-blue-500/30 hover:border-blue-400',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      demoTag: 'Civil (P-Way)',
      highlightTasks: ['CSM-09 Tamping Machine', 'BCM-350 Ballast Cleaner', 'USFD Rail Flaw Testing'],
    },
    {
      id: 'trd',
      code: 'TRD',
      role: ROLE_INFO.trd,
      icon: Zap,
      badge: 'TRACTION POWER DESK',
      border: 'border-pink-500/30 hover:border-pink-400',
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      demoTag: 'Electrical (TRD)',
      highlightTasks: ['25kV OHE Catenary Wire', 'Tower Wagon (RU-843)', 'Substation Isolator Cut'],
    },
    {
      id: 'st',
      code: 'ST',
      role: ROLE_INFO.st,
      icon: Radio,
      badge: 'INTERLOCKING & KAVACH',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      demoTag: 'Signalling & Telecom',
      highlightTasks: ['Point Machine Overhaul', 'Axle Counter Clamps', 'Electronic Interlocking Rack'],
    },
    {
      id: 'dom',
      code: 'DOM',
      role: ROLE_INFO.dom,
      icon: Shield,
      badge: 'SUPREME DISPATCH PLANE',
      border: 'border-amber-500/40 hover:border-amber-400',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      demoTag: 'Chief Controller / DOM',
      highlightTasks: ['CP-SAT Shadow Consolidator', 'Live Bypass Train Divert', 'Approve & Lock Schedule'],
    },
  ];

  const handleOpenLogin = (deptKey) => {
    window.open(`/login?dept=${deptKey}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-ir-dark text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      {/* Background Cyber Grid & Vignette */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header & Team / SIH Metadata */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                RailBlock<span className="text-amber-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/30">
                SIH 2026
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>PROBLEM ID: <strong className="text-white">SIH26027</strong></span>
              <span>•</span>
              <span>TEAM: <strong className="text-amber-400">CODE CRAFTER</strong></span>
            </div>
          </div>
        </div>

        {/* Division Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DIV: PRYJ (PRAYAGRAJ), NCR</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hidden md:block">
            CORRIDOR: DELHI–HOWRAH HDN-1
          </div>
        </div>
      </header>

      {/* Main Center Gateway Body */}
      <main className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-3">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            SECURE DIVISIONAL CONTROL ROOM GATEWAY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Autonomous Railway Block Optimizer
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal">
            Select a departmental operations portal below to open its dedicated authentication page in a <strong className="text-amber-400">new browser tab</strong>, or launch the Chief Controller Desk to orchestrate AI CP-SAT shadow blocks.
          </p>

          {/* 1-Click Judge Quick Launcher Banner (Opens in New Tab) */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl inline-flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <span className="text-amber-300 font-bold text-[11px] px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> JUDGE 1-CLICK DEMO (OPENS NEW TAB):
            </span>
            {roleCards.map(({ id, code, demoTag }) => (
              <a
                key={id}
                href={`/login?dept=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all font-bold hover:scale-105 flex items-center gap-1.5"
              >
                <span>LOGIN AS {code} ({demoTag})</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ))}
          </div>
        </div>

        {/* 4 Department Login Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roleCards.map(({ id, code, role, icon: Icon, badge, border, bg, text, highlightTasks }) => (
            <motion.div
              key={id}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => handleOpenLogin(id)}
              className={`glass-panel p-6 rounded-2xl border ${border} cursor-pointer flex flex-col justify-between relative group transition-all`}
            >
              {/* Top Row: Icon and Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`p-3 rounded-xl ${bg} ${text}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 font-bold">
                    {badge}
                  </span>
                </div>

                <div className="font-mono text-xs font-semibold text-slate-400">
                  {role?.department}
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1 group-hover:text-amber-400 transition-colors">
                  {role?.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {role?.description}
                </p>

                {/* Sub-assets / Tasks */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">
                    PRIMARY CAPABILITIES:
                  </div>
                  {highlightTasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
                      <span className="truncate">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Login Button with target="_blank" semantics */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <a
                  href={`/login?dept=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-200 font-mono text-xs font-bold flex items-center justify-between transition-all border border-slate-700 group-hover:border-amber-400"
                >
                  <span>LOGIN AS {code}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Branding Bar */}
      <footer className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div>
          SMART INDIA HACKATHON 2026 • MINISTRY OF RAILWAYS (INDIAN RAILWAYS)
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>TEAM CODE CRAFTER</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">PROBLEM ID: SIH26027</span>
        </div>
      </footer>
    </div>
  );
};
