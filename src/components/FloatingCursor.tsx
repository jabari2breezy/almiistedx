import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

export default function FloatingCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text' | 'card' | 'view'>('default');
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0, active: false });

  const springConfig = { damping: 40, stiffness: 250, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Refined Spring for the ring size and scale
  const ringScale = useSpring(1, { damping: 20, stiffness: 100 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, .interactive');
      const card = target.closest('.group');
      const view = target.closest('.view-target');
      
      if (view) {
        setHoverType('view');
        setMagneticPos({ x: 0, y: 0, active: false });
        ringScale.set(2.5);
      } else if (card && !interactive) {
        setHoverType('card');
        setMagneticPos({ x: 0, y: 0, active: false });
        ringScale.set(2.5);
      } else if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        if (dist < 50) {
          setMagneticPos({ x: centerX, y: centerY, active: true });
          setHoverType('button');
          ringScale.set(1.5);
        } else {
          setMagneticPos({ x: 0, y: 0, active: false });
          setHoverType('button');
          ringScale.set(1.2);
        }
      } else if (target.closest('h1, h2, h3, p')) {
        setHoverType('text');
        setMagneticPos({ x: 0, y: 0, active: false });
        ringScale.set(2.5);
      } else {
        setHoverType('default');
        setMagneticPos({ x: 0, y: 0, active: false });
        ringScale.set(1);
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-brand-secondary rounded-full pointer-events-none z-[400] hidden md:block"
        style={{
          x: magneticPos.active ? magneticPos.x : mouseX,
          y: magneticPos.active ? magneticPos.y : mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-brand-secondary/30 pointer-events-none z-[400] hidden md:block mix-blend-difference flex items-center justify-center overflow-hidden"
        style={{
          x: magneticPos.active ? magneticPos.x : smoothX,
          y: magneticPos.active ? magneticPos.y : smoothY,
          scale: ringScale,
          translateX: '-50%',
          translateY: '-50%',
          width: 40,
          height: 40,
        }}
        animate={{ 
          backgroundColor: hoverType === 'text' ? 'rgba(255, 255, 255, 1)' : (hoverType === 'card' ? 'rgba(0, 168, 89, 1)' : 'rgba(255, 255, 255, 0)'),
          borderColor: hoverType === 'button' ? 'rgba(0, 168, 89, 1)' : 'rgba(0, 168, 89, 0.3)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
      >
        {/* Clock Hand */}
        <motion.div 
          className="absolute h-1/2 w-[1px] bg-brand-secondary origin-bottom bottom-1/2"
          style={{ rotate: rotation }}
        />
        <div className="absolute w-1 h-1 rounded-full bg-brand-secondary" />

        <AnimatePresence>
          {hoverType === 'view' && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute font-typewriter text-[8px] uppercase tracking-widest text-brand-secondary font-bold"
            >
              EXPLORE
            </motion.span>
          )}
          {hoverType === 'card' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[4px] font-black uppercase tracking-widest text-white"
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
