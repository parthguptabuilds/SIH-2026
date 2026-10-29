import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, Split, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const AlgorithmDeepDive = () => {
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' | 'math' | 'constraints'

  return (
    <section id="algorithm-section" className="relative py-20 px-4 md:px-8 lg:px-12 bg-ir-panel border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-3">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            CORE MATHEMATICAL ENGINE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            CP-SAT "Shadow Block" Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-normal">
            Why Indian Railways needs Constraint Programming: Traditional manual chart scheduling treats Civil, TRD, and S&T as isolated silos. RailBlock.AI mathematically computes unified shadow windows.
          </p>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BEFORE VS AFTER COMPARISON
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'math'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FORMAL SOLVER OBJECTIVE
            </button>
            <button
              onClick={() => setActiveTab('constraints')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'constraints'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RAILWAY HARD CONSTRAINTS
            </button>
          </div>
        </div>

        {/* Tab 1: Before vs After Visual Timeline */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Fragmented Approach */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-rose-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-rose-400 font-bold px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30">
                  TRADITIONAL INDIAN RAILWAYS MANUAL PRACTICE
                </span>
                <span className="font-mono text-xs text-rose-400 font-bold">270 MINS CORRIDOR LOST</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                3 Separate Fragmented Track Blocks
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                Each department asks for their own line possession independently. The section is shut down 3 separate times across the day, crippling passenger punctuality.
              </p>

              {/* Timeline bars */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>09:00 - 10:30 (90 min)</span>
                    <span className="text-blue-400">Civil P-Way Tamping</span>
                  </div>
                  <div className="w-full h-5 rounded bg-slate-900 overflow-hidden border border-slate-800">
                    <div className="w-[33%] h-full bg-blue-500/60" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>12:00 - 13:30 (90 min)</span>
                    <span className="text-pink-400">TRD OHE Power Cut</span>
                  </div>
                  <div className="w-full h-5 rounded bg-slate-900 overflow-hidden border border-slate-800">
                    <div className="w-[33%] h-full bg-pink-500/60 ml-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>15:00 - 16:30 (90 min)</span>
                    <span className="text-emerald-400">S&T Interlocking Point Check</span>
                  </div>
                  <div className="w-full h-5 rounded bg-slate-900 overflow-hidden border border-slate-800">
                    <div className="w-[33%] h-full bg-emerald-500/60 ml-[67%]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-rose-300 flex items-center gap-2">
                <span>⚠️ Total Corridor Impact: 3 Major Stoppages + Cascading Delays</span>
              </div>
            </div>

            {/* RailBlock.AI Consolidated Approach */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-amber-400 font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                  RAILBLOCK.AI CP-SAT SHADOW OPTIMIZER
                </span>
                <span className="font-mono text-xs text-emerald-400 font-bold">180 MINS ONLY (+90M GAINED)</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                1 Single Synchronized "Mega Block"
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                All 3 departments are aligned under a single, unified window while traffic dynamically diverts to Loop Line Track 4 without stopping.
              </p>

              {/* Stacked single bar */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>11:00 - 14:00 (180 min Mega Block)</span>
                  <span className="text-amber-400 font-semibold">ALL 3 DEPTS PARALLEL</span>
                </div>

                <div className="w-full rounded-xl bg-slate-900 p-2 border border-amber-500/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-blue-400">CIVIL:</span>
                    <div className="flex-1 h-3 rounded bg-blue-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-pink-400">TRD OHE:</span>
                    <div className="flex-1 h-3 rounded bg-pink-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-emerald-400">S&T:</span>
                    <div className="flex-1 h-3 rounded bg-emerald-500/80" />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  ✅ Dynamic Bypass Enabled on Track 4: Vande Bharat & Goods Trains bypass at 110 km/h with 0 detention.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 100% Zero Conflict + 90 Mins Reclaimed for High-Speed Freight
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Math Formulation */}
        {activeTab === 'math' && (
          <div className="p-6 md:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs leading-relaxed">
            <div className="text-amber-400 font-bold text-sm mb-3">
              OR-TOOLS CP-SAT CONSTRAINT SATISFACTION OBJECTIVE
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto">
{`# Multi-Objective Loss Formulation for Block Optimization:
minimize:
    W_delay * sum(Train_Delay_Cost(t)) +
    W_power * sum(OHE_Isolation_Cost(b)) +
    W_crew  * sum(Tamping_Overtime_Penalty(m)) -
    W_roi   * Consolidated_Shadow_Overlap(Civil, TRD, ST)

Subject to:
    1. Disjointness: No(Train_A, Train_B, Section_S, Headway_Safety_Buffer >= 120s)
    2. Power Lock: If Power_Cut(TRD_F04) == True => Adjacent_Section_Voltage == SAFE
    3. Loop Capacity: Occupancy(Track_4_Loop) <= Max_Permitted_Axle_Load(25_Tonnes)`}
            </pre>
            <div className="mt-4 text-slate-400 text-xs font-sans">
              Computed using Google OR-Tools CP-SAT in under 42 milliseconds for an entire railway division of 120 km and 84 daily train movements.
            </div>
          </div>
        )}

        {/* Tab 3: Railway Constraints */}
        {activeTab === 'constraints' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-amber-400 font-bold mb-2">1. SPATIO-TEMPORAL DISJOINTNESS</div>
              <p className="text-slate-400 font-sans text-xs">
                Two trains or maintenance machinery can never occupy the same block section simultaneously. Automatically enforces Indian Railways Absolute Block & Automatic Block standards.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2">2. TRACTION GRID ISO-COUPLING</div>
              <p className="text-slate-400 font-sans text-xs">
                TRD 25kV OHE power cuts require electrical grounding and neutral sections. CP-SAT prevents accidental de-energization of adjacent main tracks where trains are scheduled.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-emerald-400 font-bold mb-2">3. KAVACH SIL-4 INTERLOCKING</div>
              <p className="text-slate-400 font-sans text-xs">
                Station interlocking route setting ensures turnouts (e.g. 14B and 18A) are point-detected, bolt-locked, and proven before signal aspect changes to proceed.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
