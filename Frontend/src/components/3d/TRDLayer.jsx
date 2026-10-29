import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TRDLayer = ({ explosionDelta = 0 }) => {
  const sparkRef = useRef();
  const sparkLightRef = useRef();

  // Animated spark on contact wire / pantograph contact zone
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (sparkRef.current) {
      sparkRef.current.position.z = Math.sin(t * 1.5) * 8;
      const isBurst = Math.sin(t * 12) > 0.7;
      sparkRef.current.visible = isBurst;
      if (sparkLightRef.current) {
        sparkLightRef.current.intensity = isBurst ? 3.5 : 0;
      }
    }
  });

  // Vertical droppers connecting catenary wire to contact wire along Z
  const droppers = useMemo(() => {
    const arr = [];
    for (let z = -16; z <= 16; z += 2) {
      arr.push(z);
    }
    return arr;
  }, []);

  const yOffset = explosionDelta * 2.8;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Overhead OHE Portal Masts (Placed at Z = -12, 0, 12) */}
      {[-12, 0, 12].map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          {/* Mast Upright Column (Left side of track) */}
          <group position={[-2.4, 0, 0]}>
            {/* Concrete Foundation Plinth */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.5, 0.8, 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.9} />
            </mesh>
            {/* Rolled Steel Joist Mast Column (H-Beam / Box) */}
            <mesh position={[0, 3.8, 0]} castShadow>
              <boxGeometry args={[0.2, 6.4, 0.25]} />
              <meshStandardMaterial color="#475569" metalness={0.75} roughness={0.3} />
            </mesh>
            {/* Danger 25000V High Voltage warning plate */}
            <mesh position={[0.11, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.18, 0.28]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Cantilever Bracket Assembly (Horizontal support arm) */}
          <group position={[-1.2, 6.2, 0]}>
            {/* Main horizontal cantilever pipe */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 2.5, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Diagonal stay tube brace */}
            <mesh position={[-0.5, 0.4, 0]} rotation={[0, 0, -Math.PI / 5]}>
              <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* High Voltage Porcelain Disc Insulators (Brown ribbed cylinders) */}
            <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.4, 12]} />
              <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.2} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Catenary Wire (Messenger Cable at Y = 6.4) */}
      <mesh position={[0, 6.4, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 36, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Contact Wire (Solid copper wire at Y = 5.4, direct pantograph path) */}
      <group position={[0, 5.4, 0]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 36, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.1}
            emissive="#fbbf24"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Contact wire power glow line */}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 36, 6]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Droppers (Vertical wires tying messenger cable to contact wire) */}
      {droppers.map((z, idx) => (
        <mesh key={idx} position={[0, 5.9, z]}>
          <cylinderGeometry args={[0.004, 0.004, 1.0, 6]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* Animated Electric Arc Spark (Simulating 25kV current flow) */}
      <group ref={sparkRef} position={[0, 5.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <pointLight
          ref={sparkLightRef}
          color="#38bdf8"
          intensity={3}
          distance={4}
        />
      </group>

      {/* TRD Electric Field Aura Plane during exploded state */}
      {explosionDelta > 0.1 && (
        <mesh position={[0, 5.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 30]} />
          <meshBasicMaterial
            color="#ec4899"
            transparent
            opacity={0.07 * Math.min(1, explosionDelta * 2)}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
