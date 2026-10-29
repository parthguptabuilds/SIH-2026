import React from 'react';
import { Cpu, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 px-4 md:px-8 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Problem */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                RailBlock<span className="text-amber-400">.AI</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                SIH26027 • TEAM CODE CRAFTER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md">
              Smart India Hackathon 2026 Grand Finale Project. Autonomous Multi-Department Railway Block Scheduling & Dynamic Crossover Bypass Engine for Indian Railways. Eliminating 84+ minutes of daily passenger delay through mathematical shadow consolidation.
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CRIS TMS & COA INTEGRATION: PRODUCTION READY</span>
            </div>
          </div>

          {/* Col 2: Architecture & Algorithms */}
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider text-xs">
              CORE TECHNOLOGIES
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>Google OR-Tools CP-SAT</li>
              <li>WebGL 3D Digital Twin</li>
              <li>React Three Fiber / Three.js</li>
              <li>Lenis Smooth Scroll Engine</li>
              <li>Kavach SIL-4 Safety Standard</li>
              <li>Tailwind CSS & Framer Motion</li>
            </ul>
          </div>

          {/* Col 3: Railway Division Benchmark */}
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider text-xs">
              TESTBED CORRIDOR
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>Division: PRYJ (Prayagraj)</li>
              <li>Zone: North Central Railway (NCR)</li>
              <li>Section: Delhi–Howrah Quad Trunk</li>
              <li>Line Density: 148% Capacity</li>
              <li>Average Train Speed: 130 km/h</li>
              <li>Target Delay Reduction: 38%</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 RailBlock.AI • Smart India Hackathon (SIH 2026: SIH26027) • Team Code Crafter • Ministry of Railways
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">MISSION: VIKSIT BHARAT 2047</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">ZERO ACCIDENT • ZERO DELAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
