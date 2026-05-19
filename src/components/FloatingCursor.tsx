import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useVelocity, useTransform, AnimatePresence } from 'motion/react';

export default function FloatingCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text'>('default');

  // Core springs for smooth tracking
  const springConfig = { damping: 40, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Velocity tracking for anamorphic 3D skewing
  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  // 3D Rotations mapped from velocity (Isometric tilt)
  const rotateX = useTransform(velocityY, [-1000, 1000], [45, -45]);
  const rotateY = useTransform(velocityX, [-1000, 1000], [-45, 45]);

  const [baseRotation, setBaseRotation] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      setHoverType((currentHover) => {
        if (currentHover === 'default') {
          // Continuous, slow gyroscopic rotation (self-winding rotor)
          setBaseRotation(prev => (prev + (deltaTime * 0.08)) % 360);
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
      const text = target.closest('h1, h2, h3, p, span');

      if (interactive) {
        setHoverType('button');
      } else if (text) {
        setHoverType('text');
      } else {
        setHoverType('default');
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Caliper dynamic compression angle
  const caliperAngle = hoverType === 'text' ? 0 : 60; // 120 spread defaults to 0 on text

  return (
    <motion.div 
      className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        perspective: 800, // Enables 3D space
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          // Only tilt in ambient mode, snap flat on hover
          rotateX: hoverType === 'default' ? rotateX : 0,
          rotateY: hoverType === 'default' ? rotateY : 0,
          // Snap rotation to 0 (vertical) on text/button hover
          rotateZ: hoverType === 'default' ? baseRotation : 0,
        }}
        animate={{ 
          // Scale down significantly on button hover (The Plunger drop)
          scale: hoverType === 'button' ? 0.6 : 1,
        }}
        transition={{ 
          scale: { type: 'spring', bounce: 0.6, duration: 0.8 },
          rotateX: { type: 'spring', damping: 30, stiffness: 200 },
          rotateY: { type: 'spring', damping: 30, stiffness: 200 },
          rotateZ: { type: 'spring', damping: 40, stiffness: 300 }
        }}
      >
        {/* 3. The Counter-Weight (Deep Blue Segmented Ring) */}
        <motion.div
          className="absolute rounded-full border-[1.5px]"
          style={{ 
            width: '100%', 
            height: '100%', 
            borderTopColor: 'transparent', 
            borderRightColor: 'transparent',
            // Default: floats behind (Z: -30)
          }}
          animate={{
            translateZ: hoverType === 'button' ? 0 : -30,
            backgroundColor: hoverType === 'button' ? '#006d38' : 'transparent',
            borderColor: hoverType === 'button' ? '#006d38' : '#000839'
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        />

        {/* 2. The Escapement Bridge (White Caliper Arms) */}
        <motion.div
          className="absolute origin-bottom w-[1.5px] bg-white mix-blend-difference"
          style={{ height: '45%', bottom: '50%' }}
          animate={{ 
            rotate: caliperAngle, 
            x: hoverType === 'text' ? 12 : 0, // Bracket outwards
            height: hoverType === 'text' ? '60%' : '45%' // Stretch to bracket text
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        />
        <motion.div
          className="absolute origin-bottom w-[1.5px] bg-white mix-blend-difference"
          style={{ height: '45%', bottom: '50%' }}
          animate={{ 
            rotate: -caliperAngle, 
            x: hoverType === 'text' ? -12 : 0, // Bracket outwards
            height: hoverType === 'text' ? '60%' : '45%'
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        />

        {/* 1. The Core Jewel (Green Pivot) */}
        <div className="absolute w-2 h-2 bg-brand-secondary rotate-45 z-10 shadow-[0_0_10px_rgba(0,109,56,0.5)]" />
      </motion.div>
    </motion.div>
  );
}
