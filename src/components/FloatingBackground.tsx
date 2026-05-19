import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Pencil, BookOpen, Clock, Hourglass, GraduationCap, Library } from 'lucide-react';

interface FloatingItemProps {
  icon: any;
  top: string;
  left: string;
  speed: number;
  size: number;
  rotate?: number;
  key?: any;
}

const FloatingItem = ({ icon: Icon, top, left, speed, size, rotate = 0 }: FloatingItemProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 1000]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.05, 0.1, 0.1, 0.05]);
  
  // High-end depth effect: Blur increases with speed/distance
  const blur = Math.abs(speed) * 40;

  return (
    <motion.div
      className="absolute pointer-events-none z-0 text-brand-primary"
      style={{ 
        top, 
        left, 
        y, 
        opacity, 
        rotate,
        filter: `blur(${blur}px)` 
      }}
    >
      <Icon size={size} strokeWidth={0.5} />
    </motion.div>
  );
};

export default function FloatingBackground() {
  const items = [
    { icon: Pencil, top: '5%', left: '5%', speed: -0.15, size: 24, rotate: 15 },
    { icon: BookOpen, top: '12%', left: '92%', speed: 0.12, size: 48, rotate: -25 },
    { icon: Clock, top: '18%', left: '15%', speed: -0.08, size: 120, rotate: 0 },
    { icon: Hourglass, top: '25%', left: '75%', speed: 0.18, size: 32, rotate: 45 },
    { icon: GraduationCap, top: '32%', left: '5%', speed: -0.1, size: 56, rotate: -15 },
    { icon: Library, top: '40%', left: '88%', speed: 0.05, size: 100, rotate: 10 },
    { icon: Pencil, top: '48%', left: '25%', speed: 0.2, size: 40, rotate: 180 },
    { icon: BookOpen, top: '55%', left: '10%', speed: -0.12, size: 64, rotate: 35 },
    { icon: Clock, top: '62%', left: '82%', speed: 0.15, size: 90, rotate: -10 },
    { icon: Pencil, top: '70%', left: '42%', speed: -0.2, size: 32, rotate: 90 },
    { icon: Hourglass, top: '78%', left: '95%', speed: 0.08, size: 44, rotate: 15 },
    { icon: BookOpen, top: '85%', left: '18%', speed: -0.15, size: 52, rotate: -40 },
    { icon: GraduationCap, top: '92%', left: '72%', speed: 0.1, size: 68, rotate: 25 },
    { icon: Clock, top: '30%', left: '45%', speed: 0.12, size: 30, rotate: 120 },
    { icon: Pencil, top: '65%', left: '60%', speed: -0.1, size: 28, rotate: -90 },
    { icon: Library, top: '80%', left: '35%', speed: 0.05, size: 42, rotate: 15 },
    { icon: BookOpen, top: '45%', left: '30%', speed: 0.18, size: 36, rotate: 60 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {items.map((item, i) => (
        <FloatingItem key={i} {...item} />
      ))}
    </div>
  );
}
