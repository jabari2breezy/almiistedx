import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

export default function FloatingCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text'>('default');
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0, active: false });
  const [coordinateText, setCoordinateText] = useState("[ INDEX_00 ]");

  const springConfig = { damping: 40, stiffness: 250, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Base rotation for the sweeping hand
  const [baseRotation, setBaseRotation] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let tickCounter = 0;
    let animationFrameId: number;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      setHoverType((currentHover) => {
        if (currentHover === 'default') {
          // Continuous buttery smooth sweep (approx 60 deg per second)
          setBaseRotation(prev => (prev + (deltaTime * 0.06)) % 360);
        } else if (currentHover === 'text') {
          // 4Hz Ticking Resistance (moves 4 times a second, jumping)
          tickCounter += deltaTime;
          if (tickCounter > 250) { // 250ms = 4Hz
            setBaseRotation(prev => (prev + 15) % 360);
            tickCounter = 0;
          }
        }
        return currentHover;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, .interactive');
      const text = target.closest('h1, h2, h3, p');

      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Update coordinate text based on position to simulate data tracking
        setCoordinateText(`[ X_${Math.round(centerX)} Y_${Math.round(centerY)} ]`);

        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        if (dist < 60) {
          setMagneticPos({ x: centerX, y: centerY, active: true });
          setHoverType('button');
        } else {
          setMagneticPos({ x: 0, y: 0, active: false });
          setHoverType('button');
        }
      } else if (text) {
        setHoverType('text');
        setMagneticPos({ x: 0, y: 0, active: false });
      } else {
        setHoverType('default');
        setMagneticPos({ x: 0, y: 0, active: false });
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="hidden md:block pointer-events-none z-[9999]">
      {/* 1. The Axle (The Core) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-secondary rounded-full"
        style={{
          x: magneticPos.active ? magneticPos.x : mouseX,
          y: magneticPos.active ? magneticPos.y : mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* The Escapement Gear Boundary & Indicator Hand container */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center overflow-visible"
        style={{
          x: magneticPos.active ? magneticPos.x : smoothX,
          y: magneticPos.active ? magneticPos.y : smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: 50,
          height: 50,
          borderWidth: 1,
        }}
        animate={{ 
          scale: hoverType === 'button' ? 0.4 : (hoverType === 'text' ? 1.5 : 1),
          borderColor: hoverType === 'button' ? '#006d38' : '#000839', // brand-secondary vs brand-primary
          backgroundColor: hoverType === 'text' ? '#000839' : 'transparent', // Acts as mask over text
          mixBlendMode: hoverType === 'text' ? 'difference' : 'normal',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* 2. The Indicator (The Hand) */}
        <motion.div 
          className="absolute w-[1px] bg-white origin-bottom"
          style={{ height: '50%', bottom: '50%' }}
          animate={{
            rotate: hoverType === 'button' ? 0 : baseRotation,
            opacity: hoverType === 'button' ? 0 : 1, // Optional: hide hand when snapped tight
          }}
          transition={{ 
            rotate: { type: hoverType === 'button' ? 'spring' : false, stiffness: 300, damping: 20 }
          }}
        />
      </motion.div>

      {/* 3. Button Hover Data Coordinates */}
      <AnimatePresence>
        {hoverType === 'button' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 30 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 left-0 font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-primary font-bold whitespace-nowrap"
            style={{
              x: magneticPos.active ? magneticPos.x : smoothX,
              y: magneticPos.active ? magneticPos.y : smoothY,
              translateY: '-50%',
            }}
          >
            {coordinateText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
