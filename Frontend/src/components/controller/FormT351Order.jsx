import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, FileText, Printer, Check, Copy, QrCode, FileCheck, Eye, Sparkles } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const FormT351Order = ({ viewMode = 'slate', onToggleViewMode, planOverride }) => {
  const { t351Order, requisitions } = useSimulation();
  const [copiedHash, setCopiedHash] = useState(false);

  const order = planOverride || t351Order || {};
  const isPaper = viewMode === 'paper';
  const isTransmitted = order.isTransmitted;

  const handleCopyHash = () => {
    if (order.sha256 && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(order.sha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  // Helper: Format Track Section with bold white title and crisp muted slate KM markers
  const renderTrackSection = (val) => {
    const str = val || order.sanctionedSection || 'Track 2: DN Main (KM 131.420 to KM 209.500)';
    const kmMatch = str.match(/^(.*?)(?:\s*[\(\[]|\s+-\s+|\s*,\s*)?((?:KM|km)\s*[\d\.\s\-to]+[\)\]]?.*)$/i);
    if (kmMatch) {
      const trackName = kmMatch[1].trim().replace(/[\(\[\)\]]/g, '');
      const km = kmMatch[2].trim().replace(/^[\(\[]/, '').replace(/[\)\]]$/, '');
      return (
        <div className="space-y-0.5">
          <div className={`font-semibold text-[13px] leading-snug ${isPaper ? 'text-slate-950' : 'text-slate-100'}`}>
            {trackName}
          </div>
          <div className="text-slate-400 text-xs font-mono">
            {km.toUpperCase().startsWith('KM') ? km : `KM ${km}`}
          </div>
        </div>
      );
    }
    const parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
    if (parenMatch) {
      return (
        <div className="space-y-0.5">
          <div className={`font-semibold text-[13px] leading-snug ${isPaper ? 'text-slate-950' : 'text-slate-100'}`}>
            {parenMatch[1].trim()}
          </div>
          <div className="text-slate-400 text-xs font-mono">
            {parenMatch[2].trim()}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-0.5">
        <div className={`font-semibold text-[13px] leading-snug ${isPaper ? 'text-slate-950' : 'text-slate-100'}`}>
          {str}
        </div>
        <div className="text-slate-400 text-xs font-mono">
          KM 131.420 to KM 209.500
        </div>
      </div>
    );
  };

  // Helper: Format Approved Window with bold emerald primary time and clean sub-pill duration
  const renderApprovedWindow = (windowVal, durationVal) => {
    let mainTime = windowVal || '10:00 - 14:00 IST';
    let subDuration = durationVal;

    const match = mainTime.match(/^(.*?)\s*(?:\((?:Duration:\s*)?(.*?)\))$/i);
    if (match) {
      mainTime = match[1].trim();
      if (!subDuration) subDuration = match[2].trim();
    }
    if (!subDuration) {
      subDuration = order.duration || '04h 00m (240 mins)';
    }
    subDuration = subDuration.replace(/^Duration:\s*/i, '').trim();

    return (
      <div className="space-y-1">
        <div className={`font-mono font-bold text-sm ${isPaper ? 'text-emerald-700' : 'text-emerald-400'}`}>
          {mainTime}
        </div>
        {subDuration && (
          <div className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono ${
            isPaper ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-800/60 text-slate-400 border border-slate-700/40'
          }`}>
            {subDuration}
          </div>
        )}
      </div>
    );
  };

  // Helper: Format Participating Departments as clean separate tags rather than a run-on line
  const renderParticipatingDepts = (deptsVal) => {
    let list = [];
    if (Array.isArray(deptsVal)) {
      list = deptsVal;
    } else if (typeof deptsVal === 'string') {
      list = deptsVal.split(/[,+•\n\/]+/).map((s) => s.trim()).filter(Boolean);
    }
    if (list.length === 0) {
      list = ['Civil (P-Way)', 'Electrical (TRD)', 'Signalling (S&T)'];
    }

    const getDeptStyle = (dept) => {
      const lower = dept.toLowerCase();
      if (lower.includes('civil') || lower.includes('p-way')) {
        return isPaper ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      }
      if (lower.includes('electrical') || lower.includes('trd') || lower.includes('ohe')) {
        return isPaper ? 'bg-pink-50 text-pink-800 border-pink-200' : 'bg-pink-500/10 text-pink-300 border-pink-500/20';
      }
      if (lower.includes('signalling') || lower.includes('s&t') || lower.includes('sig')) {
        return isPaper ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      }
      return isPaper ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    };

    return (
      <div className="flex flex-col gap-1 items-start">
        {list.map((dept, i) => (
          <span
            key={i}
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getDeptStyle(dept)}`}
          >
            {dept}
          </span>
        ))}
      </div>
    );
  };

  // Helper: Format Assets Deployed with clean visual bullet points
  const renderAssetsDeployed = (assetsVal) => {
    let list = [];
    if (Array.isArray(assetsVal)) {
      list = assetsVal;
    } else if (typeof assetsVal === 'string') {
      list = assetsVal
        .split(/(?:\s*\+\s*|;|\n|•|,\s*(?=[A-Z0-9]))/)
        .map((s) => s.replace(/^[•\-\*\s]+/, '').trim())
        .filter(Boolean);
      if (list.length <= 1 && assetsVal.includes(',')) {
        list = assetsVal.split(',').map((s) => s.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);
      }
    }
    if (list.length === 0) {
      list = [
        'CSM-09 Continuous Action Tamping Machine',
        'Tower Wagon (RU-843) 25kV OHE Inspection',
        'Point Machine Overhaul & Axle Counter Reset',
      ];
    }

    return (
      <div className="space-y-1 text-xs">
        {list.map((asset, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
            <span className={`leading-snug ${isPaper ? 'text-slate-800' : 'text-slate-200'}`}>
              {asset}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Helper: Format OHE Power State with distinct pill and padded descriptive label
  const renderOhePowerState = (oheVal) => {
    const str = oheVal || '25kV OHE Isolated & Earth-Bonded (Permit-to-Work PTW-771)';
    const isIsolated = /isolated|de-energized|permit-to-work|ptw/i.test(str);

    return (
      <div className="space-y-1.5">
        <div>
          <span
            className={`inline-block px-2 py-0.5 rounded font-bold border text-[10px] tracking-wide ${
              isIsolated
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isIsolated ? '25kV ISOLATED' : 'LIVE'}
          </span>
        </div>
        <div className={`text-xs pl-1 leading-relaxed ${isPaper ? 'text-slate-700' : 'text-slate-300'}`}>
          {str}
        </div>
      </div>
    );
  };

  return (
    <div id="printable-t351-circular" className="w-full space-y-3">
      {/* Top Document Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 print:hidden">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold tracking-wide uppercase">
            OFFICIAL SANCTION DOSSIER (FORM T/351)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">{order.controlOrderNo}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Paper vs Dark Slate View Toggle */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => onToggleViewMode('slate')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                !isPaper
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Dark Slate Console</span>
            </button>
            <button
              onClick={() => onToggleViewMode('paper')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                isPaper
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Official Paper Circular</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE OFFICIAL SANCTION ORDER DOCUMENT CONTAINER */}
      <div
        id="possession-circular-document"
        className={`print-possession-order relative rounded-2xl transition-all shadow-2xl overflow-hidden ${
          isPaper
            ? 'bg-[#fcfbf7] text-slate-900 border-2 border-slate-300 shadow-slate-900/10'
            : 'bg-slate-950/95 text-slate-100 border border-slate-800 shadow-black/80'
        } p-6 sm:p-10 font-sans`}
      >
        {/* Subtle Railway Emblem Background Watermark */}
        <div className="watermark-emblem absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
          <svg data-watermark="true" viewBox="0 0 100 100" className="w-[520px] h-[520px] fill-current">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Faded Watermark Stamp: Subtle Opacity [0.03], Blend Mode & z-0 */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0 opacity-[0.03]">
          {order.watermark === 'SANCTIONED & TRANSMITTED' ? (
            <div className="rotate-[-18deg] border-4 border-emerald-500 text-emerald-400 font-mono font-black text-3xl md:text-5xl tracking-widest px-8 py-4 rounded-xl uppercase text-center border-dashed mix-blend-overlay">
              SANCTIONED & TRANSMITTED<br />
              <span className="text-xl md:text-2xl tracking-normal opacity-80">LEGAL E-CIRCULAR IN EFFECT</span>
            </div>
          ) : (
            <div className="rotate-[-18deg] border-4 border-amber-500 text-amber-400 font-mono font-black text-3xl md:text-5xl tracking-widest px-8 py-4 rounded-xl uppercase text-center border-dashed mix-blend-overlay">
              AI GENERATED DRAFT<br />
              <span className="text-xl md:text-2xl tracking-normal opacity-80">PENDING CONTROLLER SANCTION</span>
            </div>
          )}
        </div>

        {/* 1. OFFICIAL GOVERNMENT HEADER */}
        <div className={`relative z-10 pb-6 border-b ${isPaper ? 'border-slate-800/80' : 'border-slate-800'}`}>
          {/* Government of India / Ashoka Capital / Indian Railways Branding */}
          <div className="text-center space-y-1">
            <div className="header-logo flex items-center justify-center gap-2 mb-1.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isPaper ? 'border-slate-800 text-slate-900' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'}`}>
                <Shield className="w-5 h-5 national-crest" />
              </div>
            </div>

            <div className={`text-[11px] font-bold tracking-widest uppercase font-mono ${isPaper ? 'text-slate-700' : 'text-slate-400'}`}>
              भारत सरकार • GOVERNMENT OF INDIA / रेल मंत्रालय • MINISTRY OF RAILWAYS
            </div>

            <h1 className={`doc-title text-lg sm:text-2xl font-black uppercase tracking-tight ${isPaper ? 'text-slate-950' : 'text-white'}`}>
              {order.railway || 'NORTH CENTRAL RAILWAY — PRAYAGRAJ DIVISION (OPERATING BRANCH)'}
            </h1>

            <div className={`text-xs font-mono font-bold tracking-wider uppercase ${isPaper ? 'text-slate-800' : 'text-amber-400'}`}>
              DIVISIONAL CONTROL OFFICE / PRYJ
            </div>

            {/* Form Identifier Stamp */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded font-mono text-xs font-black tracking-wider uppercase border ${
                isPaper
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                FORM T/351 (SR 15.06)
              </span>
              <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                isPaper ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                JOINT E-CIRCULAR SANCTION ORDER
              </span>
            </div>

            <div className={`text-sm sm:text-base font-extrabold uppercase mt-2 ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
              {order.fullOrderTitle || 'Joint Engineering, Electrical (TRD) & S&T Power/Traffic Block Sanction Order'}
            </div>
          </div>

          {/* Document Reference Metadata Strip with Header Status Badge */}
          <div className={`mt-5 p-3.5 rounded-xl border font-mono text-xs grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center ${
            isPaper ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}>
            <div>
              <span className="text-slate-500 uppercase">CONTROL ORDER NO:</span>{' '}
              <strong className={isPaper ? 'text-slate-950 font-mono font-bold' : 'text-amber-400 font-mono font-bold'}>
                {order.controlOrderNo || 'NCR/PRYJ/OPTG/BLK/2026/0920/T351'}
              </strong>
            </div>
            <div className="md:text-center">
              <span className="text-slate-500 uppercase">DATE & TIME:</span>{' '}
              <strong>{order.date || '20-09-2026'} | {order.time || '11:47:45 IST'}</strong>
            </div>
            <div className="md:text-right flex md:justify-end items-center">
              {order.watermark === 'SANCTIONED & TRANSMITTED' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Sanctioned & Transmitted • In Effect
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  AI Draft • Pending Controller Sanction
                </div>
              )}
            </div>
            <div className="md:col-span-3 pt-1 border-t border-dashed border-slate-300 dark:border-slate-800">
              <span className="text-slate-500 uppercase">ADDRESSED TO:</span>{' '}
              <strong className={isPaper ? 'text-slate-900' : 'text-slate-200'}>
                {order.addressedTo || 'Sr. DOM, Sr. DEN (Co-ord), Sr. DEE (TRD), Sr. DSTE, Station Directors (Aligarh / Tundla)'}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. PLAIN-LANGUAGE AI OPTIMIZATION NOTICE */}
        <div className={`relative z-10 my-5 p-4 rounded-xl border ${
          isPaper
            ? 'bg-blue-50/70 border-blue-200 text-blue-950'
            : 'bg-blue-950/20 border-blue-500/30 text-blue-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                AI OPTIMIZATION NOTICE (CP-SAT SOLVER V3.2)
              </div>
              <p className="font-sans text-xs sm:text-sm leading-relaxed">
                {order.plainSummary || (
                  order.scenarioType === 'SAME_TRACK'
                    ? 'AI OPTIMIZATION NOTICE: Multiple maintenance requisitions (Civil Track Tamping & Electrical OHE Inspection) have been detected for Track 2 (DN Main Line). To prevent dual line closures, the AI Engine has bundled these operations into a single Joint Shadow Block from 13:00 to 15:30 hrs. Net line occupancy reduced from 330 mins to 150 mins with zero headway disruption.'
                    : 'AI OPTIMIZATION NOTICE: Distinct maintenance activities on Track 1 (Civil Rail Flaw Scan) and Track 4 (S&T Point Machine Overhaul) have been scheduled with staggered time windows to maintain bi-directional mainline throughput.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 3. STRUCTURED 5-COLUMN TABULAR SCHEDULE */}
        <div className="relative z-10 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`font-mono text-xs sm:text-sm font-black uppercase tracking-wider ${isPaper ? 'text-slate-900' : 'text-amber-400'}`}>
              SECTION I: SANCTIONED POSSESSION SCHEDULE & ASSET DEPLOYMENT
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
              isPaper ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              CP-SAT CONFLICT-FREE
            </span>
          </div>

          {/* Table Wrapper with Crisp Contrast & Backdrop Blur */}
          <div className={`overflow-x-auto rounded-xl border relative z-10 ${
            isPaper
              ? 'bg-white/80 border-slate-300 shadow-sm'
              : 'bg-slate-900/40 border-slate-800 backdrop-blur-[2px] shadow-inner'
          }`}>
            <table className={`w-full text-left font-mono text-[13px] leading-relaxed border-collapse ${isPaper ? 'text-slate-800' : 'text-slate-200'}`}>
              <thead>
                <tr className={`border-b ${isPaper ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-700 bg-slate-900/90 text-slate-300'} text-[11px] uppercase tracking-wider`}>
                  <th className="py-3 px-3.5 border-r border-slate-300 dark:border-slate-800 font-bold">Track Section</th>
                  <th className="py-3 px-3.5 border-r border-slate-300 dark:border-slate-800 font-bold">Approved Window</th>
                  <th className="py-3 px-3.5 border-r border-slate-300 dark:border-slate-800 font-bold">Participating Depts</th>
                  <th className="py-3 px-3.5 border-r border-slate-300 dark:border-slate-800 font-bold">Assets Deployed</th>
                  <th className="py-3 px-3.5 font-bold">OHE Power State</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isPaper ? 'divide-slate-200' : 'divide-slate-800/80'}`}>
                {order.structuredSchedule && order.structuredSchedule.length > 0 ? (
                  order.structuredSchedule.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? (isPaper ? 'bg-slate-50/50' : 'bg-slate-900/30') : ''}>
                      <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                        {renderTrackSection(row.trackSection)}
                      </td>
                      <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 whitespace-nowrap align-top">
                        {renderApprovedWindow(row.approvedWindow, row.duration)}
                      </td>
                      <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                        {renderParticipatingDepts(row.participatingDepts)}
                      </td>
                      <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                        {renderAssetsDeployed(row.assetsDeployed)}
                      </td>
                      <td className="py-3.5 px-3.5 align-top">
                        {renderOhePowerState(row.ohePowerState)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                      {renderTrackSection(order.trackSection || 'Track 2: DN Main (KM 131.420 to KM 209.500)')}
                    </td>
                    <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 whitespace-nowrap align-top">
                      {renderApprovedWindow(order.approvedWindow || '10:00 - 14:00 IST', order.duration || '04h 00m (240 mins)')}
                    </td>
                    <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                      {renderParticipatingDepts(order.participatingDepts || 'Civil (P-Way), Electrical (TRD), Signalling (S&T)')}
                    </td>
                    <td className="py-3.5 px-3.5 border-r border-slate-300 dark:border-slate-800 align-top">
                      {renderAssetsDeployed(order.assetsDeployed || '• CSM-09 Continuous Action Tamping Machine, • Tower Wagon (RU-843) 25kV OHE Inspection, • Point Machine Overhaul & Axle Counter Reset')}
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      {renderOhePowerState(order.ohePowerState || '25kV OHE Isolated & Earth-Bonded (Permit-to-Work PTW-771)')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DOMAIN SAFETY COMPATIBILITY MATRIX CHECK */}
        {order.safetySequence && order.safetySequence.length > 0 && (
          <div className={`relative z-10 p-4 rounded-xl border font-mono text-xs space-y-3 ${
            isPaper
              ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
              : 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  DOMAIN SAFETY COMPATIBILITY & CO-WORKING SEQUENCE
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 text-[10px] font-black tracking-wide">
                {order.safetyStatus || 'SAFETY COMPATIBILITY: VERIFIED & COMPLIANT'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              {order.safetySequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    isPaper
                      ? 'bg-white/90 border-emerald-200 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                      STEP {item.step || idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{item.time}</span>
                  </div>
                  {item.phase && (
                    <div className="text-[11px] font-bold text-amber-500 dark:text-amber-400 mb-1">
                      {item.phase}
                    </div>
                  )}
                  <p className="text-[11px] leading-relaxed font-sans text-slate-600 dark:text-slate-300">
                    {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. OPERATING & TRAIN REGULATION PLAN (THE BYPASS MANDATE) */}
        <div className={`mandate-box relative z-10 py-5 border-y ${
          isPaper ? 'border-slate-300 bg-amber-50/50' : 'border-slate-800 bg-slate-900/40 backdrop-blur-[2px]'
        } p-5 rounded-xl space-y-4 font-mono text-xs`}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider">
              MANDATE
            </span>
            <h3 className={`font-black uppercase tracking-wider text-xs sm:text-sm ${isPaper ? 'text-slate-900' : 'text-amber-400'}`}>
              SECTION II: OPERATING & TRAIN REGULATION PLAN (THE BYPASS MANDATE)
            </h3>
          </div>

          {/* Main Quote Box: Increased line-height, text color text-amber-200/90, with slight inner padding p-4 */}
          {order.regulationMandate && (
            <div className={`p-4 rounded-xl border text-xs sm:text-[13px] font-semibold leading-relaxed ${
              isPaper
                ? 'border-amber-400 bg-amber-100/70 text-slate-900'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-200/90'
            }`}>
              &ldquo;{order.regulationMandate}&rdquo;
            </div>
          )}

          {/* Numbered Directives (1 to 4): High-contrast labels, clean vertical breathing room */}
          <div className="space-y-3 pt-1">
            {/* Directive 1 */}
            <div className="flex items-start gap-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div className="text-[12px] sm:text-[13px] leading-relaxed">
                <span className={`font-bold tracking-wide uppercase ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
                  CORRIDOR OCCUPANCY DECLARATION:{' '}
                </span>
                <span className={isPaper ? 'text-slate-800' : 'text-slate-300'}>
                  {order.trackSection || order.sanctionedSection || order.structuredSchedule?.[0]?.trackSection || 'Track 2 DN Main (KM 131.420 to KM 209.500)'} declared{' '}
                  <span className="text-rose-400 font-bold underline decoration-rose-500/60">
                    DEAD FOR ALL TRAFFIC
                  </span>{' '}
                  from {order.startHour || (order.approvedWindow ? order.approvedWindow.split(' ')[0] : '10:00')} to{' '}
                  {order.endHour || (order.approvedWindow ? order.approvedWindow.split(' ')[2] : '14:00')} hrs.
                </span>
              </div>
            </div>

            {/* Directive 2 */}
            <div className="flex items-start gap-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div className="text-[12px] sm:text-[13px] leading-relaxed">
                <span className={`font-bold tracking-wide uppercase ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
                  DYNAMIC BYPASS DIVERSION:{' '}
                </span>
                <span className={isPaper ? 'text-slate-800' : 'text-slate-300'}>
                  {order.bypassRoute || 'Down traffic diverted via Turnout SW #4/#5 onto Track 4 (DN Loop) under TSR 30 km/h.'}
                </span>
              </div>
            </div>

            {/* Directive 3 */}
            <div className="flex items-start gap-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div className="text-[12px] sm:text-[13px] leading-relaxed">
                <span className={`font-bold tracking-wide uppercase ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
                  STATION MASTER SAFETY VERIFICATION:{' '}
                </span>
                <span className={isPaper ? 'text-slate-800' : 'text-slate-300'}>
                  Tundla & Aligarh to ensure point clamp & padlock safety verification before diversion, and transmit physical clamp confirmation code to Divisional Central Control.
                </span>
              </div>
            </div>

            {/* Directive 4 */}
            <div className="flex items-start gap-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                4
              </span>
              <div className="text-[12px] sm:text-[13px] leading-relaxed">
                <span className={`font-bold tracking-wide uppercase ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
                  SIGNALLING & KAVACH INTERLOCKING:{' '}
                </span>
                <span className={isPaper ? 'text-slate-800' : 'text-slate-300'}>
                  Home Signal 14-D set to Yellow-over-Yellow (Caution-Divergence); Kavach RFID speed profile auto-synced to 30 km/h.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. OFFICIAL DISTRIBUTION LIST (COPY TO) - CLEAN 2-COLUMN MICRO-GRID */}
        <div className={`relative z-10 py-4 space-y-2.5 border-t border-dashed ${isPaper ? 'border-slate-300' : 'border-slate-800'} font-mono`}>
          <div className={`font-bold uppercase tracking-wider text-[11px] ${isPaper ? 'text-slate-700' : 'text-slate-300'}`}>
            COPY TRANSMITTED FOR COMPLIANCE & RECORD:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">1.</span>
              <span>Sr. DOM / PRYJ (Operating Control)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">4.</span>
              <span>Sr. DSTE / PRYJ (Signalling & Kavach)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">2.</span>
              <span>Sr. DEN (Co-ord) / PRYJ (Civil Engg)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">5.</span>
              <span>Chief Controller (PRYJ Division)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">3.</span>
              <span>Sr. DEE (TRD) / PRYJ (Traction Grid)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">6.</span>
              <span>Station Master / Tundla & Aligarh</span>
            </div>
          </div>
        </div>

        {/* 5. SIGN-OFF & CRYPTOGRAPHIC VERIFICATION STAMP */}
        <div className={`relative z-10 pt-5 mt-3 border-t ${isPaper ? 'border-slate-800' : 'border-slate-800'} flex flex-col md:flex-row items-start md:items-end justify-between gap-4`}>
          {/* Cryptographic SHA-256 Hash Badge */}
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-500">
              <QrCode className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC SHA-256 VERIFICATION DIGEST:</span>
            </div>
            <div className="flex items-center gap-2">
              <code className={`px-2 py-1 rounded text-[10px] font-bold ${
                isPaper ? 'bg-slate-200 text-slate-900' : 'bg-slate-900 text-emerald-400 border border-slate-800'
              }`}>
                {order.sha256 || '8A72F6B109DC344E9B1F524A7599201C8817D59A083765103E48C9A23E09D3E1'}
              </code>
              <button
                onClick={handleCopyHash}
                title="Copy Hash"
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors print:hidden"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-slate-400 text-[9px]">
              CRIS Central Server Key: NCR-PRYJ-2026-FOIS-SIL4
            </div>
          </div>

          {/* Executive Digital Signature Badge */}
          <div className="flex flex-col items-start md:items-end space-y-1 font-mono">
            {/* Stamp / Status */}
            <div className="flex items-center gap-2">
              {isTransmitted ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 text-[11px] font-black tracking-wider flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  STATUS: TRANSMITTED (ACTIVE BLOCK IN EFFECT)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/50 text-[11px] font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  STATUS: READY FOR TRANSMISSION (CRIS / Sr. DOM)
                </span>
              )}
            </div>

            {/* Official Signature Box */}
            <div className={`mt-2 p-3 rounded-xl border text-right ${
              isPaper ? 'border-slate-800 bg-slate-50 text-slate-900' : 'border-slate-800 bg-slate-900/90 text-white'
            }`}>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                DIGITALLY VERIFIED & SIGNED ELECTRONICALLY
              </div>
              <div className="text-xs font-black text-amber-500 dark:text-amber-400 font-mono tracking-tight mt-0.5">
                CHIEF CONTROLLER (PRYJ DIVISION)
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Sr. Divisional Operations Manager (Sr. DOM)
              </div>
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-bold">
                ✓ AUTHENTICATED VIA RAILWAY PKI INFRASTRUCTURE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
