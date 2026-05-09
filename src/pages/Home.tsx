import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ArrowUpRight, Clock, Hourglass, Watch, Timer, History, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import Magnetic from '../components/Magnetic';
import CharReveal from '../components/CharReveal';

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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2, 
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
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroRotate = useTransform(smoothProgress, [0, 0.3], [0, 2]);
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 30]);

  const liquidY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const charX = useTransform(smoothProgress, [0, 1], ["0%", "5%"]);
  const circleY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);

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
      exit={{ opacity: 0 }}
      className="pt-40"
      ref={containerRef}
    >
      {/* Hero Section */}
      <div className="px-6 md:px-16 py-20 min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        {/* Parallax Time Icons */}
        <ParallaxIcon icon={Clock} speed={0.05} left="10%" top="15%" size={200} />
        <ParallaxIcon icon={Hourglass} speed={0.15} left="85%" top="5%" size={180} />
        <ParallaxIcon icon={Watch} speed={-0.1} left="70%" top="60%" size={150} />
        <ParallaxIcon icon={Timer} speed={0.08} left="5%" top="75%" size={220} />
        <ParallaxIcon icon={History} speed={-0.05} left="40%" top="10%" size={120} />
        <ParallaxIcon icon={Clock} speed={0.12} left="25%" top="85%" size={180} />
        <ParallaxIcon icon={Hourglass} speed={-0.2} left="90%" top="40%" size={140} />

        {/* Dynamic Background Elements with Parallax */}
        <motion.div 
          style={{ y: liquidY }}
          className="absolute inset-0 liquid-bg opacity-20 pointer-events-none" 
        />
        
        {/* Floating Background Text/Shapes */}
        <motion.div 
          style={{ x: charX, opacity: 0.05 }}
          className="absolute -top-20 -right-20 pointer-events-none select-none"
        >
          <span className="text-[40vw] font-title font-black text-brand-primary leading-none">X</span>
        </motion.div>

        <motion.div 
          style={{ y: circleY }}
          className="absolute top-1/2 left-1/4 w-96 h-96 border border-brand-secondary/10 rounded-full pointer-events-none"
        />

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity, rotateX: heroRotate, y: heroY }}
          className="max-w-screen-2xl mx-auto w-full relative z-10"
        >
          <motion.div style={{ opacity: textOpacity }} className="flex flex-col gap-2 mb-20">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 text-brand-secondary font-typewriter text-[10px] uppercase tracking-[0.8em]"
            >
              <div className="w-16 h-[1px] bg-brand-secondary/40" />
              {eventStatus ? `${eventStatus.daysRemaining} DAYS REMAINING` : 'Event / 14th June 2026'}
            </motion.div>
            
            <motion.h1 
              variants={titleVariants}
              className="text-[12vw] md:text-[10vw] font-title font-black tracking-tighter leading-[0.78] uppercase flex flex-col pt-8 text-brand-primary"
            >
              <CharReveal text="TEDx" delay={0.5} />
              <div className="flex items-baseline gap-4">
                <span className="italic font-editorial lowercase -ml-4 pr-4 text-brand-secondary">AlMuntazir</span>
                <CharReveal text="2026" delay={0.8} />
              </div>
            </motion.h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <motion.div 
              className="md:col-span-8 lg:col-span-7"
              variants={itemVariants}
            >
            <p className="font-editorial text-3xl md:text-5xl text-brand-primary leading-[1.1] italic">
                <CharReveal text="We're living on" delay={1} className="inline-block" /> <span className="text-brand-secondary font-title not-italic uppercase">Borrowed Time</span>. 
              </p>
              <p className="mt-8 font-sans text-xl text-brand-primary/70 max-w-3xl leading-relaxed">
                <CharReveal text="This theme explores the idea that the time we have individually and collectively is limited, and what we choose to do with it matters. Inviting conversations on the systems, choices and moments that shape our world, whether that means preserving the past, fixing the present or reimagining a new future." delay={1.2} />
              </p>
            </motion.div>

            <motion.div
              className="md:col-start-9 md:col-span-4 flex flex-col gap-8"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-2 font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">
                <span>Location</span>
                <span className="text-brand-primary font-bold">ALMUNTAZIR ISLAMIC INTERNATIONAL SCHOOL - Nursery Campus</span>
              </div>

              {/* Countdown or Register Link */}
              {eventStatus?.status === 'live' ? (
                <div className="bg-brand-secondary/10 border border-brand-secondary p-8 rounded-3xl flex items-center gap-4 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="font-title uppercase font-black text-brand-secondary">Assembly is Live</span>
                </div>
              ) : (
                <Magnetic strength={0.2} className="w-full">
                  <Link 
                    to="/speakers" 
                    onClick={hapticTick}
                    className="brutalist-button w-full group !bg-brand-secondary !text-white border-transparent"
                  >
                    <span className="flex items-center gap-6">
                      MEET THE SPEAKERS <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                    </span>
                  </Link>
                </Magnetic>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Latest Updates Section */}
      <section className="px-6 md:px-16 py-20 border-t border-brand-outline bg-brand-surface/50 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Zap size={20} className="text-brand-secondary" />
              <h3 className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-primary/40">Latest Updates</h3>
            </div>
            <div className="md:hidden font-typewriter text-[8px] uppercase tracking-widest text-brand-secondary border border-brand-secondary/30 px-3 py-1 rounded-full animate-pulse">
              Swipe to explore
            </div>
          </div>
          
          <motion.div 
            drag="x"
            onDrag={handleDrag}
            onDragStart={() => { lastDragPos.current = 0; hapticTick(); }}
            dragConstraints={{ left: -600, right: 0 }}
            dragElastic={0.2}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-max md:min-w-0"
          >
            {updates.length === 0 ? (
                [1,2,3].map(i => <div key={i} className="w-[80vw] md:w-full h-40 bg-brand-outline/20 rounded-3xl animate-pulse" />)
            ) : (
              updates.map((update, idx) => (
                <div key={update.id} className="w-[85vw] md:w-full h-full flex-shrink-0">
                  <TiltCard>
                    <motion.div 
                      onPointerDown={hapticTick}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-3xl border border-brand-outline hover:border-brand-secondary/30 transition-colors h-full shadow-sm"
                    >
                      <span className="text-[10px] font-typewriter text-brand-secondary mb-4 block uppercase tracking-widest">{update.date}</span>
                      <h4 className="font-title text-xl text-brand-primary mb-3 uppercase">{update.title}</h4>
                      <p className="font-editorial text-lg text-brand-primary/60 italic leading-tight">{update.content}</p>
                    </motion.div>
                  </TiltCard>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Manifest Section */}
      <section className="px-6 md:px-16 py-40 max-w-screen-2xl mx-auto border-t border-brand-outline relative overflow-hidden">
        {/* Parallax Time Icons for Manifest section */}
        <ParallaxIcon icon={Timer} speed={-0.12} left="80%" top="20%" size={250} />
        <ParallaxIcon icon={Clock} speed={0.06} left="60%" top="70%" size={200} />
        <ParallaxIcon icon={History} speed={0.18} left="15%" top="50%" size={180} />
        <ParallaxIcon icon={Watch} speed={-0.08} left="35%" top="15%" size={130} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-7xl md:text-9xl font-title font-black leading-[0.8] uppercase text-brand-primary">
              The <br /><span className="text-brand-secondary italic lowercase">Horizons.</span>
            </h2>
            <p className="font-sans text-2xl text-brand-primary/80 leading-relaxed max-w-xl">
              This theme explores the idea that the time we have individually and collectively is limited, and what we choose to do with it matters. 
              Inviting conversations on the systems, choices and moments that shape our world.
            </p>
          </motion.div>
          
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-8 md:pb-0 gap-8 min-w-max md:min-w-0 md:space-y-12 no-scrollbar">
            {[
              { 
                title: 'Preserving the Past', 
                sub: 'Heritage', 
                text: 'The debt we inherited from history. Understanding the foundations that shape our current reality.' 
              },
              { 
                title: 'Fixing the Present', 
                sub: 'Urgency', 
                text: 'The only moment we actually have. Using the present to address the challenges of our time.' 
              },
              { 
                title: 'Reimagining a Future', 
                sub: 'Legacy', 
                text: 'The worlds we will never inhabit. Defining our responsibility for the generations to come.' 
              }
            ].map((item, i) => (
              <div key={item.title} className="w-[85vw] md:w-full flex-shrink-0">
                <TiltCard>
                  <motion.div 
                    onClick={hapticTick}
                    className="p-10 border border-brand-outline rounded-3xl hover:border-brand-secondary transition-all group bg-white/80 backdrop-blur-sm shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-typewriter text-[10px] text-brand-secondary uppercase tracking-[0.4em]">Unit_0{i+1}</span>
                      <span className="font-editorial text-sm italic text-brand-primary/30 uppercase">{item.sub}</span>
                    </div>
                    <h4 className="font-title text-3xl uppercase text-brand-primary mb-4">{item.title}</h4>
                    <p className="font-editorial text-xl text-brand-primary/60 italic leading-tight group-hover:text-brand-primary transition-colors">{item.text}</p>
                  </motion.div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

    </motion.div>
  );
}
