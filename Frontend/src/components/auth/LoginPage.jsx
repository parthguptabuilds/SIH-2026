import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Zap, Radio, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Cpu, Sparkles, KeyRound, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { useSimulation, ROLE_INFO } from '../../context/SimulationContext';

export const LoginPage = ({ initialDept = 'civil', onLoginSuccess }) => {
  const { setRole } = useSimulation();

  // Selected department state
  const [dept, setDept] = useState(() => {
    const valid = ['civil', 'trd', 'st', 'dom'];
    const d = (initialDept || 'civil').toLowerCase();
    return valid.includes(d) ? d : 'civil';
  });

  // Credential fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [division, setDivision] = useState('PRYJ Division (Delhi-Howrah HDN-1)');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Default credentials mapping for judge demo autofill
  const demoCredentials = {
    civil: {
      username: 'IR-PWAY-642',
      password: 'pway#civil2026',
      name: 'Dy. CE (P-Way / Track)'
    },
    trd: {
      username: 'IR-TRD-OHE-88',
      password: 'trd#25kvgrid',
      name: 'Sr. DEE (TRD)'
    },
    st: {
      username: 'IR-ST-KAVACH-14',
      password: 'st#sil4lock',
      name: 'Sr. DSTE (S&T)'
    },
    dom: {
      username: 'DOM-PRYJ-001',
      password: 'sih2026#rail',
      name: 'Chief Controller / Sr. DOM'
    }
  };

  // Sync initial department when prop changes
  useEffect(() => {
    if (initialDept && ['civil', 'trd', 'st', 'dom'].includes(initialDept.toLowerCase())) {
      setDept(initialDept.toLowerCase());
    }
  }, [initialDept]);

  // 1-Click Auto Fill Demo Credentials
  const handleAutoFill = () => {
    const cred = demoCredentials[dept] || demoCredentials.civil;
    setUsername(cred.username);
    setPassword(cred.password);
    setAuthError('');
  };

  // Submit & Authorize
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!username.trim()) {
      setAuthError('Please enter an Officer / Employee ID or click Auto-Fill Demo Credentials.');
      return;
    }
    if (!password.trim()) {
      setAuthError('Please enter your security passcode or click Auto-Fill Demo Credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate cryptographic verification against CRIS-COA auth server
    setTimeout(() => {
      setIsLoading(false);
      // Switch role in context
      setRole(dept);
      if (onLoginSuccess) {
        onLoginSuccess(dept);
      }
    }, 700);
  };

  const currentInfo = ROLE_INFO[dept] || ROLE_INFO.civil;

  return (
    <div className="min-h-screen bg-ir-dark text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      {/* Background Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] blur-[140px] rounded-full pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: `${currentInfo.color}15` }}
      />

      {/* Top Header & Team SIH Credentials */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                RailBlock<span className="text-amber-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-extrabold border border-amber-500/30">
                SIH26027
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              CENTRAL RAILWAY INFORMATION SYSTEMS (CRIS) AUTH PORTAL
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SECURE TERMINAL: HTTPS-TLS 1.3</span>
          </div>
          <a
            href="/"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-bold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Gateway Home</span>
          </a>
        </div>
      </header>

      {/* Main Login Modal Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Top Dynamic Department Glow Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500"
            style={{ backgroundColor: currentInfo.color }}
          />

          {/* Department Header Info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 font-mono text-xs mb-3 shadow-inner">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentInfo.color }}
              />
              <span className="text-white font-bold tracking-wide uppercase">
                {currentInfo.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Operational Desk Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ministry of Railways • National Train Control Network (NTCN)
            </p>
          </div>

          {/* Department Switcher Pills */}
          <div className="mb-6 p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-1.5 px-2">
              Select Department Portal:
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {[
                { id: 'civil', label: 'CIVIL', icon: Hammer, color: '#3b82f6' },
                { id: 'trd', label: 'TRD', icon: Zap, color: '#ec4899' },
                { id: 'st', label: 'S&T', icon: Radio, color: '#10b981' },
                { id: 'dom', label: 'DOM', icon: Shield, color: '#f59e0b' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = dept === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDept(item.id);
                      setAuthError('');
                    }}
                    className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all text-center ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-lg border border-slate-600 scale-[1.03]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isSelected ? item.color : undefined }}
                    />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1-Click Auto-Fill Demo Credentials Button */}
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>JUDGE DEMO ACCESS</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>Auto-Fill Demo Credentials</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            {/* Officer / Employee ID */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Officer / Employee Identification ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`e.g. ${demoCredentials[dept]?.username || 'IR-OFFICER-001'}`}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            {/* Security Passcode with Eye Toggle */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Security Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter authorized security passcode..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Corridor Division Selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Operational Corridor Division
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                >
                  <option value="PRYJ Division (Delhi-Howrah HDN-1)">
                    PRYJ Division (Delhi-Howrah HDN-1: PRYJ ⇄ CNB)
                  </option>
                  <option value="DDU Division (Grand Chord Trunk)">
                    DDU Division (Grand Chord Trunk Line)
                  </option>
                  <option value="DLI Division (Northern Railway HDN-2)">
                    DLI Division (Northern Railway HDN-2)
                  </option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {authError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING CRIS CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>AUTHORIZE & ENTER OPERATIONS DESK</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer Branding */}
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
