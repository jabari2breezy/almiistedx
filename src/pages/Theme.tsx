import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a 4-screen-tall scrolling container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- STORY SEQUENCE MATH ---
  
  // Phase 1 (0 to 0.25): Intro "BORROWED TIME" fades and scales up
  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.5]);

  // Phase 2 (0.2 to 0.5): The Core Problem
  const problemOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
  const problemY = useTransform(scrollYProgress, [0.2, 0.3], [50, 0]);
  const problemScale = useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1.05]);

  // Phase 3 (0.45 to 0.75): The Accumulation / Philosophy
  const accumOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.7, 0.75], [0, 1, 1, 0]);
  const accumY = useTransform(scrollYProgress, [0.45, 0.55], [50, 0]);

  // Phase 4 (0.7 to 1): The CTA
  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.7, 0.85], [50, 0]);

  return (
    <div ref={containerRef} className="h-[400vh] bg-brand-background text-brand-primary relative">
      
      {/* Sticky Canvas - Remains locked to viewport while scrolling down the 400vh container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-16">
        
        {/* Decorative subtle noise/gradient overlay for premium feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-overlay z-0" />

        {/* Phase 1: Intro */}
        <motion.div 
          style={{ opacity: introOpacity, scale: introScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
        >
          <span className="font-typewriter text-[10px] md:text-xs tracking-[0.5em] uppercase text-brand-secondary mb-6 md:mb-10 opacity-70">
            The Theme
          </span>
          <h1 className="text-[18vw] md:text-[14vw] font-title font-black uppercase leading-[0.8] tracking-tighter text-brand-primary drop-shadow-2xl">
            Borrowed<br/>Time.
          </h1>
          
          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 font-typewriter text-[9px] tracking-[0.4em] uppercase text-brand-primary/40"
          >
            Scroll to uncover
          </motion.div>
        </motion.div>

        {/* Phase 2: The Core Problem */}
        <motion.div 
          style={{ opacity: problemOpacity, y: problemY, scale: problemScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4 z-10 pointer-events-none"
        >
          <p className="font-editorial text-4xl md:text-6xl lg:text-7xl text-brand-primary leading-[1.1] md:leading-[1.1] italic">
            "None of us choose our arrival and departure in this world. <br className="hidden md:block"/>
            <span className="text-brand-secondary font-medium block mt-4 md:mt-8">Between those two moments lies everything.</span>"
          </p>
        </motion.div>

        {/* Phase 3: The Accumulation */}
        <motion.div 
          style={{ opacity: accumOpacity, y: accumY }}
          className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto text-left w-full px-6 z-10 pointer-events-none"
        >
          <h2 className="text-5xl md:text-[6vw] font-title font-black uppercase mb-12 md:mb-20 leading-[0.85] tracking-tighter text-brand-primary max-w-4xl">
            The Accumulation<br/>Of Decisions
          </h2>
          <div className="grid md:grid-cols-2 gap-12 md:gap-32 w-full">
            <p className="font-editorial text-2xl md:text-3xl lg:text-4xl leading-relaxed text-brand-primary/70">
              History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people. 
            </p>
            <p className="font-editorial text-2xl md:text-3xl lg:text-4xl leading-relaxed text-brand-primary/70">
              We'll explore what it means to inherit systems you didn't design—a warming planet, an AI revolution—and decide whether to maintain or reimagine them.
            </p>
          </div>
        </motion.div>

        {/* Phase 4: CTA */}
        <motion.div 
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-auto bg-brand-background/80 backdrop-blur-sm"
        >
          <p className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.4em] text-brand-secondary mb-8">
            The clock is ticking.
          </p>
          <h2 className="text-[10vw] md:text-[8vw] font-title font-black uppercase tracking-tighter leading-[0.85] mb-16 text-brand-primary">
            What will you do <br/> with the time <br/> 
            <span className="text-brand-secondary italic font-serif lowercase block mt-4 drop-shadow-lg">that's left?</span>
          </h2>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-12 py-6 bg-brand-primary text-brand-background font-title text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all duration-500 rounded-full shadow-2xl"
          >
            Secure Your Seat
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
