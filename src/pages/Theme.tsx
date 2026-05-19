import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Theme() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  // Mask tracking logic
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const maskSize = isHovering ? 400 : 40;

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary overflow-hidden">
      
      {/* KINETIC TYPOGRAPHY VOID HERO (Desktop Only Masking) */}
      <section 
        className="relative h-screen w-full flex items-center justify-center bg-brand-background overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Base Layer (Visible constantly) */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
          <h1 className="text-[12vw] md:text-[8vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-brand-outline/20">
            Borrowed <br/> But Not <br/> Wasted.
          </h1>
        </div>

        {/* Mask Layer (Reveals true colors & hidden text) */}
        <motion.div 
          className="absolute inset-0 bg-brand-primary flex flex-col items-center justify-center px-6 text-center pointer-events-none hidden md:flex"
          style={{
            WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="black"/></svg>')`,
            WebkitMaskSize: `${maskSize}px ${maskSize}px`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: useTransform(
              [smoothX, smoothY], 
              ([x, y]) => `${(x as number) - maskSize/2}px ${(y as number) - maskSize/2}px`
            )
          }}
          animate={{ WebkitMaskSize: `${maskSize}px ${maskSize}px` } as any}
          transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
        >
          <span className="font-typewriter text-xs tracking-[0.5em] uppercase text-brand-secondary mb-8">The Truth</span>
          <h1 className="text-[8vw] font-title font-black uppercase leading-[0.85] tracking-tighter text-brand-background">
            Borrowed <br/> 
            <span className="text-brand-secondary">But Not</span> <br/> 
            Wasted.
          </h1>
          <p className="mt-8 font-editorial text-2xl max-w-xl text-brand-background/80 italic">
            "None of us choose our arrival and departure. Between those two moments lies everything."
          </p>
        </motion.div>

        {/* Mobile Fallback Title (Since mask is hidden on mobile) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none md:hidden pt-32">
          <span className="font-typewriter text-[10px] tracking-[0.4em] uppercase text-brand-secondary border border-brand-secondary/30 px-3 py-1 mb-6">The Paradigm</span>
          <h1 className="text-6xl font-title font-black uppercase leading-[0.85] tracking-tighter text-brand-primary mix-blend-difference">
            Borrowed <br/> 
            <span className="text-brand-secondary">But Not</span> <br/> 
            Wasted.
          </h1>
        </div>

        <div className="absolute bottom-10 left-6 md:left-16 font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50">
          Scroll to explore
        </div>
      </section>

      {/* PHILOSOPHY SECTIONS */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16 pt-32 pb-48 space-y-32 md:space-y-64 relative z-10 bg-brand-background">
        
        {/* Structural Decorative Line */}
        <motion.div 
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="absolute left-6 md:left-16 top-0 w-px h-full bg-brand-outline/20 origin-top pointer-events-none hidden md:block"
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-4xl md:text-[4vw] font-title font-bold uppercase mb-8 leading-[0.9] tracking-tighter">
              The Accumulation<br/>Of Decisions
            </h2>
            <p className="font-editorial text-xl md:text-2xl leading-relaxed text-brand-primary/70 mb-6">
              History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people. 
            </p>
            <p className="font-editorial text-xl md:text-2xl leading-relaxed text-brand-primary font-bold italic">
              The question was never how much time they had. It was what they did with it.
            </p>
          </motion.div>
          <motion.div 
            style={{ y: y1 }}
            className="order-1 md:order-2 bg-brand-surface border border-brand-outline p-12 aspect-square flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-overlay"></div>
            <span className="font-title text-[15vw] md:text-[10vw] font-black text-brand-primary/5 tracking-tighter">01</span>
            <div className="absolute bottom-8 left-8 font-typewriter text-xs tracking-widest uppercase text-brand-primary/40">Phase 1</div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            style={{ y: y2 }}
            className="bg-brand-primary text-brand-background p-12 aspect-square flex flex-col justify-between relative overflow-hidden order-1"
          >
            <span className="font-typewriter text-[10px] tracking-[0.3em] uppercase opacity-50 text-brand-secondary">Critical Inquiry</span>
            <h3 className="font-title text-[8vw] md:text-[5vw] uppercase font-black leading-[0.8] tracking-tighter">A Warming<br/>Planet &<br/>AI</h3>
            <div className="absolute top-8 right-8 font-typewriter text-xs tracking-widest text-brand-secondary/40">Phase 2</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="order-2"
          >
            <h2 className="text-4xl md:text-[4vw] font-title font-bold uppercase mb-8 leading-[0.9] tracking-tighter">
              To Inherit &<br/>Reimagine
            </h2>
            <div className="space-y-6 text-xl md:text-2xl leading-relaxed text-brand-primary/70 font-editorial">
              <p>
                We'll explore what it actually means to live responsibly on a warming planet. To grow up alongside artificial intelligence without losing what makes us human. 
              </p>
              <p>
                To pursue peace in a world that keeps making war feel inevitable. To inherit systems you didn't design and decide whether to maintain them or reimagine them entirely.
              </p>
            </div>
          </motion.div>
        </div>

        {/* KINETIC CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-40 md:mt-64 border-t border-brand-outline pt-32 text-center relative"
        >
          <p className="font-typewriter text-xs uppercase tracking-[0.4em] text-brand-secondary mb-12">Not a conference about doom.</p>
          <h2 className="text-[10vw] md:text-[7vw] font-title font-black uppercase tracking-tighter leading-[0.8] mb-16 text-brand-primary">
            The clock's ticking.<br/>
            The stage is yours.
          </h2>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-12 py-8 bg-brand-primary text-brand-background font-title text-2xl font-black uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all duration-500 rounded-sm"
          >
            What will you do with the time that's left?
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
