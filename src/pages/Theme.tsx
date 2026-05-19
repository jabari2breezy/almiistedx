import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Theme() {
  const topHalfControls = useAnimation();
  const bottomHalfControls = useAnimation();
  const manifestoControls = useAnimation();
  const bgControls = useAnimation();

  const [sequenceComplete, setSequenceComplete] = useState(false);

  useEffect(() => {
    const runSequence = async () => {
      // Phase 1: Wait and fade to deep navy
      await bgControls.start({ 
        backgroundColor: '#000839', 
        transition: { duration: 1.5, ease: "easeInOut" } 
      });

      // Phase 2: The Fracture
      // Top half slides up, Bottom half slides down, tearing the screen apart
      topHalfControls.start({ 
        y: '-30vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });
      await bottomHalfControls.start({ 
        y: '30vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });

      // Phase 3: The Revelation
      // Manifesto glowing and scaling out from the crack
      await manifestoControls.start({ 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)",
        transition: { duration: 1.5, ease: "easeOut" } 
      });

      setSequenceComplete(true);

      // Phase 4: Infinite Pulse Loop
      bgControls.start({
        backgroundColor: ['#000839', '#001a10', '#000839'],
        transition: { duration: 10, repeat: Infinity, ease: "linear" }
      });
    };

    runSequence();
  }, [topHalfControls, bottomHalfControls, manifestoControls, bgControls]);

  return (
    <motion.div 
      animate={bgControls}
      initial={{ backgroundColor: '#000000' }}
      className="min-h-screen text-brand-background overflow-x-hidden"
    >
      
      {/* THE FRACTURE SEQUENCE HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* TOP HALF TEXT */}
        <motion.div 
          animate={topHalfControls}
          initial={{ y: 0 }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
        >
          <h1 className="text-[12vw] md:text-[10vw] font-title font-black uppercase leading-none tracking-tighter text-white">
            Borrowed<br/>Time.
          </h1>
        </motion.div>

        {/* BOTTOM HALF TEXT */}
        <motion.div 
          animate={bottomHalfControls}
          initial={{ y: 0 }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none"
          style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}
        >
          <h1 className="text-[12vw] md:text-[10vw] font-title font-black uppercase leading-none tracking-tighter text-white">
            Borrowed<br/>Time.
          </h1>
        </motion.div>

        {/* GLOWING CRACK (Reveals during fracture) */}
        <motion.div
          animate={manifestoControls}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10"
        >
          <span className="font-typewriter text-[10px] md:text-xs tracking-[0.5em] uppercase text-brand-secondary mb-6 border border-brand-secondary/30 px-4 py-1">
            The Truth
          </span>
          <p className="font-editorial text-2xl md:text-4xl lg:text-5xl max-w-4xl text-center text-white italic leading-relaxed">
            "None of us choose our arrival and departure in this world. Between those two moments lies everything."
          </p>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-secondary/50 shadow-[0_0_30px_#006d38] -z-10" />
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: sequenceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 font-typewriter text-[10px] uppercase tracking-widest text-white/50 flex flex-col items-center gap-4"
        >
          <span>Descend</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* CONTINUOUS CINEMATIC SCROLL */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16 pb-48 space-y-32 md:space-y-64 relative z-30">
        
        {/* Structural Line */}
        <div className="absolute left-6 md:left-16 top-0 w-px h-full bg-white/10 pointer-events-none hidden md:block" />

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center pt-32">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-[4vw] font-title font-bold uppercase mb-8 leading-[0.9] tracking-tighter text-white">
              The Accumulation<br/>Of Decisions
            </h2>
            <p className="font-editorial text-xl md:text-2xl leading-relaxed text-white/70 mb-6">
              History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people. 
            </p>
            <p className="font-editorial text-xl md:text-2xl leading-relaxed text-brand-secondary font-bold italic">
              The question was never how much time they had. It was what they did with it.
            </p>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="border border-white/20 p-12 aspect-square flex items-center justify-center relative overflow-hidden backdrop-blur-sm"
          >
            <span className="font-title text-[20vw] md:text-[15vw] font-black text-white/5 tracking-tighter">01</span>
            <div className="absolute bottom-8 left-8 font-typewriter text-xs tracking-widest uppercase text-white/40">Phase 1</div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-brand-secondary text-brand-background p-12 aspect-square flex flex-col justify-between relative overflow-hidden order-1"
          >
            <span className="font-typewriter text-[10px] tracking-[0.3em] uppercase opacity-50">Critical Inquiry</span>
            <h3 className="font-title text-[8vw] md:text-[5vw] uppercase font-black leading-[0.8] tracking-tighter">A Warming<br/>Planet &<br/>AI</h3>
            <div className="absolute top-8 right-8 font-typewriter text-xs tracking-widest opacity-40">Phase 2</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="order-2"
          >
            <h2 className="text-4xl md:text-[4vw] font-title font-bold uppercase mb-8 leading-[0.9] tracking-tighter text-white">
              To Inherit &<br/>Reimagine
            </h2>
            <div className="space-y-6 text-xl md:text-2xl leading-relaxed text-white/70 font-editorial">
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
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-40 md:mt-64 border-t border-white/20 pt-32 text-center relative"
        >
          <p className="font-typewriter text-xs uppercase tracking-[0.4em] text-brand-secondary mb-12">Not a conference about doom.</p>
          <h2 className="text-[10vw] md:text-[7vw] font-title font-black uppercase tracking-tighter leading-[0.8] mb-16 text-white">
            The clock's ticking.<br/>
            The stage is yours.
          </h2>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-12 py-8 bg-white text-brand-background font-title text-2xl font-black uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all duration-500 rounded-sm"
          >
            What will you do with the time that's left?
          </Link>
        </motion.section>

      </div>
    </motion.div>
  );
}
