import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/**
 * Modern UI/UX experts use code-driven motion. 
 * This component provides sophisticated, minimal aesthetics for the TEDx theme.
 */

export const MechanicalClock = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
        
        {/* Hour Hand */}
        <motion.line
          x1="50" y1="50" x2="50" y2="28"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50%", originY: "50%" }}
        />
        
        {/* Minute Hand */}
        <motion.line
          x1="50" y1="50" x2="50" y2="18"
          stroke="currentColor" strokeWidth="0.8"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Pulsing center */}
        <motion.circle 
          cx="50" cy="50" r="2" 
          fill="currentColor"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

export const FluidBlob = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-30 blur-3xl">
        <motion.path
          fill="currentColor"
          animate={{
            d: [
              "M45,-65.3C58.7,-58.5,70.1,-45,76.6,-29.4C83.2,-13.8,84.9,3.8,79.7,18.8C74.5,33.8,62.3,46.2,48.5,55.5C34.7,64.8,17.4,71,-1.2,72.6C-19.8,74.2,-39.6,71.2,-54.2,60.8C-68.8,50.3,-78.2,32.4,-81.4,13.8C-84.6,-4.8,-81.6,-24.1,-71.8,-39.1C-61.9,-54.1,-45.3,-64.8,-29.2,-70.5C-13.1,-76.3,2.4,-77.1,17.9,-72.1C33.4,-67.1,48.1,-56.3,45,-65.3Z",
              "M43.7,-64.5C55.4,-56.2,62.1,-41.2,66.8,-26.4C71.5,-11.6,74.2,3.1,70.9,16.5C67.6,29.9,58.3,42,46.4,50.1C34.5,58.2,20,62.3,4.4,61.1C-11.2,59.9,-27.9,53.4,-41.8,43.2C-55.7,33,-66.8,19,-71.2,2.8C-75.6,-13.4,-73.3,-31.8,-63.1,-43.3C-53,-54.8,-35,-59.4,-19.7,-65.2C-4.4,-71,8.1,-78.1,23.3,-76.2C38.4,-74.3,56.3,-63.3,43.7,-64.5Z",
              "M45,-65.3C58.7,-58.5,70.1,-45,76.6,-29.4C83.2,-13.8,84.9,3.8,79.7,18.8C74.5,33.8,62.3,46.2,48.5,55.5C34.7,64.8,17.4,71,-1.2,72.6C-19.8,74.2,-39.6,71.2,-54.2,60.8C-68.8,50.3,-78.2,32.4,-81.4,13.8C-84.6,-4.8,-81.6,-24.1,-71.8,-39.1C-61.9,-54.1,-45.3,-64.8,-29.2,-70.5C-13.1,-76.3,2.4,-77.1,17.9,-72.1C33.4,-67.1,48.1,-56.3,45,-65.3Z"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
};

export const KineticTypography = ({ text, className = "" }: { text: string, className?: string }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  const skew = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x, skewX: skew, opacity }} className="flex gap-20">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[25vh] font-black uppercase tracking-tighter text-brand-primary/10 select-none font-title italic">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const ModernSandglass = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 150" className="w-full h-full text-brand-secondary opacity-40">
        {/* Frame */}
        <polyline points="20,10 80,10" fill="none" stroke="currentColor" strokeWidth="2" />
        <polyline points="20,140 80,140" fill="none" stroke="currentColor" strokeWidth="2" />
        
        {/* Glass Container */}
        <path 
          d="M30,10 L70,10 C70,10 70,60 50,75 C30,60 30,10 30,10 Z" 
          fill="none" stroke="currentColor" strokeWidth="1" 
        />
        <path 
          d="M30,140 L70,140 C70,140 70,90 50,75 C30,90 30,140 30,140 Z" 
          fill="none" stroke="currentColor" strokeWidth="1" 
        />

        {/* Animating Sand - Top */}
        <motion.path
          fill="currentColor"
          animate={{
            d: [
              "M35,15 L65,15 C65,15 65,55 50,70 C35,55 35,15 35,15 Z",
              "M50,70 L50,70 C50,70 50,70 50,70 C50,70 50,70 50,70 Z",
              "M35,15 L65,15 C65,15 65,55 50,70 C35,55 35,15 35,15 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animating Sand - Bottom */}
        <motion.path
          fill="currentColor"
          animate={{
            d: [
              "M50,75 L50,75 C50,75 50,75 50,75 C50,75 50,75 50,75 Z",
              "M35,135 L65,135 C65,135 65,95 50,80 C35,95 35,135 35,135 Z",
              "M50,75 L50,75 C50,75 50,75 50,75 C50,75 50,75 50,75 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Droplets */}
        <motion.circle 
          r="1" fill="currentColor"
          animate={{ 
            cy: [75, 130],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          cx="50"
        />
      </svg>
    </div>
  );
};

export const DigitalNetwork = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-brand-primary opacity-40">
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50px", originY: "50px" }}
        >
          {/* Neural Network Style Connections */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 10 * Math.cos(rad);
            const y1 = 50 + 10 * Math.sin(rad);
            const x2 = 50 + 40 * Math.cos(rad);
            const y2 = 50 + 40 * Math.sin(rad);
            return (
              <React.Fragment key={i}>
                <motion.line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="currentColor" strokeWidth="0.15"
                  strokeDasharray="2 4"
                  animate={{ strokeDashoffset: [0, -10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  cx={x2} cy={y2} r="1.2"
                  fill="currentColor"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                />
              </React.Fragment>
            );
          })}
          
          {/* Inner Core */}
          <motion.circle 
            cx="50" cy="50" r="8" 
            fill="none" stroke="currentColor" strokeWidth="0.5"
            strokeDasharray="1 2"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </motion.g>
        
        {/* Deep Orbital Rings */}
        {[35, 45, 55].map((r, i) => (
          <motion.circle
            key={i}
            cx="50" cy="50" r={r}
            fill="none" stroke="currentColor" strokeWidth="0.05"
            strokeDasharray={i === 1 ? "1 5" : "1 10"}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />
        ))}
      </svg>
    </div>
  );
};
