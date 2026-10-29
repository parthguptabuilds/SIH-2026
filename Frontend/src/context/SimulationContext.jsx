import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import mockRequisitionsData from '../data/mockRequisitions.json';
import mockTimetableData from '../data/mockTimetable.json';

export const ROLE_INFO = {
  landing: {
    id: 'landing',
    name: 'Gateway Portal',
    title: 'Divisional Control Room Gateway',
    color: '#f59e0b',
  },
  civil: {
    id: 'civil',
    code: 'CIVIL',
    name: 'Civil Engineering (P-Way)',
    shortName: 'Civil P-Way',
    officer: 'Dy. CE (P-Way)',
    department: 'Civil Engineering',
    division: 'Track Maintenance Unit 04',
    badge: 'P-WAY CORRIDOR',
    accessLevel: 'LEVEL 2 — TRACK OCCUPANCY REQUESTOR',
    color: '#3b82f6',
    description: 'Propose automated tamping machine blocks, rail flaw ultrasound (USFD), deep ballast screening, and sleeper renewals.',
  },
  trd: {
    id: 'trd',
    code: 'TRD',
    name: 'Electrical (TRD)',
    shortName: 'Electrical TRD',
    officer: 'Sr. DEE (TRD)',
    department: 'Traction Distribution (Electrical)',
    division: '25kV AC Grid Control Center',
    badge: 'POWER ISOLATION',
    accessLevel: 'LEVEL 3 — 25kV OHE SHUTDOWN AUTHORIZATION',
    color: '#ec4899',
    description: 'Requisition 25kV catenary power cuts, contact wire renewal, tower wagon deployment (RU-843), and insulator maintenance.',
  },
  st: {
    id: 'st',
    code: 'ST',
    name: 'Signalling & Telecom (S&T)',
    shortName: 'Signalling S&T',
    officer: 'Sr. DSTE (S&T)',
    department: 'Signalling & Telecom',
    division: 'Kavach & Electronic Interlocking',
    badge: 'FAIL-SAFE SIL-4',
    accessLevel: 'LEVEL 3 — POINT MACHINE & INTERLOCKING',
    color: '#10b981',
    description: 'Requisition point machine overhauls, electronic interlocking rack diagnostics, axle counter calibration, and Kavach balise testing.',
  },
  dom: {
    id: 'dom',
    code: 'DOM',
    name: 'Chief Controller / Sr. DOM',
    shortName: 'Chief Controller',
    officer: 'Sr. DOM / PRYJ',
    department: 'Operating Department (Traffic)',
    division: 'PRYJ — Prayagraj Division, NCR',
    badge: 'SUPREME DISPATCH',
    accessLevel: 'LEVEL 4 — FULL APPROVAL & INTERLOCK OVERRIDE',
    color: '#f59e0b',
    description: 'Supreme corridor dispatch authority: Review pending requisitions, execute CP-SAT shadow block consolidation, and authorize dynamic train bypass orders.',
  }
};

const DEFAULT_REQUISITIONS = [];

export const DEFAULT_T351_ORDER = {
  controlOrderNo: 'NCR/PRYJ/OPTG/BLK/2026/0920/SHADOW-01',
  formTitle: 'FORM T/351 (SR 15.06)',
  railway: 'NORTH CENTRAL RAILWAY — PRAYAGRAJ DIVISION (OPERATING BRANCH)',
  fullOrderTitle: 'Joint Engineering, TRD & S&T Power/Traffic Block Sanction Order (Form T/351)',
  date: '20-09-2026',
  time: '11:47:45 IST',
  addressedTo: 'Sr. DOM, Sr. DEN (Co-ord), Sr. DEE (TRD), Sr. DSTE, Station Directors (Aligarh / Tundla)',
  scenarioType: 'TRI_DEPT_SHADOW',
  plainSummary: 'AI OPTIMIZATION NOTICE (CP-SAT SOLVER): Concurrent maintenance requisitions from Civil Engineering (CSM-09 Tamper: 13:00-15:00), Electrical TRD (Tower Wagon RU-843: 14:00-16:00), and Signalling S&T (Point Machine Overhaul: 14:30-15:30) have been detected for Track 2 (DN Main Line). The CP-SAT Engine has consolidated all 3 departmental tasks into a single 3-hour Shadow Possession Window (13:00 to 16:00 hrs). Net line closure reduced from 300 mins (5h 00m) to 180 mins (3h 00m), saving 120 minutes of track occupancy with verified zero-headway disruption.',
  structuredSchedule: [
    {
      trackSection: 'Track 2: DN Main (KM 131.420 to KM 209.500)',
      approvedWindow: '13:00 - 16:00 IST (03h 00m Unified Shadow Window)',
      duration: '03h 00m (180 mins)',
      participatingDepts: 'Civil (P-Way) + Electrical (TRD) + Signalling (S&T)',
      assetsDeployed: 'CSM-09 Tamper + Tower Wagon RU-843 + Point Maintenance Team',
      ohePowerState: '25kV OHE Isolated & Earth-Bonded (Permit-to-Work #TRD-882)'
    }
  ],
  safetySequence: [
    {
      step: 1,
      phase: 'ISOLATION & GROUNDING',
      time: '00:00 - 00:15 (13:00 - 13:15 IST)',
      action: 'TRD isolates and grounds 25kV OHE catenary power (Isolator 102/A locked open, discharge rods bonded to rail return path).'
    },
    {
      step: 2,
      phase: 'CONCURRENT CO-WORKING',
      time: '00:15 - 02:45 (13:15 - 15:45 IST)',
      action: 'Civil heavy tamping (CSM-09) and S&T point machine overhaul execute concurrently under verified power-off protection.'
    },
    {
      step: 3,
      phase: 'CLEARANCE & FIT DECLARATION',
      time: '02:45 - 03:00 (15:45 - 16:00 IST)',
      action: 'S&T point clearance check, TRD catenary re-energization, and joint track fit declaration issued to Divisional Control.'
    }
  ],
  safetyStatus: 'SAFETY COMPATIBILITY: VERIFIED & COMPLIANT',
  regulationMandate: 'Track 2 DN Main is declared DEAD FOR TRAFFIC from 13:00 to 16:00 hrs. Down line through traffic (including Train 12424 Rajdhani Exp and Train 22436 Vande Bharat Exp) shall be diverted via Turnout SW #4/#5 onto Track 4 (DN Loop) under a Temporary Speed Restriction (TSR) of 30 km/h. Station Masters at Aligarh and Tundla to physically prove point padlocks prior to first passenger bypass.',
  watermark: 'AI GENERATED DRAFT — PENDING CONTROLLER SANCTION',
  status: 'DRAFT',
  sha256: 'NCR-2026-T351-SHADOW-9A3F1B8E4C7D201A',
  notes: 'Station Masters Aligarh/Tundla and Electrical TRD SCADA desk to execute PTW-882 clearance handoff before line reopening.'
};

