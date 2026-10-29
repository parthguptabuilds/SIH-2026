import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Zap, Radio, Clock, AlertTriangle, Send, CheckCircle2, Shield, Calendar, Layers, Check, LogOut } from 'lucide-react';
import { useSimulation, ROLE_INFO } from '../../context/SimulationContext';

export const DepartmentConsole = () => {
  const { currentRole, currentRoleInfo, submitRequisition, requisitions, logoutToGateway } = useSimulation();

  // Normalize active department key: 'civil' | 'trd' | 'st'
  const activeDeptKey = (currentRole || 'civil').toLowerCase();
  const info = currentRoleInfo || ROLE_INFO[activeDeptKey] || ROLE_INFO.civil;

  // Department specific task catalog
  const taskCatalog = {
    civil: [
      { id: 'CSM-09', name: 'CSM-09 Continuous Action Tamping Machine' },
      { id: 'BCM-350', name: 'BCM-350 High-Output Ballast Cleaning Machine' },
      { id: 'RAIL-REP', name: '60kg Continuous Welded Rail (CWR) Replacement' },
      { id: 'USFD', name: 'Ultrasonic Rail Flaw Testing (USFD Trolley)' },
      { id: 'TURNOUT-TAMPER', name: 'Unimat 08-4S Turnout Tamping Machine' }
    ],
    trd: [
      { id: 'RU-843', name: 'Tower Wagon (RU-843) 25kV Catenary Renewal' },
      { id: 'OHE-INSPECT', name: 'High-Speed OHE Contact Wire Profile Scanner' },
      { id: 'ISOLATOR', name: 'Substation Feeder F-04 25kV Isolator Maintenance' },
      { id: 'TENSION', name: 'Auto-Tensioning Device (ATD) Pulley Calibration' },
      { id: 'INSULATOR-WASH', name: 'Live-Line Porcelain Insulator High-Pressure Wash' }
    ],
    st: [
      { id: 'POINT-14B', name: 'Point Machine 14B Overhaul & Slide Detection' },
      { id: 'AXLE-RESET', name: 'Multi-Section Digital Axle Counter (MSDAC) Reset' },
      { id: 'EI-RACK-B', name: 'Electronic Interlocking (EI) Logic Card Replacement' },
      { id: 'KAVACH-BALISE', name: 'Kavach RFID Track Balise Safety Distance Tuning' },
      { id: 'AUTO-SIGNAL', name: '4-Aspect LED Signal Head & Lamp Checking Unit' }
    ]
  };

  const currentTasks = taskCatalog[activeDeptKey] || taskCatalog.civil;

  // Form State
  const [track, setTrack] = useState('Track 2 (DN Main)');
  const [trackId, setTrackId] = useState('track2');
  const [asset, setAsset] = useState(currentTasks[0]?.name || 'Routine Machine Inspection');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('13:00');
  const [priority, setPriority] = useState('HIGH');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submissionSuccessId, setSubmissionSuccessId] = useState(null);

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const handleTrackChange = (e) => {
    const val = e.target.value;
    setTrack(val);
    if (val.includes('Track 1')) setTrackId('track1');
    else if (val.includes('Track 2')) setTrackId('track2');
    else if (val.includes('Track 3')) setTrackId('track3');
    else setTrackId('track4');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);

    // Time validations
    if (endMin <= startMin) {
      setValidationError('Validation Error: Block End Time must be later than Start Time.');
      return;
    }

    const duration = endMin - startMin;
    if (duration < 30) {
      setValidationError('Validation Error: Minimum railway block duration is 30 minutes.');
      return;
    }

    if (duration > 480) {
      setValidationError('Validation Error: Single continuous block cannot exceed 8 hours. Please split into multiple phases.');
      return;
    }

    const newId = submitRequisition({
      dept: activeDeptKey,
      deptCode: info.code || activeDeptKey.toUpperCase(),
      deptName: info.name,
      track,
      trackId,
      asset,
      startTime,
      endTime,
      durationMinutes: duration,
      priority,
      notes: notes || `Standard ${info.name} possession requisition on ${track}.`,
    });

    setSubmissionSuccessId(newId);
  };

  // Filter department's own requisitions
  const myRequisitions = (requisitions || []).filter(
    r => (r.dept || '').toLowerCase() === activeDeptKey
  );

  return (
    <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Department Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="p-3.5 rounded-2xl shrink-0"
            style={{
              backgroundColor: `${info.color}15`,
              color: info.color,
              border: `1px solid ${info.color}40`
            }}
          >
            {activeDeptKey === 'civil' && <Hammer className="w-8 h-8" />}
            {activeDeptKey === 'trd' && <Zap className="w-8 h-8" />}
            {activeDeptKey === 'st' && <Radio className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {info.badge || 'DEPARTMENTAL DESK'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {info.division || 'Prayagraj Division, NCR'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {info.name} Requisition Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Submit formalized line possession demands directly into the CP-SAT shadow optimizer queue.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            MY REQUISITIONS: <strong className="text-white">{myRequisitions.length}</strong>
          </div>
          <button
            onClick={logoutToGateway}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white flex items-center gap-1.5 transition-colors font-bold"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Role / Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Requisition Submission Form (7 cols) */}
        <div id="requisition-form" className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <Send className="w-4 h-4 text-amber-400" />
              RAISE NEW TRACK BLOCK REQUISITION
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              FORM: IR-OPT-1506
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Track Section Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                Target Track Section
              </label>
              <select
                value={track}
                onChange={handleTrackChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Track 1 (UP Main)">Track 1 (UP Main Line: CNB ➔ PRYJ)</option>
                <option value="Track 2 (DN Main)">Track 2 (DN Main Line: PRYJ ➔ CNB - Priority Candidate)</option>
                <option value="Track 3 (UP Loop)">Track 3 (UP Loop Line)</option>
                <option value="Track 4 (DN Loop)">Track 4 (DN Loop Line / Bypass Route)</option>
              </select>
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                Corridor Limits: PRYJ Junction MP 640.200 to Subedarganj MP 645.800
              </span>
            </div>

            {/* Department Specific Asset / Task */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                Department Task / Maintenance Asset
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
              >
                {currentTasks.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Window (Start & End Time with Validation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                  Block Start Time (24-Hour)
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                  Block End Time (24-Hour)
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                Requisition Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ROUTINE', label: 'Routine', desc: 'Pre-scheduled maintenance' },
                  { id: 'HIGH', label: 'High Priority', desc: 'Asset condition alert' },
                  { id: 'CRITICAL', label: 'Critical / Safety', desc: 'Emergency defect' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`p-3 rounded-xl border text-left font-mono transition-all ${
                      priority === p.id
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{p.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Justification / Notes */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
                Technical Justification & Track Details
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify kilometer limits, machine operator details, or speed restriction requirements..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT REQUISITION TO CHIEF CONTROLLER</span>
            </button>
          </form>
        </div>

        {/* Right Col: Active Department Requisitions Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                DEPARTMENT DISPATCH QUEUE
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {myRequisitions.length} ITEMS
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {myRequisitions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono text-xs">
                  No active requisitions submitted yet. Use the form to raise a new block.
                </div>
              ) : (
                myRequisitions.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          req.status === 'Shadow Merged'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : req.status === 'Shadow Merged & Locked'
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white mb-1">
                      {req.asset}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {req.track} • {req.startTime} - {req.endTime} ({req.durationMinutes}m)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 line-clamp-1">
                      {req.notes}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Success Dialog */}
      <AnimatePresence>
        {submissionSuccessId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Requisition Transmitted Successfully!
              </h3>
              <div className="my-3 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                <span className="text-slate-400">TRACKING IDENTIFIER:</span>
                <div className="text-lg font-bold text-amber-400 mt-0.5">
                  {submissionSuccessId}
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-6 font-sans">
                This requisition has been streamed in real-time to the <strong>Chief Controller / Sr. DOM</strong> desk for CP-SAT Shadow Mega Block optimization.
              </p>
              <button
                onClick={() => setSubmissionSuccessId(null)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors"
              >
                Close & Return
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
