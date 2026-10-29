import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleAtmosphere = ({ explosionDelta = 0 }) => {
  const pointsRef = useRef();
  const scanPlaneRef = useRef();

  const particleCount = 280;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12; // X
      arr[i * 3 + 1] = Math.random() * 8 - 1;   // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 36; // Z
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02;
    }
    if (scanPlaneRef.current) {
      // Oscillate a cyan laser scan line along the corridor track
      scanPlaneRef.current.position.z = Math.sin(t * 0.8) * 14;
    }
  });

  return (
    <group>
      {/* Floating dust & spark particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Cyber LiDAR Track Inspection Laser Sweep Plane */}
      <group ref={scanPlaneRef} position={[0, 0.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 0.15]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight color="#06b6d4" intensity={1.5} distance={3} />
      </group>
    </group>
  );
};
