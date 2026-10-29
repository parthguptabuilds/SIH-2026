import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const STLayer = ({ explosionDelta = 0 }) => {
  const greenLightRef = useRef();
  const yellowLightRef = useRef();
  const ledGlowRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (greenLightRef.current) {
      greenLightRef.current.intensity = 1.8 + Math.sin(t * 3) * 0.3;
    }
    if (ledGlowRef.current) {
      ledGlowRef.current.material.opacity = 0.6 + Math.sin(t * 4) * 0.3;
    }
  });

  const yOffset = explosionDelta * 0.3;
  const zOffset = explosionDelta * 0.8;

  return (
    <group position={[0, yOffset, zOffset]}>
      {/* 4-Aspect Color Light Signal Mast at Z = -6 */}
      <group position={[1.8, 0, -6]}>
        {/* Foundation Base */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Vertical Tubular Post */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.2, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Signal Aspect Head Housing */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[0.36, 1.3, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Signal Visor / Hoods */}
        {[-0.45, -0.15, 0.15, 0.45].map((yRel, idx) => (
          <mesh key={idx} position={[-0.05, 3.4 + yRel, 0.18]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.14, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#020617" side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Lenses: Green (Top), Yellow 1, Yellow 2, Red (Bottom) */}
        {/* Green Proceed Aspect (Active) */}
        <mesh position={[0, 3.4 + 0.45, 0.16]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <pointLight
          ref={greenLightRef}
          position={[0, 3.4 + 0.45, 0.4]}
          color="#10b981"
          intensity={2}
          distance={4}
        />

        {/* Attention Double Yellows (Standby) */}
        <mesh position={[0, 3.4 + 0.15, 0.16]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#332005" />
        </mesh>
        <mesh position={[0, 3.4 - 0.15, 0.16]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#332005" />
        </mesh>

        {/* Danger Red (Standby) */}
        <mesh position={[0, 3.4 - 0.45, 0.16]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#2b0a0a" />
        </mesh>

        {/* Identification Plate: "AS-124 AUTO" */}
        <mesh position={[0, 2.4, 0.1]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Axle Counter Heads clamped to rails (Left & Right rail transducers at Z = 2) */}
      <group position={[0, 0.14, 2]}>
        {/* Left Axle Counter Sensor */}
        <mesh position={[-0.83, 0, 0]}>
          <boxGeometry args={[0.16, 0.12, 0.3]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Right Axle Counter Sensor */}
        <mesh position={[0.83, 0, 0]}>
          <boxGeometry args={[0.16, 0.12, 0.3]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Connecting signal conduit line */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.7, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
      </group>

      {/* Point Machine Enclosure (Electro-hydraulic switch actuator at Z = 5) */}
      <group position={[-1.7, 0.1, 5]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.3, 0.9]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Motor crank connecting rod to rail tongue */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Electronic Interlocking Location Relay Box (Metallic Location Box at Z = 0) */}
      <group position={[-1.8, 0.45, 0]}>
        {/* Concrete Pedestal */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Silver Galvanized Steel Box */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.7, 0.45]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Pulsing Status LED */}
        <mesh ref={ledGlowRef} position={[0, 0.22, 0.23]}>
          <circleGeometry args={[0.025, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Glowing Track Circuit Ray / Signal Interlock Field during explosion */}
      {explosionDelta > 0.1 && (
        <group position={[0, 0.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 24]} />
            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.08 * Math.min(1, explosionDelta * 2)}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
