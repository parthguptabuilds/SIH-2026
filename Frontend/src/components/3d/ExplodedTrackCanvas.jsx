import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CivilLayer } from './CivilLayer';
import { STLayer } from './STLayer';
import { TRDLayer } from './TRDLayer';
import { ParticleAtmosphere } from './ParticleAtmosphere';
import { Corridor2DFallback } from './Corridor2DFallback';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useSimulation } from '../../context/SimulationContext';
import { Eye, Video, Compass, Focus } from 'lucide-react';

// Dynamic Camera Rig supporting 4 camera views with strict safety checks
function CameraRig({ scrollProgress = 0, cameraView = 'orbit' }) {
  const targetPos = useRef(new THREE.Vector3(3.2, 2.4, 12));
  const targetLook = useRef(new THREE.Vector3(0, 1.8, 0));

  useFrame((state) => {
    if (!state?.camera?.position) return;
    const p = THREE.MathUtils.clamp(scrollProgress || 0, 0, 1);

    if (cameraView === 'cab') {
      targetPos.current.set(0, 1.6, 9);
      targetLook.current.set(0, 1.4, -18);
    } else if (cameraView === 'topdown') {
      targetPos.current.set(0, 18, 0.1);
      targetLook.current.set(0, 0, 0);
    } else if (cameraView === 'workzone') {
      targetPos.current.set(3.4, 2.2, 3.8);
      targetLook.current.set(0, 0.9, 0);
    } else {
      const startX = 3.2, startY = 2.4, startZ = 12;
      const endX = 8.5, endY = 5.2, endZ = 9.5;

      const currentX = THREE.MathUtils.lerp(startX, endX, p);
      const currentY = THREE.MathUtils.lerp(startY, endY, p);
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, p);

      targetPos.current.set(currentX, currentY, currentZ);
      targetLook.current.set(0, THREE.MathUtils.lerp(1.5, 2.5, p), 0);
    }

    state.camera.position.lerp(targetPos.current, 0.08);
    state.camera.lookAt(targetLook.current);
  });

  return null;
}

export const ExplodedTrackCanvas = () => {
  const { scrollProgress = 0, focusedLayer = null, cameraView = 'orbit', setCameraView, isBlocked, bypassActive } = useSimulation();

  const cameraOptions = [
    { id: 'orbit', label: 'Cinematic Orbit', icon: Compass },
    { id: 'cab', label: 'Driver Cab View', icon: Eye },
    { id: 'topdown', label: 'Overhead Top-Down', icon: Video },
    { id: 'workzone', label: 'Workzone Close-Up', icon: Focus },
  ];

  return (
    <div className="w-full h-full relative select-none">
      <ErrorBoundary fallback={<Corridor2DFallback isBlocked={isBlocked} bypassActive={bypassActive} />}>
        <Canvas
          shadows
          camera={{ position: [3.2, 2.4, 12], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="cursor-grab active:cursor-grabbing"
          fallback={<Corridor2DFallback isBlocked={isBlocked} bypassActive={bypassActive} />}
        >
          {/* Aerospace Lighting */}
          <ambientLight intensity={0.65} color="#1e293b" />
          <directionalLight
            position={[10, 15, 8]}
            intensity={1.8}
            color="#f8fafc"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-8, 6, -5]} intensity={1.2} color="#f59e0b" />
          <directionalLight position={[0, -5, -12]} intensity={0.9} color="#06b6d4" />

          {/* Dynamic Camera Rig */}
          <CameraRig scrollProgress={scrollProgress} cameraView={cameraView} />

          {/* 3D Disassembled Layers */}
          <group position={[0, 0, 0]}>
            <CivilLayer
              explosionDelta={scrollProgress}
              isHovered={focusedLayer === 'civil'}
            />
            <STLayer
              explosionDelta={scrollProgress}
              isHovered={focusedLayer === 'st'}
            />
            <TRDLayer
              explosionDelta={scrollProgress}
              isHovered={focusedLayer === 'trd'}
            />
            <ParticleAtmosphere explosionDelta={scrollProgress} />
          </group>

          {/* Ambient Ground Grid Lines */}
          <gridHelper
            args={[60, 40, '#f59e0b', '#1e293b']}
            position={[0, -1.8, 0]}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.05}
            minPolarAngle={Math.PI / 6}
            rotateSpeed={0.5}
          />
        </Canvas>
      </ErrorBoundary>

      {/* Camera View Switcher Floating Bar */}
      <div className="absolute top-20 left-6 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-xl shadow-xl font-mono text-xs">
        <span className="text-[10px] text-slate-400 px-2 font-bold uppercase hidden sm:inline">
          CAMERA:
        </span>
        {cameraOptions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCameraView(id)}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-semibold ${
              cameraView === id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Floating 3D HUD compass & coordinate watermark */}
      <div className="absolute bottom-4 left-6 pointer-events-none flex items-center space-x-3 text-xs font-mono text-slate-400">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span>TWIN_COORDINATE: 25.4358°N, 81.8463°E (PRYJ JN)</span>
        <span className="text-slate-600">|</span>
        <span>VIEW MODE: {(cameraView || 'ORBIT').toUpperCase()}</span>
      </div>

      <div className="absolute top-20 right-6 pointer-events-none font-mono text-[11px] text-right text-slate-400/80">
        <div className="text-amber-400 font-semibold tracking-wider">PROCEDURAL_WEBGL_TWIN</div>
        <div>60 FPS • PRYJ HDN-1</div>
      </div>
    </div>
  );
};
