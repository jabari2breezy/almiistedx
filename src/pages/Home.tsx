import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import Magnetic from '../components/Magnetic';
import Typewriter from '../components/Typewriter';
import MaskReveal from '../components/MaskReveal';
import FloatingBackground from '../components/FloatingBackground';
import { MechanicalClock, FluidBlob, KineticTypography } from '../components/ModernAnimation';

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
      <div className="px-6 md:px-16 py-4 pb-8 flex flex-col relative overflow-hidden">
        {/* Modern Mechanical Clock - Background */}
        <MechanicalClock 
          className="absolute right-[-10%] top-1/4 w-[50vw] h-[50vw] text-brand-primary pointer-events-none"
        />

        {/* Fluid Background Blob */}
        <FluidBlob 
          className="absolute left-[-20%] bottom-[-20%] w-[80vw] h-[80vw] text-brand-secondary pointer-events-none"
        />

        {/* Kinetic Typography - Foreground Layer */}
        <KineticTypography 
          text="BORROWED TIME" 
          className="absolute top-1/4 left-0 w-full z-0 pointer-events-none"
        />

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
          <motion.div style={{ opacity: textOpacity }} className="flex flex-col gap-2 mb-4">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 text-brand-secondary font-typewriter text-[10px] uppercase tracking-[0.8em]"
            >
              <div className="w-16 h-[1px] bg-brand-secondary/40" />
              {eventStatus ? `${eventStatus.daysRemaining} DAYS REMAINING` : 'Event / 14th June 2026'}
            </motion.div>
            
            <div className="pt-2 relative">
              <MaskReveal delay={0.4} className="text-brand-primary">
                <h1 className="text-[14vw] md:text-[12vw] font-title font-black tracking-tighter leading-[0.7] uppercase flex flex-col items-start">
                  TED<span className="text-brand-secondary">x</span>
                </h1>
              </MaskReveal>
              <MaskReveal delay={0.6} className="text-brand-primary">
                <div className="flex flex-col -mt-4 md:-mt-8">
                  <div className="text-[6vw] md:text-[4vw] font-title font-black tracking-tighter leading-none uppercase flex items-baseline gap-4">
                    <span className="italic font-editorial lowercase text-brand-secondary">AlMuntazir</span>
                    <span>Schools</span>
                    <span className="text-brand-secondary">Youth</span>
                  </div>
                  <div className="text-[10vw] md:text-[8vw] font-title font-black tracking-tighter leading-none uppercase mt-2">
                    2026
                  </div>
                </div>
              </MaskReveal>

{/* Premium Ticker Overlay */}
<div className="absolute top-[35%] -right-20 rotate-90 origin-left hidden lg:block pointer-events-none">
  <div className="marquee-container opacity-20">
    <div className="marquee-content flex gap-8 whitespace-nowrap">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-[10px] font-mono uppercase tracking-[1em] text-brand-primary">
          Borrowed Time / 14.06.26 / Limited Assembly
        </span>
      ))}
    </div>
  </div>
</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-6">
            <motion.div 
              className="md:col-span-12 lg:col-span-7"
              variants={itemVariants}
            >
            <div className="font-editorial text-3xl md:text-5xl text-brand-primary leading-[1.1] italic">
                <Typewriter text="We're living on" delay={0.5} speed={10} className="inline-block" /> <span className="text-brand-secondary font-title not-italic uppercase">Borrowed Time</span>. 
              </div>
              <p className="mt-8 font-sans text-xl text-brand-primary/70 max-w-4xl leading-relaxed">
                <Typewriter text="This theme explores the idea that the time we have individually and collectively is limited, and what we choose to do with it matters. Inviting conversations on the systems, choices and moments that shape our world, whether that means preserving the past, fixing the present or reimagining a new future." delay={0.8} speed={5} />
              </p>
            </motion.div>

            <motion.div
              className="md:col-span-12 lg:col-span-5 flex flex-col gap-8 lg:text-right lg:items-end"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-3 font-typewriter text-[12px] uppercase tracking-[0.3em] text-brand-primary w-full">
                <span className="opacity-40">Location</span>
                <span className="text-brand-secondary font-black border-l-2 lg:border-l-0 lg:border-r-2 border-brand-secondary pl-4 lg:pl-0 lg:pr-4 py-1 leading-relaxed break-words">
                  ALMUNTAZIR ISLAMIC INTERNATIONAL SCHOOLS - Nursery Campus
                </span>
              </div>

              {/* Status Indicator */}
              {eventStatus?.status === 'live' && (
                <div className="bg-brand-secondary/10 border border-brand-secondary p-8 rounded-3xl flex items-center gap-4 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="font-title uppercase font-black text-brand-secondary">Assembly is Live</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