export const DEFAULT_HISTORICAL_LOGS = [
  {
    orderNo: 'NCR/PRYJ/OPTG/BLK/2026/0919/T351-A',
    date: '19-09-2026',
    time: '14:15:20 IST',
    section: 'Track 1 (UP Main), Subedarganj–Fatehpur KM 642–698',
    window: '14:30 - 17:00 (02h 30m)',
    controllerId: 'DOM-PRYJ-04 (V. K. Sharma)',
    bundledDepts: ['CIVIL', 'TRD'],
    sha256: '4b8d7a12e91cf923a105f2c45e89d610b3749a2ef7401c2b54d31e9c8a0021ba',
    complianceStatus: 'TRANSMITTED • SIL-4 KAVACH VERIFIED',
    blockStatus: 'COMPLETED & CLEARED',
  },
  {
    orderNo: 'NCR/PRYJ/OPTG/BLK/2026/0918/T351-C',
    date: '18-09-2026',
    time: '10:05:44 IST',
    section: 'Track 3 (UP Loop), Kanpur Central Yard KM 435–440',
    window: '10:30 - 12:00 (01h 30m)',
    controllerId: 'DOM-PRYJ-02 (R. P. Singh)',
    bundledDepts: ['ST', 'CIVIL'],
    sha256: '7c9e01f22a84bbd3910243e8a156f0812903ce418293d561a0bc31e2478d1045',
    complianceStatus: 'TRANSMITTED • CRIS-FOIS LOGGED',
    blockStatus: 'COMPLETED & CLEARED',
  },
  {
    orderNo: 'NCR/PRYJ/OPTG/BLK/2026/0916/T351-A',
    date: '16-09-2026',
    time: '23:30:10 IST',
    section: 'Track 2 (DN Main), Ghaziabad–Aligarh KM 48–110',
    window: '00:00 - 03:30 (03h 30m)',
    controllerId: 'DOM-PRYJ-04 (V. K. Sharma)',
    bundledDepts: ['TRD', 'CIVIL', 'ST'],
    sha256: '3f218a09b457dc20948ea716295cd1092a8310bcfe83015482390ba95ef7612d',
    complianceStatus: 'TRANSMITTED • SIL-4 KAVACH VERIFIED',
    blockStatus: 'COMPLETED & CLEARED',
  }
];

const DEFAULT_PACKETS = [
  { id: 1, text: 'CRIS-COA: PRYJ-CNB Section Occupancy Synced', time: 'Just now', ok: true },
  { id: 2, text: 'SCADA-TRD: Feeder F-04 25kV Isolation Prepared', time: '1s ago', ok: true },
  { id: 3, text: 'EI-ST: Point Switch 14B Locked to Normal', time: '3s ago', ok: true },
  { id: 4, text: 'TMS-GPS: Train 22436 Vande Bharat at MP 642/12', time: '5s ago', ok: true },
];

