import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const bluePanelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !bluePanelRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false);
          onComplete();
        }
      });

      // Loading percentage animation runs in parallel
      gsap.to(".loading-percentage", {
        innerHTML: 100,
        duration: 2.2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function() {
          const targets = this.targets();
          if (targets[0]) targets[0].innerHTML = Math.round(targets[0].innerHTML) + '%';
        }
      });

      // Phase 1: The Broken Present
      // Massive typography shears out from invisible layout grids
      tl.from(".hero-text-anim", {
        yPercent: 120,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1
      })

      // Phase 2: The Sliding Inversion
      // The deep blue plate slides aggressively over the text
      .to(bluePanelRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: "power4.inOut"
      }, "-=0.6")
      
      // Minimalist data strings slide out from the margins
      .from(".data-string", {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1
      }, "-=0.8")

      // Phase 3: The Elastic Collapse
      // Snap vertically toward the horizontal center line
      .to(containerRef.current, {
        scaleY: 0.002, // Compress into a razor-thin ribbon
        transformOrigin: "center center",
        duration: 0.8,
        ease: "expo.inOut"
      }, "+=0.4")
      
      // The Full Reveal
      // Ribbon scales up past the screen lens
      .to(containerRef.current, {
        scaleY: 100, // Blow past viewport
        opacity: 0,
        duration: 0.8,
        ease: "power4.inOut"
      })

      // Stagger reveal the main landing page typography
      .from(".hero-text", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef}
      id="preloader-overlay"
      className="fixed inset-0 z-[9999] bg-[#050507] overflow-hidden flex flex-col justify-center pointer-events-auto origin-center will-change-transform"
    >
      {/* Base Layer: Black Canvas */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 pointer-events-none">
        <div className="overflow-hidden">
          <h1 className="hero-text-anim text-[16vw] md:text-[14vw] font-title font-black uppercase text-white leading-[0.8] tracking-tighter">
            BORROWED
          </h1>
        </div>
        <div className="overflow-hidden flex justify-end">
          <h1 className="hero-text-anim text-[16vw] md:text-[14vw] font-title font-black uppercase text-brand-secondary leading-[0.8] tracking-tighter">
            TIME
          </h1>
        </div>
      </div>

      {/* Deep Blue Sliding Overlay Layer */}
      <div 
        ref={bluePanelRef} 
        className="absolute inset-0 bg-brand-primary flex flex-col justify-center px-6 md:px-24 overflow-hidden pointer-events-none will-change-transform" 
        style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
      >
        {/* Micro-Typography Data Stamps */}
        <div className="absolute top-12 right-12 md:right-24 overflow-hidden">
          <span className="data-string block font-typewriter text-xs tracking-widest text-white/50 uppercase">
            DAR ES SALAAM / 2026
          </span>
        </div>
        <div className="absolute bottom-12 left-12 md:left-24 overflow-hidden">
          <span className="data-string loading-percentage block font-typewriter text-4xl font-bold tracking-widest text-white">
            0%
          </span>
        </div>

        {/* Color Inverted Typography */}
        <div className="overflow-hidden">
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase text-white leading-[0.8] tracking-tighter">
            BORROWED
          </h1>
        </div>
        <div className="overflow-hidden flex justify-end">
          <h1 className="text-[16vw] md:text-[14vw] font-title font-black uppercase text-[#0c1012] leading-[0.8] tracking-tighter">
            TIME
          </h1>
        </div>
      </div>
    </div>
  );
}
