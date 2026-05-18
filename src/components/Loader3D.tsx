import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Center } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

function ParticleClock() {
  const ref = useRef<THREE.Points>(null!);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const [points] = useState(() => {
    const count = isMobile ? 1500 : 3000;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2 + Math.random() * 0.5;
      
      // Hourglass shape
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      
      // Morph towards hourglass
      const factor = Math.abs(y);
      const constriction = 1 - Math.exp(-factor * 2);
      
      p[i * 3] = x * constriction;
      p[i * 3 + 1] = y * 1.5;
      p[i * 3 + 2] = z * constriction;
    }
    return p;
  });

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00A859"
        size={isMobile ? 0.03 : 0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Loader3D() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[2000] bg-brand-primary flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <color attach="background" args={['#0A0A0A']} />
              <ambientLight intensity={0.5} />
              <ParticleClock />
            </Canvas>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-white font-title text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
                BORROWED <span className="text-brand-secondary">TIME</span>
              </h1>
              <span className="font-typewriter text-[10px] text-white/40 tracking-[0.8em] uppercase">
                TEDx AlMuntazir Schools Youth
              </span>
            </motion.div>

            <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-brand-secondary origin-left"
                style={{ scaleX: progress / 100 }}
              />
            </div>

            <span className="font-typewriter text-[10px] text-brand-secondary tabular-nums">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
