import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import Magnetic from '../components/Magnetic';
import Typewriter from '../components/Typewriter';
import MaskReveal from '../components/MaskReveal';
import FloatingBackground from '../components/FloatingBackground';
import { MechanicalClock, FluidBlob, KineticTypography } from '../components/ModernAnimation';
import HeroParticles from '../components/HeroParticles';

const transition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 60, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 60, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // gamma: -90 to 90 (left/right)
        // beta: -180 to 180 (front/back)
        const xPct = Math.max(-1, Math.min(1, e.gamma / 30));
        const yPct = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        x.set(xPct * 0.5);
        y.set(yPct * 0.5);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [x, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const width = rect.width;
    const height = rect.height;
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

interface EventStatus {
  status: 'upcoming' | 'live';
  eventDate: string;
  daysRemaining: number;
  secondsRemaining: number;
}

interface TicketStatus {
  remaining: number;
  total: number;
  status: string;
}

interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
}

function ParallaxIcon({ icon: Icon, speed, left, top, delay = 0, size = 120 }: { 
  icon: any, 
  speed: number, 
  left: string, 
  top: string, 
  delay?: number,
  size?: number 
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000]);
  const scrollRotate = useTransform(scrollY, [0, 1000], [0, speed * 45]);

  // Unique durations for each icon to avoid synchronized movement
  const floatDuration = 4 + (Math.random() * 3);
  const driftDuration = 5 + (Math.random() * 3);
  const rotateDuration = 7 + (Math.random() * 3);

  return (
    <motion.div
      style={{ y, left, top }}
      className="absolute pointer-events-none text-brand-primary"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.03, 
          scale: 1,
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ 
          opacity: { duration: 1, delay },
          scale: { duration: 1, delay },
          y: { 
            duration: floatDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          x: { 
            duration: driftDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        style={{ rotate: scrollRotate }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ 
            duration: rotateDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Icon size={size} strokeWidth={0.5} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 30, damping: 25 });

  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.05]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 1]);
  const heroRotate = useTransform(smoothProgress, [0, 0.3], [0, 2]);
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 30]);

  const liquidY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const charX = useTransform(smoothProgress, [0, 1], ["0%", "5%"]);
  const circleY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 1]);

  useEffect(() => {
    fetch('/api/event-status')
      .then(res => res.json())
      .then(setEventStatus);
    
    fetch('/api/updates')
      .then(res => res.json())
      .then(setUpdates);
  }, []);


  const hapticTick = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const lastDragPos = useRef(0);
  const handleDrag = (_: any, info: any) => {
    const threshold = 60; // px between ticks
    if (Math.abs(info.point.x - lastDragPos.current) > threshold) {
      hapticTick();
      lastDragPos.current = info.point.x;
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative pt-4"
      ref={containerRef}
    >
      {/* High-End Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-secondary z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Tiny Background Blur Layer as requested */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none backdrop-blur-[1px]"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
      />
      {/* Universal Floating Background */}
      <FloatingBackground />

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#E8F5EE]">
        <HeroParticles />
        {/* Large Decorative "X" Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <span className="text-[80vw] font-title font-black text-brand-primary leading-none">X</span>
        </div>

        <div className="flex-1 w-full max-w-screen-2xl mx-auto px-6 md:px-16 pt-32 pb-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0">
          {/* Left Column */}
          <div className="flex flex-col justify-between h-full py-12">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 text-brand-primary font-bold font-sans text-[10px] md:text-[12px] uppercase tracking-[0.3em] mb-8"
            >
              <div className="w-12 h-[2px] bg-brand-primary" />
              <span>TEDX ALMUNTAZIR SCHOOLS YOUTH · 2026</span>
            </motion.div>

            <motion.div variants={titleVariants} className="max-w-xl">
              <h1 className="text-[12vw] lg:text-[7vw] font-title font-black leading-[0.85] mb-10 group tracking-tighter">
                <span className="block text-brand-primary italic font-editorial lowercase opacity-90 -ml-1 mb-2">We're living on|</span>
                <span className="block text-brand-secondary">BORROWED</span>
                <span className="block text-brand-secondary">TIME.</span>
              </h1>
              
              <p className="font-sans text-xl md:text-2xl text-brand-primary/80 max-w-lg leading-relaxed mb-12">
                The time we have is limited, and what we choose to do with it matters. Join us for a day of reimagining systems, challenging assumptions, and seizing the future.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-auto">
              <div className="inline-flex items-center gap-4 px-8 py-5 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                  <Clock size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-brand-primary text-sm">
                    Event Date: June 14, 2026
                  </span>
                  <span className="font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/40">
                    Nursery Campus, Dar es Salaam
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:border-l lg:border-brand-primary/10 lg:pl-16 flex flex-col justify-between h-full py-12 relative">
            <div className="space-y-12">
              <motion.div variants={itemVariants} className="space-y-4">
                <span className="font-typewriter text-[11px] uppercase tracking-[0.5em] text-brand-primary/40">The Venue</span>
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-title font-black text-brand-primary leading-tight uppercase">
                    ALMUNTAZIR ISLAMIC<br />INTERNATIONAL SCHOOLS
                  </h2>
                  <p className="font-sans text-2xl font-bold text-brand-secondary uppercase tracking-wider">
                    Nursery Campus
                  </p>
                </div>
              </motion.div>

              <div className="w-full h-[1px] bg-brand-primary/10" />

              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-4">
                <div className="space-y-2">
                  <span className="text-6xl font-title font-black text-brand-primary">8+</span>
                  <p className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/60">Speakers</p>
                </div>
                <div className="space-y-2">
                  <span className="text-6xl font-title font-black text-brand-primary">1 Day</span>
                  <p className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/60">OF IDEAS WORTH SPREADING</p>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-20 lg:mt-auto">
              <div className="w-full h-[1px] bg-brand-primary/10 mb-12 hidden lg:block" />
              <Link to="/about#contact" className="group relative block w-full">
                <button className="w-full py-8 md:py-10 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 flex items-center justify-center gap-6 group-hover:bg-brand-primary transition-all duration-500 shadow-xl shadow-brand-primary/5">
                  <span className="font-title text-2xl md:text-3xl font-black uppercase text-brand-primary group-hover:text-white transition-colors tracking-tight">
                    RESERVE YOUR SEAT
                  </span>
                  <div className="w-12 h-12 rounded-full border border-brand-primary/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/10 transition-all">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Plus className="rotate-45 text-brand-primary group-hover:text-white" />
                    </motion.div>
                  </div>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Plus className="rotate-45" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Ticker */}
      <div className="bg-brand-primary py-8 overflow-hidden relative z-20">
        <div className="flex gap-12 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0 animate-marquee text-[10px] font-typewriter uppercase tracking-[0.5em] text-white items-center">
              <span>ANAYA RASHID · THE CULTURE OF TIME</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>ZAHRA DATOO · CHRONOS & KAIROS</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span>MUSTAFA ABBAS · FUTURE PROOFING</span>
              <span className="w-2 h-2 rounded-full bg-brand-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* Agenda Section */}
      <section className="py-32 px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-40"
            >
              <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary mb-4 block">The Assembly</span>
              <h2 className="text-6xl md:text-8xl font-title font-black uppercase text-brand-primary leading-[0.8] tracking-tighter">
                Agenda.<br />
                <span className="opacity-20 text-[0.4em] tracking-normal font-sans block mt-4 uppercase">Time Unfolding</span>
              </h2>
            </motion.div>
          </div>

          <div className="md:col-span-8">
            <div className="relative border-l border-brand-primary/10 pl-8 md:pl-20 py-10 space-y-32">
              {[
                { time: '08:30', title: 'The Arrival', sub: 'Registration & Portal Opening', theme: 'past' },
                { time: '09:30', title: 'Session I: Echoes', sub: 'Foundations and Legacies', theme: 'past' },
                { time: '11:30', title: 'Session II: Presence', sub: 'The Power of Now', theme: 'present' },
                { time: '13:00', title: 'Assembly Break', sub: 'Interactive Exhibitions', theme: 'present' },
                { time: '14:30', title: 'Session III: Reimagining', sub: 'Designing the Future', theme: 'future' },
                { time: '16:30', title: 'The Closing', sub: 'Final Manifesto', theme: 'future' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="absolute -left-[calc(2.5rem+4px)] md:-left-[calc(5rem+4px)] top-2 w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#E8F5EE] border border-brand-primary/10 flex items-center justify-center group-hover:border-brand-secondary transition-colors duration-500 shadow-sm">
                     <span className={`w-2 h-2 rounded-full ${item.theme === 'past' ? 'bg-brand-primary' : (item.theme === 'present' ? 'bg-brand-secondary' : 'bg-brand-primary/40')}`} />
                  </div>
                  
                  <div className="space-y-4">
                    <span className="font-typewriter text-xl md:text-2xl text-brand-primary/30 group-hover:text-brand-secondary transition-colors duration-500">
                      {item.time}
                    </span>
                    <div className="space-y-2">
                       <h3 className="text-4xl md:text-6xl font-title font-black uppercase text-brand-primary tracking-tight">
                         {item.title}
                       </h3>
                       <p className="font-editorial text-2xl text-brand-primary/40 italic">
                         {item.sub}
                       </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-32 px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10 border-t border-brand-outline">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <span className="font-typewriter text-[10px] uppercase tracking-[0.6em] text-brand-secondary">The Location</span>
              <h2 className="text-6xl md:text-8xl font-title font-black uppercase text-brand-primary leading-none tracking-tighter">
                Nursery <br /> Campus.
              </h2>
            </div>
            <div className="space-y-6 font-editorial text-2xl text-brand-primary/60 italic leading-snug">
              <p>AlMuntazir Islamic International Schools</p>
              <p>UN Road, Upanga, Dar es Salaam</p>
              <p>Tanzania</p>
            </div>
            <Link to="/about#contact" className="inline-block px-10 py-4 bg-brand-primary text-white font-title text-sm uppercase tracking-widest rounded-full hover:bg-brand-secondary transition-all">
              Get Directions
            </Link>
          </div>
          <div className="flex-1 w-full aspect-video bg-brand-surface border border-brand-outline rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.7358249826354!2d39.2789178!3d-6.8016466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b10492e86bf%3A0xc68e7ec89f074d28!2sAl-Muntazir%20School%20(Nursery%20Campus)!5e0!3m2!1sen!2stz!4v1715993600000!5m2!1sen!2stz" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
        </div>
      </section>

      {/* Sponsors Strip */}
      <div className="py-20 border-t border-brand-outline bg-brand-surface/30 px-6 md:px-16 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 opacity-30 grayscale saturate-0">
          <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-primary shrink-0">Our Partners</span>
          <div className="flex flex-wrap gap-20 justify-center items-center">
            {/* Empty for now as requested */}
            <div className="h-8 w-32 border border-dashed border-brand-primary/20 rounded flex items-center justify-center text-[8px] uppercase tracking-widest">Headline Sponsor</div>
            <div className="h-8 w-32 border border-dashed border-brand-primary/20 rounded flex items-center justify-center text-[8px] uppercase tracking-widest">Supporting Partner</div>
            <div className="h-8 w-32 border border-dashed border-brand-primary/20 rounded flex items-center justify-center text-[8px] uppercase tracking-widest">Media Partner</div>
          </div>
        </div>
      </div>

      {/* Social Call to Action */}
      <section className="py-40 bg-brand-surface border-y border-brand-outline relative overflow-hidden">
        <div className="absolute inset-0 liquid-bg opacity-[0.02] pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-4">
              <span className="font-typewriter text-xs uppercase tracking-[0.5em] text-brand-primary/30">Spread the Idea</span>
              <h2 className="text-5xl md:text-8xl font-title font-black uppercase text-brand-primary leading-none tracking-tighter">
                Share with someone living on <br />
                <span className="text-brand-secondary italic font-serif lowercase">borrowed time.</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               <a 
                 href={`https://wa.me/?text=${encodeURIComponent("Join us at TEDxAlMuntazirSchoolsYouth 2026: Borrowed Time. June 14, 2026. " + window.location.origin)}`} 
                 target="_blank" rel="noopener noreferrer"
                 className="px-12 py-5 bg-white border border-brand-outline rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-black/5"
               >
                 WhatsApp
               </a>
               <a 
                 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I'm attending TEDxAlMuntazirSchoolsYouth 2026. Join me! #BorrowedTime #TEDx")}&url=${encodeURIComponent(window.location.origin)}`} 
                 target="_blank" rel="noopener noreferrer"
                 className="px-12 py-5 bg-white border border-brand-outline rounded-full font-typewriter text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-black/5"
               >
                 Twitter
               </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="pt-20" />
    </motion.div>
  );
}
