import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function FloatingCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(
        !!target.closest('button') || 
        !!target.closest('a') || 
        target.classList.contains('interactive')
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Central Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-secondary rounded-full pointer-events-none z-[300] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Elastic Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-brand-secondary/30 pointer-events-none z-[300] hidden md:block"
        animate={{ 
          width: isHovering ? 60 : 32, 
          height: isHovering ? 60 : 32,
          borderWidth: isHovering ? 1 : 1,
          borderColor: isHovering ? 'rgba(0, 168, 89, 0.8)' : 'rgba(0, 168, 89, 0.3)'
        }}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      />
    </>
  );
}
