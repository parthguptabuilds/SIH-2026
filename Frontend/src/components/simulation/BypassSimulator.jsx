import React from 'react';
import { motion } from 'framer-motion';
import { TrackSchematic2D } from './TrackSchematic2D';
import { TelemetryHUD } from './TelemetryHUD';
import { ArrowRight, Play, ShieldAlert, Cpu, Terminal, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const BypassSimulator = () => {
  const { mockPacketStream, tmsPacketCount, approveAndLockSchedule } = useSimulation();

  return (
    <section id="simulation-section" className="relative py-20 px-4 md:px-8 lg:px-12 bg-ir-panel border-t border-b border-slate-800/80 overflow-hidden">
      {/* Visual vertical blind slice decorative bars on sides */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-transparent to-cyan-500 opacity-60" />
      <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-transparent to-amber-500 opacity-60" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-3">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              OPERATIONAL SIMULATION ENGINE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Live Telemetry & Dynamic Bypass Stage
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
              Simulating Indian Railways' busiest high-density route (PRYJ Division). Watch Track 2 undergo maintenance while high-priority traffic dynamically cascades onto Loop Line Track 4 without bringing the trunk corridor to a standstill.
            </p>
          </div>

          <button
            onClick={approveAndLockSchedule}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <span>DISPATCH LOCK SIMULATOR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulation Sandbox */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Real-time Interactive SVG Schematic */}
        <TrackSchematic2D />

        {/* Live Telemetry KPI HUD Grid */}
        <TelemetryHUD />

        {/* Live CRIS / TMS / SCADA Streaming Console Log */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-bold">CRIS / COA / SCADA INGESTION BUS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                MQTT WebSocket @ 10Hz
              </span>
            </div>
            <div className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TOTAL PACKETS: {tmsPacketCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockPacketStream.map((pkt) => (
              <div
                key={pkt.id}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-2 text-[11px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <div className="text-slate-200 truncate">{pkt.text}</div>
                  <div className="text-[9px] text-slate-500">{pkt.time} • CRC32: VALID</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