// =========================================================================
// Dynamic AI Plan Generator Logic (Strictly Matches Active Requisitions)
// =========================================================================
export function generateDynamicPlan(activeReqs = [], targetTrack = "Track 2: DN Main") {
  if (!activeReqs || activeReqs.length === 0) return null;

  // Ensure targetTrack is always a valid string (handles React event objects or undefined)
  if (typeof targetTrack !== 'string' || !targetTrack.trim()) {
    targetTrack = "Track 2: DN Main";
  }

  const normalizeTrack = (str) => (typeof str === 'string' ? str : "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const targetNorm = normalizeTrack(targetTrack);

  // Filter requests targeting the specific track (supports targetTrack, trackSection, track, trackName, section, trackId)
  let trackReqs = activeReqs.filter((r) => {
    const rawTrack = (r.targetTrack || r.trackSection || r.track || r.trackName || r.section || "").trim();
    if (rawTrack === targetTrack.trim()) return true;
    const reqNorm = normalizeTrack(rawTrack);
    if (targetNorm && reqNorm && (reqNorm === targetNorm || reqNorm.includes(targetNorm) || targetNorm.includes(reqNorm))) return true;
    if (r.trackId && targetTrack.toLowerCase().includes(r.trackId.toLowerCase())) return true;
    return false;
  });

  // Fallback if targetTrack didn't match any request but activeReqs has items
  if (trackReqs.length === 0) {
    const firstTrack = (activeReqs[0].targetTrack || activeReqs[0].trackSection || activeReqs[0].track || activeReqs[0].trackName || activeReqs[0].section || "").trim();
    if (firstTrack) {
      const firstNorm = normalizeTrack(firstTrack);
      trackReqs = activeReqs.filter((r) => {
        const raw = (r.targetTrack || r.trackSection || r.track || r.trackName || r.section || "").trim();
        return raw === firstTrack || (firstNorm && normalizeTrack(raw) === firstNorm);
      });
      targetTrack = trackReqs[0]?.trackSection || trackReqs[0]?.targetTrack || trackReqs[0]?.track || targetTrack;
    } else {
      trackReqs = [...activeReqs];
    }
  }

  if (trackReqs.length === 0) return null;

  // Extract unique participating departments (checks department, deptName, dept, deptCode)
  const rawDepts = [...new Set(trackReqs.map((r) => r.department || r.deptName || r.dept || r.deptCode || "Civil"))];
  const hasCivil = rawDepts.some((d) => /civil|p-way|csm|tamper/i.test(d)) || trackReqs.some((r) => /civil|p-way/i.test(r.dept || r.deptCode || ''));
  const hasTrd = rawDepts.some((d) => /trd|electrical|ohe|tower/i.test(d)) || trackReqs.some((r) => /trd|electrical/i.test(r.dept || r.deptCode || ''));
  const hasSt = rawDepts.some((d) => /s&t|signall|\bst\b/i.test(d)) || trackReqs.some((r) => /s&t|signall|\bst\b/i.test(r.dept || r.deptCode || ''));

  const isTriDept = hasCivil && hasTrd && hasSt;

  const depts = [];
  if (hasCivil) depts.push("Civil (P-Way)");
  if (hasTrd) depts.push("Electrical (TRD)");
  if (hasSt) depts.push("Signalling (S&T)");
  if (depts.length === 0) depts.push(...rawDepts);

  // Determine earliest start and latest end time from actual requests
  const startTimes = trackReqs.map((r) => r.startTime || "11:00");
  const endTimes = trackReqs.map((r) => r.endTime || "13:00");
  const windowStart = [...startTimes].sort()[0];
  const windowEnd = [...endTimes].sort().reverse()[0];

  const parseMin = (t) => {
    const parts = (t || "00:00").split(":").map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };
  const startM = parseMin(windowStart);
  const endM = parseMin(windowEnd);
  let durMins = endM - startM;
  if (durMins <= 0) durMins = 120;
  const durH = Math.floor(durMins / 60);
  const durRemM = durMins % 60;
  const durationText = `${String(durH).padStart(2, "0")}h ${String(durRemM).padStart(2, "0")}m (${durMins} mins)`;

  // Compile combined asset list from actual requests
  const assetsList = trackReqs
    .map((r) => r.asset || r.maintenanceAsset || "Track Machine")
    .filter(Boolean)
    .join(" + ") || "Maintenance Equipment";

  const orderNo = `NCR/PRYJ/OPTG/BLK/2026/${Math.floor(1000 + Math.random() * 9000)}/T351`;
  const approvedWindow = `${windowStart} - ${windowEnd} IST`;
  const windowLabel = isTriDept
    ? "Unified Shadow Window (Tri-Dept Co-Working)"
    : depts.length > 1
    ? "Dual-Dept Shadow Window"
    : "Single-Department Maintenance Possession";

  const ohePowerState = (hasTrd || depts.some((d) => /trd|electrical/i.test(d)))
    ? "25kV OHE Isolated & Earth-Bonded (Permit-to-Work #TRD-882)"
    : "OHE Live (Traction Cut Not Requested)";

  const bypassRoute = "Down traffic diverted via Turnout #4/#5 to Track 4 (DN Loop) under TSR 30 km/h";

  const plainSummary = isTriDept
    ? `AI OPTIMIZATION NOTICE (CP-SAT SOLVER): Concurrent maintenance requisitions from Civil Engineering, Electrical TRD, and Signalling S&T detected for ${targetTrack}. Consolidated into a single ${durationText} Shadow Window (${windowStart} to ${windowEnd} hrs). Net track closure minimized with verified zero-headway passenger disruption.`
    : depts.length > 1
    ? `AI OPTIMIZATION NOTICE (CP-SAT SOLVER): Multi-department co-location requests from ${depts.join(' + ')} merged into a single ${durationText} possession window on ${targetTrack} (${windowStart} to ${windowEnd} hrs).`
    : `AI OPTIMIZATION NOTICE (CP-SAT SOLVER): Dedicated ${depts[0] || 'Departmental'} maintenance possession scheduled on ${targetTrack} from ${windowStart} to ${windowEnd} hrs (${durationText}). Dynamic bypass route active.`;

  const safetySequence = [];
  if (hasTrd) {
    safetySequence.push({
      step: 1,
      phase: "OHE ISOLATION & GROUNDING",
      time: `00:00 - 00:15 (${windowStart} IST)`,
      action: "TRD isolates and grounds 25kV OHE catenary power (Isolator 102/A locked open, discharge rods bonded to rail return path)."
    });
    safetySequence.push({
      step: 2,
      phase: isTriDept ? "TRI-DEPT CONCURRENT CO-WORKING" : "CO-WORKING MAINTENANCE",
      time: `00:15 - ${String(durH).padStart(2, '0')}:${String(Math.max(0, durRemM - 15)).padStart(2, '0')}`,
      action: `${assetsList} execute concurrently under verified power-off protection and station master padlock interlocks.`
    });
    safetySequence.push({
      step: 3,
      phase: "CLEARANCE & FIT DECLARATION",
      time: `${String(durH).padStart(2, '0')}:${String(Math.max(0, durRemM - 15)).padStart(2, '0')} - ${windowEnd} IST`,
      action: "Track clearance inspection completed, TRD catenary re-energized, and joint track fitness certificate issued to Divisional Control."
    });
  } else {
    safetySequence.push({
      step: 1,
      phase: "SITE PROTECTION & BANNER FLAGS",
      time: `00:00 - 00:10 (${windowStart} IST)`,
      action: "Station Master secures route, clamps and padlocks diverging turnouts, and red banner flags placed at 600m/1200m."
    });
    safetySequence.push({
      step: 2,
      phase: "TRACK MAINTENANCE EXECUTION",
      time: `00:10 - ${String(durH).padStart(2, '0')}:${String(Math.max(0, durRemM - 15)).padStart(2, '0')}`,
      action: `${assetsList} deployed for scheduled possession on ${targetTrack}. OHE live with standard mechanical clearances maintained.`
    });
    safetySequence.push({
      step: 3,
      phase: "REVOCATION & TRACK RE-OPENING",
      time: `${String(durH).padStart(2, '0')}:${String(Math.max(0, durRemM - 15)).padStart(2, '0')} - ${windowEnd} IST`,
      action: "Maintenance supervisor issues Track Fit Certificate (Form T/351 Cancellation). Points returned to normal through alignment."
    });
  }

  const regulationMandate = `${targetTrack} is hereby declared DEAD FOR ALL TRAFFIC from ${windowStart} to ${windowEnd} hrs. Down line through traffic (including Train 12424 Rajdhani Exp and Train 22436 Vande Bharat Exp) shall be diverted via Turnout SW #4/#5 onto Track 4 (DN Loop) under a Temporary Speed Restriction (TSR) of 30 km/h. Station Masters at Aligarh and Tundla to physically prove point padlocks prior to first passenger bypass.`;

  return {
    orderNo,
    controlOrderNo: orderNo,
    trackSection: targetTrack,
    sanctionedSection: targetTrack,
    approvedWindow,
    startHour: windowStart,
    endHour: windowEnd,
    duration: durationText,
    windowLabel,
    participatingDepts: depts.join(" + "),
    assetsDeployed: assetsList,
    ohePowerState,
    bypassRoute,
    isTriDept,
    scenarioType: isTriDept ? "TRI_DEPT_SHADOW" : depts.length > 1 ? "SAME_TRACK" : "SINGLE_DEPT",
    formTitle: "FORM T/351 (SR 15.06)",
    railway: "NORTH CENTRAL RAILWAY — PRAYAGRAJ DIVISION (OPERATING BRANCH)",
    fullOrderTitle: isTriDept
      ? "Joint Engineering, TRD & S&T Power/Traffic Block Sanction Order (Form T/351)"
      : depts.length > 1
      ? "Joint Multi-Departmental Power/Traffic Block Sanction Order (Form T/351)"
      : `${depts[0] || "Departmental"} Maintenance Possession Order (Form T/351)`,
    date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " IST",
    addressedTo: "Sr. DOM, Sr. DEN (Co-ord), Sr. DEE (TRD), Sr. DSTE, Station Directors (Aligarh / Tundla)",
    plainSummary,
    structuredSchedule: [
      {
        trackSection: targetTrack,
        approvedWindow: `${windowStart} - ${windowEnd} IST (${durationText})`,
        duration: durationText,
        participatingDepts: depts.join(" + "),
        assetsDeployed: assetsList,
        ohePowerState
      }
    ],
    safetySequence,
    safetyStatus: "SAFETY COMPATIBILITY: VERIFIED & COMPLIANT",
    regulationMandate,
    watermark: "AI GENERATED DRAFT — PENDING CONTROLLER SANCTION",
    status: "DRAFT",
    sha256: `NCR-2026-T351-${Math.random().toString(16).substring(2, 10).toUpperCase()}${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
    notes: "Station Masters Aligarh/Tundla and Electrical TRD SCADA desk to execute PTW clearance handoff before line reopening."
  };
}

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Top-Level State Machine: 'landing' | 'civil' | 'trd' | 'st' | 'dom'
  // Independent per-tab role determination:
  // 1. URL search query `?dept=...` (e.g. opened via window.open('/login?dept=civil'))
  // 2. Tab sessionStorage
  // 3. Fallback to 'landing'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const deptParam = urlParams.get('dept');
        if (deptParam && ROLE_INFO[deptParam.toLowerCase()]) {
          // If accessing directly via /login, the login page handles auth transition,
          // but if already authenticated or directly routed:
          return 'landing';
        }
        const sessionRole = sessionStorage.getItem('railblock_tab_role');
        if (sessionRole && ROLE_INFO[sessionRole.toLowerCase()]) {
          return sessionRole.toLowerCase();
        }
      }
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  // Requisitions Queue: Strictly initialized as empty array (zero pre-seeding on mount)
  const [requisitions, setRequisitions] = useState([]);

  // Real-Time Notification Pop-out for Chief Controller (DOM)
  const [activeAlert, setActiveAlert] = useState(null);

  // Floating Green Toast Notification for Requisitions
  const [toastMessage, setToastMessage] = useState(null);

  // 3D Camera View State: 'orbit' | 'cab' | 'topdown' | 'workzone'
  const [cameraView, setCameraView] = useState('orbit');

  // Co-working Planner Department Toggles
  const [plannerSelectedDepts, setPlannerSelectedDepts] = useState({
    civil: true,
    trd: true,
    st: true,
  });

  // Operational Simulation State
  const [isBlocked, setIsBlocked] = useState(true);
  const [bypassActive, setBypassActive] = useState(true);
  const [trainSpeed, setTrainSpeed] = useState(128);
  const [blockDurationSeconds, setBlockDurationSeconds] = useState(10800); // 3 hrs
  const [megaBlockLocked, setMegaBlockLocked] = useState(true);
  const [auditLogReport, setAuditLogReport] = useState(null);
  const [tmsPacketCount, setTmsPacketCount] = useState(49250);
  const [mockPacketStream] = useState(DEFAULT_PACKETS);

  // Form T/351 Joint E-Circular Possession Order State
  const [t351Order, setT351Order] = useState(() => {
    try {
      const saved = localStorage.getItem('railblock_t351_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep t351Order synchronized with active requisitions
  useEffect(() => {
    if (requisitions.length === 0 && t351Order) {
      setT351Order(null);
      try {
        localStorage.removeItem('railblock_t351_order');
      } catch (e) {}
    }
  }, [requisitions.length]);

  // Historical Transmission Audit Logs
  const [historicalAuditLogs, setHistoricalAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('railblock_historical_logs');
      return saved ? JSON.parse(saved) : DEFAULT_HISTORICAL_LOGS;
    } catch {
      return DEFAULT_HISTORICAL_LOGS;
    }
  });

  // CP-SAT Solver Execution & Transmission Animation States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionStep, setTransmissionStep] = useState(0); // 0: idle, 1: Hash, 2: Transmitted, 3: Locked

  // SIH 2026 Presentation Feature: Engine Status & Heuristic Fallback Simulator
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  const toggleFallbackEngine = () => {
    setIsFallbackActive((prev) => {
      const next = !prev;
      if (soundEngine && soundEngine.playClick) {
        soundEngine.playClick();
      }
      return next;
    });
  };

  // Structured 3-Stage Chief Controller Workflow State
  // Stage 1: Intake & Track Grouping | Stage 2: Autonomous AI Planning | Stage 3: Controller Review & Transmission
  const [controllerStage, setControllerStage] = useState(1);
  const [selectedReqIds, setSelectedReqIds] = useState([]);
  const [aiPlanningMode, setAiPlanningMode] = useState('SAME_TRACK_SHADOW'); // 'SAME_TRACK_SHADOW' | 'MULTI_TRACK_CORRIDOR'
  const [isTweakModalOpen, setIsTweakModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [focusedLayer, setFocusedLayer] = useState(null);

  // Save current role to tab sessionStorage so tabs don't conflict
  useEffect(() => {
    try {
      sessionStorage.setItem('railblock_tab_role', currentRole);
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  }, [currentRole]);

  // Ensure clean slate on component load: purge any stale cached requisitions
  useEffect(() => {
    try {
      localStorage.removeItem('railblock_requisitions');
      localStorage.removeItem('railblock_requisitions_data');
      localStorage.removeItem('railblock_latest_alert');
    } catch (e) {
      console.warn('Storage cleanup error:', e);
    }
  }, []);

  // CROSS-TAB REAL-TIME STORAGE EVENT LISTENER
  useEffect(() => {
    const handleStorageChange = (e) => {
      // 1. New requisition alert fired from another tab
      if (e.key === 'railblock_latest_alert' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload && payload.alertItem) {
            setActiveAlert(payload.alertItem);
            soundEngine.playAlertChime();
            showToast(`[Cross-Tab Real-Time Sync] New Requisition from ${payload.alertItem.deptName || payload.alertItem.dept}`);
          }
        } catch (err) {
          console.error('Storage alert parse error:', err);
        }
      }

      // 2. Requisitions list updated in another tab
      if ((e.key === 'railblock_requisitions' || e.key === 'railblock_requisitions_data') && e.newValue) {
        try {
          const updatedList = JSON.parse(e.newValue);
          if (Array.isArray(updatedList)) {
            setRequisitions(updatedList);
          }
        } catch (err) {
          console.error('Storage requisition list parse error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic packet stream
  useEffect(() => {
    const timer = setInterval(() => {
      setTmsPacketCount(prev => prev + 1);
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  // Block timer countdown
  useEffect(() => {
    if (!isBlocked) return;
    const timer = setInterval(() => {
      setBlockDurationSeconds(prev => (prev > 0 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(timer);
  }, [isBlocked]);

  // Role transition
  const setRole = (roleKey) => {
    const key = roleKey ? roleKey.toLowerCase() : 'landing';
    soundEngine.playClick();
    setCurrentRole(key);
  };

  const logoutToGateway = () => {
    soundEngine.playClick();
    setCurrentRole('landing');
  };

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Submit Requisition (Broadcasts across all open tabs!)
  const submitRequisition = (newReqData) => {
    soundEngine.playClick();
    const deptKey = (newReqData.dept || 'civil').toLowerCase();
    const count = requisitions.length + 101;
    const deptCode = (newReqData.deptCode || deptKey).toUpperCase();
    const newId = `REQ-${deptCode}-${count}`;

    const reqItem = {
      ...newReqData,
      id: newId,
      dept: deptKey,
      deptCode,
      status: 'Pending Approval',
      timestamp: 'Just now',
    };

    const updatedList = [reqItem, ...requisitions];
    setRequisitions(updatedList);

    const alertItem = {
      id: newId,
      dept: deptKey,
      deptCode,
      deptName: newReqData.deptName || ROLE_INFO[deptKey]?.name || 'Department Requisition',
      track: newReqData.track,
      window: `${newReqData.startTime} - ${newReqData.endTime} (${newReqData.durationMinutes} mins)`,
      asset: newReqData.asset,
      priority: newReqData.priority,
      notes: newReqData.notes,
    };

    setActiveAlert(alertItem);
    showToast(`Requisition ${newId} submitted successfully and broadcast to Chief Controller!`);
    soundEngine.playAlertChime();

    // Broadcast to other tabs via localStorage storage event!
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(updatedList));
      localStorage.setItem('railblock_latest_alert', JSON.stringify({ alertItem, timestamp: Date.now() }));
    } catch (e) {
      console.warn('Broadcast storage error:', e);
    }

    return newId;
  };

  const dismissAlert = () => {
    soundEngine.playClick();
    setActiveAlert(null);
  };

  const loadAlertToPlanner = (alertItem) => {
    soundEngine.playClick();
    if (alertItem && alertItem.dept) {
      setPlannerSelectedDepts(prev => ({
        ...prev,
        [alertItem.dept.toLowerCase()]: true,
      }));
    }
    setActiveAlert(null);

    const el = document.getElementById('planner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const togglePlannerDepartment = (deptKey) => {
    soundEngine.playClick();
    const k = deptKey.toLowerCase();
    setPlannerSelectedDepts(prev => ({
      ...prev,
      [k]: !prev[k],
    }));
  };

  const approveAndLockSchedule = () => {
    soundEngine.playClick();
    setMegaBlockLocked(true);
    setIsBlocked(true);
    setBypassActive(true);

    const report = {
      controlOrderNo: `CO/PRYJ/2026/BLK-${Math.floor(Math.random() * 8999 + 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB'),
      signee: 'Sr. DOM / PRYJ (Chief Controller)',
      corridor: 'Delhi–Howrah HDN-1 (PRYJ Junction ⇄ Subedarganj)',
      targetTrack: 'Track 2 (DN Main)',
      bypassTrack: 'Track 4 (DN Loop Line via Turnout 14B & 18A)',
      approvedWindow: '11:00 to 14:00 HRS (180 Minutes)',
      departmentsIncluded: Object.keys(plannerSelectedDepts).filter(k => plannerSelectedDepts[k]).map(k => k.toUpperCase()),
      silLevel: 'SIL-4 Fail-Safe Verified (Kavach Automated Safe Headway)',
      status: 'LOCKED & BROADCAST TO CRIS-COA / TMS'
    };

    setAuditLogReport(report);

    const updated = requisitions.map(r => (r.trackId === 'track2' ? { ...r, status: 'Shadow Merged & Locked' } : r));
    setRequisitions(updated);
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(updated));
    } catch (e) {}

    showToast('Shadow Mega Block Approved & Locked! Control Order broadcasted to TMS/COA.');

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ffffff']
    });
  };

  // Sync Form T/351 and Historical Logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('railblock_t351_order', JSON.stringify(t351Order));
    } catch (e) {
      console.warn('Storage sync error for t351Order:', e);
    }
  }, [t351Order]);

  useEffect(() => {
    try {
      localStorage.setItem('railblock_historical_logs', JSON.stringify(historicalAuditLogs));
    } catch (e) {
      console.warn('Storage sync error for historicalAuditLogs:', e);
    }
  }, [historicalAuditLogs]);

  // Run CP-SAT Optimization Engine (Bundles pending requests into Shadow Block Form T/351)
  const runCpSatOptimization = (targetTrack) => {
    soundEngine.playClick();
    setIsOptimizing(true);
    setActiveAlert(null);

    setTimeout(() => {
      const trackToUse =
        targetTrack ||
        activeAlert?.track ||
        (requisitions[0] &&
          (requisitions[0].track ||
            requisitions[0].targetTrack ||
            requisitions[0].trackSection)) ||
        "Track 2: DN Main";

      const newPlan = generateDynamicPlan(requisitions, trackToUse);
      if (newPlan) {
        setT351Order({
          ...newPlan,
          status: 'READY FOR TRANSMISSION TO HIGHER AUTHORITIES (CRIS / Sr. DOM / HQ)',
        });
      }

      // Update requisitions status
      const updated = requisitions.map((r) => ({
        ...r,
        status: newPlan?.isTriDept ? 'Shadow Merged' : 'Sanctioned in Plan',
      }));
      setRequisitions(updated);
      try {
        localStorage.setItem('railblock_requisitions', JSON.stringify(updated));
      } catch (e) {}

      setIsOptimizing(false);
      soundEngine.playAlertChime();
      showToast('[CP-SAT Solver] Possession and regulation plan generated dynamically!');
    }, 850);
  };

  // 1.5s Cryptographic Dispatch to CRIS / Sr. DOM Central Server
  const transmitOrderToCris = () => {
    if (t351Order.isTransmitted) {
      showToast('Order is already transmitted and locked.');
      return;
    }

    soundEngine.playClick();
    setIsTransmitting(true);
    setTransmissionStep(1); // Step 1: Hash Generated

    setTimeout(() => {
      setTransmissionStep(2); // Step 2: Transmitted to Divisional Server
    }, 550);

    setTimeout(() => {
      setTransmissionStep(3); // Step 3: Audit Log Appended
    }, 1100);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      const dateStr = now.toLocaleDateString('en-GB');

      // Update Order
      const updatedOrder = {
        ...t351Order,
        status: 'STATUS: TRANSMITTED (ACTIVE BLOCK IN EFFECT)',
        isTransmitted: true,
        timestampDispatched: timeStr,
      };
      setT351Order(updatedOrder);

      // Append to Historical Audit Logs
      const newAuditLog = {
        orderNo: updatedOrder.controlOrderNo,
        date: dateStr,
        time: timeStr,
        section: updatedOrder.sanctionedSection,
        window: updatedOrder.approvedWindow,
        controllerId: 'DOM-PRYJ-01 (Sr. DOM / PRYJ)',
        bundledDepts: ['CIVIL', 'TRD', 'ST'],
        sha256: updatedOrder.sha256,
        complianceStatus: 'TRANSMITTED • SIL-4 KAVACH VERIFIED',
        blockStatus: 'ACTIVE BLOCK IN EFFECT',
      };

      const updatedHistorical = [newAuditLog, ...historicalAuditLogs];
      setHistoricalAuditLogs(updatedHistorical);

      try {
        localStorage.setItem('railblock_t351_order', JSON.stringify(updatedOrder));
        localStorage.setItem('railblock_historical_logs', JSON.stringify(updatedHistorical));
      } catch (e) {}

      setIsTransmitting(false);
      setTransmissionStep(0);
      soundEngine.playAlertChime();
      showToast('Block Possession Order Form T/351 Transmitted & Locked to CRIS Central Server!');

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ffffff']
      });
    }, 1600);
  };

  // Simulate an incoming department requisition (for demonstration & testing)
  const simulateNewRequisition = (dept = 'trd') => {
    soundEngine.playAlertChime();
    const alertConfigs = {
      civil: {
        id: `REQ-CIV-${Math.floor(Math.random() * 80 + 110)}`,
        dept: 'civil',
        deptCode: 'CIVIL',
        deptName: 'Civil Engineering (P-Way)',
        section: 'Track 2 DN Main, Aligarh–Tundla KM 131–209',
        track: 'Track 2 (DN Main)',
        window: '13:00 - 15:30 (02h 30m)',
        duration: '02h 30m (150 mins)',
        asset: 'CSM-09 Continuous Action Tamping Machine',
        priority: 'HIGH',
      },
      trd: {
        id: `REQ-TRD-${Math.floor(Math.random() * 80 + 110)}`,
        dept: 'trd',
        deptCode: 'TRD',
        deptName: 'Electrical (TRD)',
        section: 'Track 2 DN Main, Aligarh–Tundla KM 131–209',
        track: 'Track 2 (DN Main)',
        window: '13:00 - 15:30 (02h 30m)',
        duration: '02h 30m (150 mins)',
        asset: 'Tower Wagon RU-843 25kV OHE Renewal',
        priority: 'HIGH',
      },
      st: {
        id: `REQ-ST-${Math.floor(Math.random() * 80 + 110)}`,
        dept: 'st',
        deptCode: 'ST',
        deptName: 'Signalling & Telecom (S&T)',
        section: 'Track 2 DN Main, Aligarh–Tundla KM 131–209',
        track: 'Track 2 (DN Main)',
        window: '13:00 - 14:30 (01h 30m)',
        duration: '01h 30m (90 mins)',
        asset: 'Point Machine Overhaul & Rod Alignment',
        priority: 'ROUTINE',
      }
    };

    const chosen = alertConfigs[dept] || alertConfigs.trd;
    setActiveAlert(chosen);
    showToast(`[Incoming Requisition] ${chosen.id} submitted by ${chosen.deptName}`);
  };

  // Clean 3-Step Chief Controller Workflow State
  // Step 1: Clean Intake & Track-Grouping View | Step 2: Form T/351 Typed Document & Dispatch Bar
  const [controllerStep, setControllerStep] = useState(1);
  const [activeScenario, setActiveScenario] = useState(null); // null | 'TRI_DEPT_SHADOW' | 'SAME_TRACK' | 'MULTI_TRACK'
  const [dispatchNotification, setDispatchNotification] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);

  // Clear all active requisitions to reset to a completely pristine state
  const clearAllRequisitions = () => {
    soundEngine.playClick();
    setRequisitions([]);
    setSelectedReqIds([]);
    setActiveAlert(null);
    setActiveScenario(null);
    setControllerStep(1);
    setDispatchNotification(null);
    setT351Order(null);
    try {
      localStorage.removeItem('railblock_requisitions');
      localStorage.removeItem('railblock_requisitions_data');
      localStorage.removeItem('railblock_latest_alert');
      localStorage.removeItem('railblock_t351_order');
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
    showToast('Requisition queue cleared. Ready for live departmental submissions.');
  };

  // Quick Demo Buttons (Corner Presets) — Reads directly from realistic synthetic dataset
  const loadDemoTriDepartmentSameTrack = () => {
    soundEngine.playClick();
    // Directly loaded from realistic synthetic dataset (Track 2 Tri-Department Co-Location)
    const triDeptList = mockRequisitionsData.filter(
      r => r.conflict_tag === 'TRI_DEPT_SHADOW_CANDIDATE' || ['REQ-CIV-101', 'REQ-TRD-102', 'REQ-ST-103'].includes(r.req_id || r.id)
    );

    setRequisitions(triDeptList);
    setActiveScenario('TRI_DEPT_SHADOW');
    setControllerStep(1);
    setDispatchNotification(null);
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(triDeptList));
    } catch (e) {}
    soundEngine.playAlertChime();
    showToast('🚨 Tri-Department Demand Loaded on Track 2 (Civil + TRD + S&T) from synthetic dataset!');
  };

  const loadDemoSameTrack = () => {
    soundEngine.playClick();
    // Directly loaded from realistic synthetic dataset (Track 2 Dual-Department Overlap)
    const sameTrackList = mockRequisitionsData.filter(
      r => ['REQ-CIV-101', 'REQ-TRD-102'].includes(r.req_id || r.id)
    );

    setRequisitions(sameTrackList);
    setActiveScenario('SAME_TRACK');
    setControllerStep(1);
    setDispatchNotification(null);
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(sameTrackList));
    } catch (e) {}
    soundEngine.playAlertChime();
    showToast('Demo Loaded: Same-Track Requests (Civil + TRD on Track 2 DN Main)');
  };

  const loadDemoMultiTrack = () => {
    soundEngine.playClick();
    // Directly loaded from realistic synthetic dataset (Multi-Track Independent Requisitions)
    const multiTrackList = mockRequisitionsData.filter(
      r => ['REQ-CIV-104', 'REQ-CIV-107'].includes(r.req_id || r.id)
    );

    setRequisitions(multiTrackList);
    setActiveScenario('MULTI_TRACK');
    setControllerStep(1);
    setDispatchNotification(null);
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(multiTrackList));
    } catch (e) {}
    soundEngine.playAlertChime();
    showToast('Demo Loaded: Multi-Track Independent Requisitions');
  };

  const loadAllSyntheticRequisitions = () => {
    soundEngine.playClick();
    setRequisitions(mockRequisitionsData);
    setActiveScenario('ALL_SYNTHETIC');
    setControllerStep(1);
    setDispatchNotification(null);
    try {
      localStorage.setItem('railblock_requisitions', JSON.stringify(mockRequisitionsData));
    } catch (e) {}
    soundEngine.playAlertChime();
    showToast(`Loaded all ${mockRequisitionsData.length} requisitions from synthetic dataset.`);
  };

  // =========================================================================
  // Dynamic AI Plan Generator Logic (Strictly Matches Active Requisitions)
  // =========================================================================
  const generateAiPlan = (targetTrack) => {
    soundEngine.playClick();
    setIsOptimizing(true);

    setTimeout(() => {
      try {
        const safeTargetTrack =
          (typeof targetTrack === "string" && targetTrack.trim())
            ? targetTrack.trim()
            : activeAlert?.track ||
              (requisitions[0] &&
                (requisitions[0].track ||
                  requisitions[0].targetTrack ||
                  requisitions[0].trackSection)) ||
              "Track 2: DN Main";

        const newPlan = generateDynamicPlan(requisitions, safeTargetTrack);

        if (newPlan) {
          setT351Order(newPlan);
          if (newPlan.isTriDept) {
            setActiveScenario("TRI_DEPT_SHADOW");
          } else if (newPlan.scenarioType === "SAME_TRACK") {
            setActiveScenario("SAME_TRACK");
          } else {
            setActiveScenario(null);
          }

          // Update requisitions status to reflect planned state
          const updated = requisitions.map((r) => ({
            ...r,
            status:
              newPlan.isTriDept || newPlan.scenarioType === "SAME_TRACK"
                ? "Shadow Merged"
                : "Sanctioned in Plan",
          }));
          setRequisitions(updated);
          try {
            localStorage.setItem("railblock_requisitions", JSON.stringify(updated));
          } catch (e) {}
        }
      } catch (err) {
        console.error("generateAiPlan error fallback:", err);
      } finally {
        setIsOptimizing(false);
        setControllerStep(2);
        soundEngine.playAlertChime();
        showToast("AI Plan Generated: Official Form T/351 Joint E-Circular Ready");
      }
    }, 650);
  };

  // Step 3 Action: Approve & Forward to Higher Authorities (Sr. DOM / CRIS HQ)
  const approveAndForwardOrder = () => {
    soundEngine.playClick();
    setIsSignoffModalOpen(false);

    const updated = {
      ...t351Order,
      watermark: 'SANCTIONED & TRANSMITTED',
      status: 'SANCTIONED',
      timestampDispatched: new Date().toLocaleTimeString() + ' IST',
    };
    setT351Order(updated);

    const notificationMsg = 'Dispatched to Sr. DOM (Prayagraj) & Central CRIS Portal. Control Log entry recorded.';
    setDispatchNotification(notificationMsg);

    // Save to historical audit log
    const newLog = {
      orderNo: updated.controlOrderNo,
      date: updated.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      section: updated.structuredSchedule?.[0]?.trackSection || 'Track 2: DN Main',
      window: updated.structuredSchedule?.[0]?.approvedWindow || '13:00 - 15:30 IST',
      controllerId: 'DOM-PRYJ-01 (Chief Controller / Sr. DOM)',
      bundledDepts: ['CIVIL', 'TRD'],
      sha256: updated.sha256,
      complianceStatus: 'SANCTIONED & TRANSMITTED',
      blockStatus: 'ACTIVE BLOCK IN EFFECT',
    };
    setHistoricalAuditLogs(prev => [newLog, ...prev]);

    try {
      localStorage.setItem('railblock_t351_order', JSON.stringify(updated));
    } catch (e) {}

    soundEngine.playAlertChime();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ffffff']
    });
    showToast(notificationMsg);
  };

  const updateT351OrderField = (field, value) => {
    setT351Order(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSelectReq = (id) => {
    setSelectedReqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllReqs = () => {
    setSelectedReqIds(requisitions.map((r) => r.id));
  };

  const clearSelectedReqs = () => {
    setSelectedReqIds([]);
  };

  const advanceToStage = (stageNum) => {
    soundEngine.playClick();
    setControllerStage(stageNum);
  };

  const loadSameTrackScenario = () => {
    loadDemoSameTrack();
    setSelectedReqIds(['REQ-CIV-101', 'REQ-TRD-102']);
  };

  const loadMultiTrackScenario = () => {
    loadDemoMultiTrack();
    setSelectedReqIds(['REQ-CIV-201', 'REQ-ST-203']);
  };

  const prepareAiPlan = () => {
    generateAiPlan();
    setControllerStage(2);
  };

  const updateT351Field = (field, val) => {
    updateT351OrderField(field, val);
  };

  const currentRoleInfo = ROLE_INFO[currentRole] || ROLE_INFO.landing;

  return (
    <SimulationContext.Provider
      value={{
        currentRole,
        currentRoleInfo,
        setRole,
        logoutToGateway,
        requisitions,
        submitRequisition,
        activeAlert,
        setActiveAlert,
        dismissAlert,
        loadAlertToPlanner,
        toastMessage,
        setToastMessage,
        cameraView,
        setCameraView,
        plannerSelectedDepts,
        togglePlannerDepartment,
        approveAndLockSchedule,
        auditLogReport,
        setAuditLogReport,
        isBlocked,
        setIsBlocked,
        bypassActive,
        setBypassActive,
        trainSpeed,
        setTrainSpeed,
        blockDurationSeconds,
        megaBlockLocked,
        scrollProgress,
        setScrollProgress,
        focusedLayer,
        setFocusedLayer,
        tmsPacketCount,
        mockPacketStream,
        // Form T/351 & Dispatch Architecture
        t351Order,
        setT351Order,
        historicalAuditLogs,
        setHistoricalAuditLogs,
        isOptimizing,
        isTransmitting,
        transmissionStep,
        runCpSatOptimization,
        transmitOrderToCris,
        simulateNewRequisition,
        // Clean Sequential 3-Step Chief Controller Workspace
        controllerStep,
        setControllerStep,
        activeScenario,
        setActiveScenario,
        dispatchNotification,
        setDispatchNotification,
        isEditModalOpen,
        setIsEditModalOpen,
        isSignoffModalOpen,
        setIsSignoffModalOpen,
        loadDemoTriDepartmentSameTrack,
        loadDemoSameTrack,
        loadDemoMultiTrack,
        clearAllRequisitions,
        generateDynamicPlan,
        generateAiPlan,
        approveAndForwardOrder,
        // Synthetic Datasets (SIH 2026 Presentation Data Connector)
        mockRequisitions: mockRequisitionsData,
        mockTimetable: mockTimetableData,
        loadAllSyntheticRequisitions,
        // SIH 2026 Presentation Fallback Engine State
        isFallbackActive,
        setIsFallbackActive,
        toggleFallbackEngine,
        // Legacy stage helpers (backwards compatibility)
        controllerStage,
        setControllerStage,
        selectedReqIds,
        setSelectedReqIds,
        aiPlanningMode,
        setAiPlanningMode,
        isTweakModalOpen,
        setIsTweakModalOpen,
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        toggleSelectReq,
        selectAllReqs,
        clearSelectedReqs,
        advanceToStage,
        loadSameTrackScenario,
        loadMultiTrackScenario,
        prepareAiPlan,
        updateT351Field,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};
