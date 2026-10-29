import React, { useState } from 'react';
import { Shield, Cpu, Activity, Menu, X, ArrowRight, Lock, LogOut, Send, Sparkles } from 'lucide-react';
import { useSimulation, ROLE_INFO } from '../../context/SimulationContext';

export const Navbar = () => {
  const { currentRole, currentRoleInfo, setRole, logoutToGateway, approveAndLockSchedule, isFallbackActive, toggleFallbackEngine } = useSimulation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeColor = currentRoleInfo?.color || '#f59e0b';
  const isDom = currentRole === 'dom';

  const toggleFallbackMode = toggleFallbackEngine;
  const handleLogout = logoutToGateway;

  const roleOptions = [
    { id: 'civil', label: 'Civil (P-Way)', code: 'CIVIL', color: '#3b82f6' },
    { id: 'trd', label: 'Electrical (TRD)', code: 'TRD', color: '#ec4899' },
    { id: 'st', label: 'Signalling (S&T)', code: 'ST', color: '#10b981' },
    { id: 'dom', label: 'Chief Controller', code: 'DOM', color: '#f59e0b' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & SIH ID */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                RailBlock<span className="text-amber-400">.AI</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                SIH26027
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              TEAM: CODE CRAFTER • PRYJ DIVISION
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300">
          <a
            href="#active-role-workspace"
            className="hover:text-amber-400 transition-colors text-white font-bold"
          >
            {isDom ? 'CONTROLLER DESK' : 'REQUISITION CONSOLE'}
          </a>
          <a
            href="#exploded-section"
            className="hover:text-amber-400 transition-colors"
          >
            3D DIGITAL TWIN
          </a>
          <a
            href="#simulation-section"
            className="hover:text-amber-400 transition-colors"
          >
            CORRIDOR BYPASS
          </a>
          <a
            href="#scorecard-section"
            className="hover:text-amber-400 transition-colors"
          >
            ROI SCORECARD
          </a>
        </nav>

        {/* Right Actions Container: Clean, Aligned Flex Layout */}
        {isDom ? (
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Solver Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-mono text-xs whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="font-semibold text-slate-300">SOLVER:</span>
              <span>{isFallbackActive ? "Heuristic Fast Engine (0.18s)" : "CP-SAT Optimal (4.2s)"}</span>
            </div>

            {/* Simulate Traffic Spike Button */}
            <button
              type="button"
              onClick={toggleFallbackMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isFallbackActive
                  ? "border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500"
              }`}
            >
              <span className="text-amber-400">⚡</span>
              <span>{isFallbackActive ? "Revert to CP-SAT" : "Simulate Spike"}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <div
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 text-xs font-mono whitespace-nowrap cursor-pointer hover:border-amber-500/50 transition-colors"
                title="Click to switch role"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                <span className="font-bold text-white">DOM</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 text-[11px]">Chief Controller</span>
              </div>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 font-mono text-xs">
                  <div className="px-2 py-1.5 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 mb-1">
                    SWITCH OPERATIONAL ROLE
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setRole(opt.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        currentRole === opt.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                        {opt.label}
                      </span>
                      <span className="text-[10px] opacity-70">({opt.code})</span>
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        handleLogout();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Return to Gateway Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout / Gateway Link */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-400 text-xs font-mono whitespace-nowrap transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Gateway</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs font-mono text-slate-200 transition-all shadow-sm cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
                <span className="font-bold text-[11px] uppercase">
                  {currentRoleInfo?.code || currentRole}
                </span>
                <span className="text-slate-500 text-[10px]">|</span>
                <span className="text-amber-400 text-[10px]">Switch ▾</span>
              </button>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 font-mono text-xs">
                  <div className="px-2 py-1.5 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 mb-1">
                    SWITCH OPERATIONAL ROLE
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setRole(opt.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        currentRole === opt.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                        {opt.label}
                      </span>
                      <span className="text-[10px] opacity-70">({opt.code})</span>
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        handleLogout();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Return to Gateway Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Switch Department / Logout Button returning to 'landing' */}
            <button
              onClick={handleLogout}
              title="Switch Department / Logout to Gateway"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Logout / Gateway</span>
            </button>

            {/* Role-specific Action Button */}
            <a
              href="#requisition-form"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SUBMIT BLOCK</span>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 font-mono text-xs">
          <a
            href="#active-role-workspace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-bold border-b border-slate-900"
          >
            {isDom ? '01. CHIEF CONTROLLER OPERATIONS DESK' : '01. DEPARTMENT REQUISITION CONSOLE'}
          </a>
          <a
            href="#exploded-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400 border-b border-slate-900"
          >
            02. 3D DIGITAL TWIN (EXPLODED CORRIDOR)
          </a>
          <a
            href="#simulation-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400 border-b border-slate-900"
          >
            03. LIVE BYPASS SIMULATION (PRYJ)
          </a>
          <a
            href="#scorecard-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-amber-400 border-b border-slate-900"
          >
            04. OPERATIONAL ROI SCORECARD
          </a>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logoutToGateway();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-bold text-slate-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>RETURN TO GATEWAY AUTH</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
