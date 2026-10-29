import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CivilLayer = ({ explosionDelta = 0, isHovered = false }) => {
  // Sleepers positioning along the Z axis (track length)
  const sleepers = useMemo(() => {
    const arr = [];
    const count = 30;
    const spacing = 1.1;
    for (let i = -count / 2; i < count / 2; i++) {
      arr.push(i * spacing);
    }
    return arr;
  }, []);

  const yOffset = -explosionDelta * 2.2;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Ballast Gravel Bed */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.5, 36]} />
        <meshStandardMaterial
          color="#141a29"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Ballast Slope Shoulder Left & Right */}
      <mesh position={[-2.5, -0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.8, 0.4, 36]} />
        <meshStandardMaterial color="#0e1320" roughness={0.95} />
      </mesh>
      <mesh position={[2.5, -0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.8, 0.4, 36]} />
        <meshStandardMaterial color="#0e1320" roughness={0.95} />
      </mesh>

      {/* Concrete PSC Sleepers */}
      {sleepers.map((z, idx) => (
        <group key={idx} position={[0, -0.1, z]}>
          {/* Main PSC Sleeper body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.7, 0.22, 0.32]} />
            <meshStandardMaterial
              color="#2a334a"
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>
          {/* Rail fastenings / Pandrol clips (Left & Right) */}
          <mesh position={[-0.83, 0.12, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.2]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0.83, 0.12, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.2]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Dual 60kg Steel Rails (Standard Broad Gauge 1676mm -> ~1.66m in world units) */}
      {/* Left Rail */}
      <group position={[-0.83, 0.12, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.2, 36]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.15}
            envMapIntensity={2.5}
          />
        </mesh>
        {/* Rail head specular glow strip */}
        <mesh position={[0, 0.105, 0]}>
          <boxGeometry args={[0.07, 0.01, 36]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Right Rail */}
      <group position={[0.83, 0.12, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.2, 36]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.15}
            envMapIntensity={2.5}
          />
        </mesh>
        {/* Rail head specular glow strip */}
        <mesh position={[0, 0.105, 0]}>
          <boxGeometry args={[0.07, 0.01, 36]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Switch Point Tongue Rails (Turnout crossover preview) */}
      <group position={[0, 0.12, 2]}>
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0.06, 0]}>
          <boxGeometry args={[0.08, 0.18, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* PROCEDURAL WORKZONE: CSM-09 Tamping Machine on Track 2 (Z = 0) */}
      <group position={[0, 0.85, 0]}>
        {/* Main Machine Body (Yellow Heavy Maintenance Livery) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.4, 7.5]} />
          <meshStandardMaterial color="#eab308" metalness={0.65} roughness={0.3} />
        </mesh>
        {/* Machine Operator Cab Glass (Front & Back) */}
        <mesh position={[0, 0.3, 3.8]}>
          <boxGeometry args={[1.8, 0.7, 0.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.3, -3.8]}>
          <boxGeometry args={[1.8, 0.7, 0.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tamping Tines / Heavy Vibrating Tools undercarriage */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[1.4, 0.4, 2.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Flashing Amber Hazard Strobe Beacon on Roof */}
        <group position={[0, 0.8, 2.5]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <pointLight color="#f59e0b" intensity={2.5} distance={6} />
        </group>
        {/* Plasser & Theurer CSM-09 Badge Plate */}
        <mesh position={[1.11, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.8, 0.4]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Track Maintenance Hazard Barricade Cones & Warning Strip (Z = 5 and Z = -5) */}
      {[-4.5, 4.5].map((zPos, idx) => (
        <group key={idx} position={[0, 0.3, zPos]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.18, 0.6, 12]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.18, 0.6, 12]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          {/* Warning Barricade crossbeam */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[2.6, 0.14, 0.05]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Layer Label Anchor Mesh / Bounding Halo when exploded */}
      {explosionDelta > 0.1 && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 30]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.06 * Math.min(1, explosionDelta * 2)}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
