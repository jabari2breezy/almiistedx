import { motion } from 'motion/react';
import React from 'react';

interface MaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'center';
  className?: string;
}

export default function MaskReveal({ children, delay = 0, direction = 'up', className = "" }: MaskRevealProps) {
  const variants = {
    hidden: {
      clipPath: direction === 'center' 
        ? 'inset(50% 50% 50% 50%)' 
        : direction === 'up' 
          ? 'inset(100% 0% 0% 0%)' 
          : 'inset(0% 0% 100% 0%)',
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0
    },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
}
