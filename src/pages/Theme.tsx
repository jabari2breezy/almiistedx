import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Theme() {
  const topHalfControls = useAnimation();
  const bottomHalfControls = useAnimation();
  const manifestoControls = useAnimation();
  const [sequenceComplete, setSequenceComplete] = useState(false);

  useEffect(() => {
    const runSequence = async () => {
      // Phase 1: Wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: The Fracture
      topHalfControls.start({ 
        y: '-35vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });
      await bottomHalfControls.start({ 
        y: '35vh', 
        transition: { duration: 2, ease: [0.85, 0, 0.15, 1] } 
      });

      // Phase 3: The Revelation
      await manifestoControls.start({ 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)",
        transition: { duration: 1.5, ease: "easeOut" } 
      });

      setSequenceComplete(true);
    };

    runSequence();
  }, [topHalfControls, bottomHalfControls, manifestoControls]);

  return (
    <div className="bg-brand-background min-h-screen text-brand-primary font-sans overflow-x-hidden">
      
      {/* THE FRACTURE SEQUENCE HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-background">
        
        {/* TOP HALF TEXT */}
        <motion.div 
          animate={topHalfControls}
          initial={{ y: 0 }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
        >
          <h1 className="text-[15vw] md:text-[12vw] font-title font-black uppercase leading-none tracking-tighter text-brand-primary">
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
          <h1 className="text-[15vw] md:text-[12vw] font-title font-black uppercase leading-none tracking-tighter text-brand-primary">
            Borrowed<br/>Time.
          </h1>
        </motion.div>

        {/* GLOWING CRACK (Reveals during fracture) */}
        <motion.div
          animate={manifestoControls}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10"
        >
          <span className="font-typewriter text-[10px] md:text-xs tracking-[0.5em] uppercase text-brand-secondary mb-6 border border-brand-secondary/30 px-4 py-1 rounded-full bg-brand-secondary/10">
            The Truth
          </span>
          <p className="font-editorial text-3xl md:text-5xl lg:text-6xl max-w-5xl text-center text-brand-primary italic leading-tight">
            "None of us choose our arrival and departure in this world. Between those two moments lies everything."
          </p>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: sequenceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50">Explore the concept</span>
          <div className="w-[1px] h-12 bg-brand-primary/20" />
        </motion.div>
      </section>

      {/* CHAMPIONS4GOOD INSPIRED CONTENT LAYOUT */}
      <section className="py-32 px-4 md:px-12 max-w-screen-2xl mx-auto space-y-24 md:space-y-40">
        
        {/* Intro Block */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-block px-6 py-2 bg-brand-surface rounded-full border border-brand-outline">
            <span className="font-typewriter text-[10px] uppercase tracking-widest font-bold">The Core Idea</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-title font-black uppercase tracking-tighter leading-none">
            Your Network Of <br/> Game Changers
          </h2>
          <p className="font-editorial text-xl md:text-3xl text-brand-primary/60 italic leading-relaxed">
            History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people. 
          </p>
        </motion.div>

        {/* Heavy Offset Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-brand-surface rounded-3xl p-10 md:p-16 border border-brand-outline relative overflow-hidden group hover:bg-brand-primary hover:text-brand-background transition-colors duration-500"
          >
            <div className="flex justify-between items-start mb-24">
              <span className="text-6xl md:text-8xl font-title font-black opacity-20">01</span>
              <div className="px-4 py-1 bg-brand-secondary/20 text-brand-secondary rounded-full font-typewriter text-[10px] font-bold uppercase group-hover:bg-brand-background/20 group-hover:text-brand-background transition-colors">
                Legacy
              </div>
            </div>
            <h3 className="text-3xl md:text-5xl font-title font-bold uppercase mb-6 tracking-tighter leading-none">
              To Inherit & Reimagine
            </h3>
            <p className="font-editorial text-lg md:text-xl opacity-70 group-hover:opacity-100 transition-opacity">
              We'll explore what it means to live responsibly on a warming planet. To inherit systems you didn't design and decide whether to maintain them or reimagine them entirely.
            </p>
          </motion.div>

          {/* Card 2 (Offset lower) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-brand-secondary text-brand-background rounded-3xl p-10 md:p-16 relative overflow-hidden md:mt-24 group hover:bg-brand-primary transition-colors duration-500"
          >
            <div className="flex justify-between items-start mb-24">
              <span className="text-6xl md:text-8xl font-title font-black opacity-20">02</span>
              <div className="px-4 py-1 bg-brand-background/20 rounded-full font-typewriter text-[10px] font-bold uppercase">
                Action
              </div>
            </div>
            <h3 className="text-3xl md:text-5xl font-title font-bold uppercase mb-6 tracking-tighter leading-none">
              Capitalism's Clock
            </h3>
            <p className="font-editorial text-lg md:text-xl opacity-90">
              Examining how modern economic systems have commodified our hours. We challenge the relentless demand for efficiency and question whether the clock serves us, or if we serve the clock.
            </p>
          </motion.div>

        </div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-t border-b border-brand-outline py-24 flex flex-col md:flex-row gap-16 justify-between items-start"
        >
          <h2 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter leading-[0.85] shrink-0">
            Your <br/> <span className="text-brand-secondary">Benefits</span>
          </h2>
          <div className="space-y-12 max-w-2xl">
            <div className="flex gap-6 items-start">
              <span className="font-typewriter font-bold text-brand-secondary mt-1">01</span>
              <h4 className="font-sans font-bold text-xl md:text-3xl uppercase tracking-tighter">Curated Network of Executives and Athletes</h4>
            </div>
            <div className="w-full h-px bg-brand-outline" />
            <div className="flex gap-6 items-start">
              <span className="font-typewriter font-bold text-brand-secondary mt-1">02</span>
              <h4 className="font-sans font-bold text-xl md:text-3xl uppercase tracking-tighter">Tickets to unique sport-EVENTS</h4>
            </div>
            <div className="w-full h-px bg-brand-outline" />
            <div className="flex gap-6 items-start">
              <span className="font-typewriter font-bold text-brand-secondary mt-1">03</span>
              <h4 className="font-sans font-bold text-xl md:text-3xl uppercase tracking-tighter">Exclusive benefits and discounts</h4>
            </div>
          </div>
        </motion.div>

        {/* Massive CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-brand-primary text-brand-background rounded-3xl p-12 md:p-24 text-center"
        >
          <h2 className="text-5xl md:text-8xl font-title font-black uppercase tracking-tighter leading-none mb-12">
            Ready To Join?
          </h2>
          <p className="font-editorial text-2xl md:text-4xl italic opacity-70 mb-16 max-w-3xl mx-auto">
            Secure your ticket and explore a curated network of visionaries acting on borrowed time.
          </p>
          <Link 
            to="/tickets"
            className="inline-flex items-center gap-4 bg-brand-secondary text-brand-background px-12 py-6 rounded-full font-title font-bold text-xl md:text-3xl uppercase tracking-widest hover:bg-white transition-all hover:scale-105 active:scale-95"
          >
            Get Tickets <ArrowRight size={32} />
          </Link>
        </motion.div>

      </section>
    </div>
  );
}
