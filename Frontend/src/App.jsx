import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { GatewayAuth } from './components/auth/GatewayAuth';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { ExplodedTrackCanvas } from './components/3d/ExplodedTrackCanvas';
import { HeroOverlay } from './components/hero/HeroOverlay';
import { ExplodedHudCards } from './components/hero/ExplodedHudCards';
import { DepartmentConsole } from './components/department/DepartmentConsole';
import { ControllerDesk } from './components/controller/ControllerDesk';
import { BypassSimulator } from './components/simulation/BypassSimulator';
import { OperationalScorecard } from './components/kpi/OperationalScorecard';
import { AlgorithmDeepDive } from './components/algorithm/AlgorithmDeepDive';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Main Operational Workspace once authenticated
function OperationalApp() {
  const { currentRole, scrollProgress, setScrollProgress } = useSimulation();
  const heroPinContainerRef = useRef(null);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis init ignored:', e);
    }

    const handleScroll = () => {
      if (!heroPinContainerRef.current) return;
      const rect = heroPinContainerRef.current.getBoundingClientRect();
      const totalScrollableHeight = heroPinContainerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollableHeight > 0) {
        const scrolled = -rect.top;
        const progress = Math.min(1, Math.max(0, scrolled / totalScrollableHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (lenis) lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollProgress]);

  return (
    <div className="min-h-screen bg-ir-dark text-slate-100 selection:bg-amber-500/30 selection:text-amber-300 pt-16">
      {/* Top Fixed Header Navbar */}
      <Navbar />

      {/* Role-Specific Active Desk / Console */}
      <div id="active-role-workspace">
        <ErrorBoundary title="Workspace Component">
          {currentRole === 'dom' ? (
            <ControllerDesk />
          ) : (
            <DepartmentConsole />
          )}
        </ErrorBoundary>
      </div>

      {/* PINNED 3D EXPLODED TRACK DIGITAL TWIN (Active for Department Engineering Consoles) */}
      {currentRole !== 'dom' && (
        <div
          id="exploded-section"
          ref={heroPinContainerRef}
          className="relative h-[200vh] w-full"
        >
          <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden">
            <ErrorBoundary title="3D Digital Twin Canvas">
              <ExplodedTrackCanvas />
            </ErrorBoundary>
            <HeroOverlay scrollProgress={scrollProgress} />
            <ExplodedHudCards scrollProgress={scrollProgress} />
          </div>
        </div>
      )}

      {/* LIVE TELEMETRY & DYNAMIC BYPASS STAGE */}
      <ErrorBoundary title="Bypass Simulator">
        <BypassSimulator />
      </ErrorBoundary>

      {/* OPERATIONAL ROI SCORECARD */}
      <div id="scorecard-section">
        <ErrorBoundary title="ROI Scorecard">
          <OperationalScorecard />
        </ErrorBoundary>
      </div>

      {/* CP-SAT MATHEMATICAL ENGINE DEEP DIVE */}
      <ErrorBoundary title="Algorithm Deep Dive">
        <AlgorithmDeepDive />
      </ErrorBoundary>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// Global Green Toast Notification Overlay
function ToastOverlay() {
  const { toastMessage, setToastMessage } = useSimulation();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-950/95 border-2 border-emerald-500 text-emerald-300 shadow-2xl backdrop-blur-xl flex items-center gap-3 font-mono text-xs max-w-md"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// App Content Router supporting /login route and query param
function AppContent() {
  const { currentRole, setRole } = useSimulation();

  // Check if current tab was opened with /login or ?dept=...
  const [isLoginRoute, setIsLoginRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      return path.includes('/login') || search.includes('dept=');
    }
    return false;
  });

  const [initialDept, setInitialDept] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('dept') || 'civil';
    }
    return 'civil';
  });

  // Handle successful login in LoginPage
  const handleLoginSuccess = (dept) => {
    setIsLoginRoute(false);
    setRole(dept);
    // Clean URL without reload
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState({}, '', '/');
    }
  };

  return (
    <>
      <ToastOverlay />

      {/* If directly navigated to login route/tab and not yet authenticated in this tab */}
      {isLoginRoute && currentRole === 'landing' ? (
        <ErrorBoundary title="Authentication Portal">
          <LoginPage
            initialDept={initialDept}
            onLoginSuccess={handleLoginSuccess}
          />
        </ErrorBoundary>
      ) : (!currentRole || currentRole === 'landing') ? (
        /* Landing Gateway Portal */
        <ErrorBoundary title="Gateway Authentication">
          <GatewayAuth />
        </ErrorBoundary>
      ) : (
        /* Authenticated Operational Workspace */
        <ErrorBoundary title="Operational Control Desk">
          <OperationalApp />
        </ErrorBoundary>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary title="RailBlock.AI Root System">
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </ErrorBoundary>
  );
}
