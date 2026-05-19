import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { MeshTransmissionMaterial, Instance, Instances } from '@react-three/drei';

export default function Hourglass3D() {
  const topSandRef = useRef<Mesh>(null);
  const bottomSandRef = useRef<Mesh>(null);
  const streamRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);

  // Subtle mouse parallax
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle tilt towards mouse (mapped from -1 to 1)
      const targetX = (state.pointer.y * Math.PI) / 10;
      const targetY = (state.pointer.x * Math.PI) / 10;
      
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.1;
    }

    // Sand falling animation
    const time = state.clock.elapsedTime;
    
    // Simulate top sand shrinking and bottom sand growing over a 60s cycle
    // (We map it fast for the preloader visual)
    const progress = (time * 0.5) % 1; 
    
    if (topSandRef.current) {
      topSandRef.current.scale.y = Math.max(0.01, 1 - progress);
      topSandRef.current.position.y = 1 + (progress * 1); // Move down as it shrinks
    }
    
    if (bottomSandRef.current) {
      bottomSandRef.current.scale.y = Math.max(0.01, progress);
      bottomSandRef.current.position.y = -1 - ((1 - progress) * 1); // Move up as it grows
    }

    if (streamRef.current) {
      // Rotate the stream slightly to simulate falling particles
      streamRef.current.rotation.y = time * 5;
    }
  });

  // Gunmetal material properties
  const metalMaterialProps = {
    color: "#2a2a2a",
    roughness: 0.6,
    metalness: 0.8,
  };

  // Sand material properties
  const sandMaterialProps = {
    color: "#d4b886", // Natural sand color
    roughness: 0.9,
    metalness: 0.1,
  };

  return (
    <group ref={groupRef}>
      {/* Top and Bottom Metal Bases */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
        <meshStandardMaterial {...metalMaterialProps} />
      </mesh>

      {/* Metal Pillars */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        const x = Math.cos(angle) * 1.1;
        const z = Math.sin(angle) * 1.1;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.08, 0.08, 4.2, 16]} />
            <meshStandardMaterial {...metalMaterialProps} />
          </mesh>
        );
      })}

      {/* Glass Body (Two Cones) */}
      <mesh position={[0, 1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1, 2, 32, 1, true]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.5}
          roughness={0.1}
          transmission={0.95}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <coneGeometry args={[1, 2, 32, 1, true]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.5}
          roughness={0.1}
          transmission={0.95}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>

      {/* Sand Inside Top Bulb */}
      <mesh ref={topSandRef} position={[0, 1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.95, 1.9, 32]} />
        <meshStandardMaterial {...sandMaterialProps} />
      </mesh>

      {/* Sand Inside Bottom Bulb */}
      <mesh ref={bottomSandRef} position={[0, -1, 0]}>
        <coneGeometry args={[0.95, 1.9, 32]} />
        <meshStandardMaterial {...sandMaterialProps} />
      </mesh>

      {/* Falling Sand Stream */}
      <group ref={streamRef}>
        <Instances limit={100} range={100}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshStandardMaterial {...sandMaterialProps} />
          {Array.from({ length: 100 }).map((_, i) => (
            <Instance 
              key={i} 
              position={[
                (Math.random() - 0.5) * 0.05, 
                (Math.random() * 2) - 1, 
                (Math.random() - 0.5) * 0.05
              ]} 
            />
          ))}
        </Instances>
      </group>
    </group>
  );
}
