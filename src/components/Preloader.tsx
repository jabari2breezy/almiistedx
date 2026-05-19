import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Hourglass3D from './Hourglass3D';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasWrapperRef.current || !percentageRef.current) return;

    // Use a GSAP context to ensure animations are properly cleaned up
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Unmount the preloader from the DOM completely to save GPU/RAM
          setIsMounted(false);
          onComplete();
        }
      });

      // 1. Fade in the 3D Canvas
      tl.fromTo(canvasWrapperRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5 }
      )
      // 2. Animate your loading percentage text
      .to(percentageRef.current, {
        innerHTML: 100,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 }, // Snaps the number to whole integers
        onUpdate: function() {
          if (percentageRef.current) {
            percentageRef.current.innerHTML = Math.round(this.targets()[0].innerHTML) + '%';
          }
        }
      })
      // 3. Scale up and explode the particles (triggering the internal 3D animation context)
      .to(canvasWrapperRef.current, { 
        scale: 3, 
        opacity: 0, 
        duration: 1, 
        ease: "power4.in" 
      })
      // 4. Wipe away the preloader overlay to reveal the hero section
      .to(containerRef.current, { 
        yPercent: -100, 
        duration: 0.8, 
        ease: "power4.inOut" 
      }, "-=0.5")
      // 5. Stagger reveal the main landing page typography
      .from(".hero-text", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.3");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef}
      id="preloader-overlay"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-auto"
    >
      {/* 3D Canvas Wrapper */}
      <div 
        ref={canvasWrapperRef}
        id="hourglass-canvas"
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#ffaa55" />
          <Hourglass3D />
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Loading Percentage Text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <div 
          ref={percentageRef}
          id="loading-percentage"
          className="font-typewriter text-4xl text-white font-bold tracking-widest"
        >
          0
        </div>
        <div className="font-typewriter text-[9px] uppercase tracking-[0.5em] text-white/50 text-center mt-2">
          Initializing
        </div>
      </div>
      
      {/* Optional: Static Faint Typography in the background as requested */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 mix-blend-screen z-0">
        <h1 className="text-[15vw] font-title font-black uppercase text-white whitespace-nowrap">
          BORROWED TIME
        </h1>
      </div>
    </div>
  );
}
