import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Theme() {
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" as const } }
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-primary pt-32 pb-24 px-6 md:px-16 overflow-hidden">
      
      {/* Structural Decorative Line */}
      <motion.div 
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="fixed left-6 md:left-16 top-0 w-px h-full bg-brand-outline/20 origin-top pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HERO STATEMENT */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-40 md:mb-64 pt-20"
        >
          <motion.div variants={item} className="mb-8">
             <span className="font-typewriter text-[10px] tracking-[0.4em] uppercase text-brand-secondary border border-brand-secondary/30 px-3 py-1">The Paradigm</span>
          </motion.div>
          <motion.h1 variants={item} className="text-6xl md:text-[8vw] font-title font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference text-brand-primary">
            Borrowed <br/>
            <span className="text-brand-secondary">But Not</span> <br/>
            Wasted.
          </motion.h1>
          <motion.div variants={item} className="mt-12 md:ml-auto md:w-1/2">
            <p className="font-editorial text-2xl md:text-4xl leading-tight text-brand-primary/80 italic">
              "None of us choose our arrival and departure in this world. Between those two moments lies everything."
            </p>
          </motion.div>
        </motion.section>

        {/* PHILOSOPHY BLOCKS */}
        <section className="space-y-32 md:space-y-48">
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl md:text-5xl font-title font-bold uppercase mb-6 leading-none">The Accumulation<br/>Of Decisions</h2>
              <p className="font-editorial text-xl leading-relaxed text-brand-primary/70">
                History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people. The question was never how much time they had. It was what they did with it.
              </p>
            </motion.div>
            <motion.div 
              style={{ y: y1 }}
              className="order-1 md:order-2 bg-brand-surface border-l-4 border-brand-secondary p-12 aspect-square flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-overlay"></div>
              <span className="font-title text-9xl font-black text-brand-primary/10">01</span>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              style={{ y: y2 }}
              className="bg-brand-primary text-brand-background p-12 aspect-square flex flex-col justify-between relative overflow-hidden"
            >
              <span className="font-typewriter text-xs tracking-widest opacity-50">CRITICAL INQUIRY</span>
              <h3 className="font-title text-4xl uppercase font-black leading-none">A Warming Planet & Artificial Minds</h3>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-title font-bold uppercase mb-6 leading-none">To Inherit &<br/>Reimagine</h2>
              <p className="font-editorial text-xl leading-relaxed text-brand-primary/70">
                We'll explore what it actually means to live responsibly on a warming planet. To grow up alongside artificial intelligence without losing what makes us human. To pursue peace in a world that keeps making war feel inevitable. To inherit systems you didn't design and decide whether to maintain them or reimagine them entirely.
              </p>
            </motion.div>
          </div>

        </section>

        {/* KINETIC CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mt-40 md:mt-64 border-t-2 border-brand-primary pt-20 text-center relative"
        >
          <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-brand-secondary mb-8">Not a conference about doom.</p>
          <h2 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter leading-none mb-12">
            The clock's ticking.<br/>
            The stage is yours.
          </h2>
          <Link 
            to="/tickets" 
            className="inline-flex items-center justify-center px-12 py-6 bg-brand-primary text-brand-background font-title font-bold uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all duration-500 rounded-sm"
          >
            What will you do with the time that's left?
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
