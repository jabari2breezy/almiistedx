import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Use either mouse or tilt for spotlight
  const inputX = useMotionValue(0);
  const inputY = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      inputX.set(window.innerWidth / 2);
      inputY.set(window.innerHeight / 2);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      inputX.set(e.clientX);
      inputY.set(e.clientY);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // beta: -180 to 180, gamma: -90 to 90
        const x = (e.gamma / 30) * (window.innerWidth / 2) + (window.innerWidth / 2);
        const y = ((e.beta - 45) / 30) * (window.innerHeight / 2) + (window.innerHeight / 2);
        setTilt({ x, y });
        inputX.set(x);
        inputY.set(y);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Spotlight effect (GitBook style)
  const spotlightX = useSpring(inputX, { stiffness: 150, damping: 40 });
  const spotlightY = useSpring(inputY, { stiffness: 150, damping: 40 });

  // Dynamic colors based on scroll (Spotify style)
  const bgGradient = useTransform(
    smoothY,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 0% 0%, rgba(0, 168, 89, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0, 43, 91, 0.2) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(0, 168, 89, 0.1) 0%, transparent 70%), radial-gradient(circle at 0% 100%, rgba(0, 43, 91, 0.3) 0%, transparent 50%)',
      'radial-gradient(circle at 100% 0%, rgba(0, 168, 89, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(0, 43, 91, 0.4) 0%, transparent 50%)'
    ]
  );

  return (
    <motion.div 
      ref={containerRef} 
      style={{ background: bgGradient }}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-brand-background transition-colors duration-1000"
    >
      {/* GitBook Style Spotlight */}
      <motion.div 
        className="absolute inset-0 z-10 opacity-[0.4]"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]) => `radial-gradient(circle 400px at ${x}px ${y}px, rgba(0, 168, 89, 0.08), transparent 80%)`
          ),
        }}
      />

      {/* Yuna-Style Fluid Blobs */}
      <div className="absolute inset-0 blur-[100px] opacity-20">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 90, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-brand-primary"
        />
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 120, -60, 0],
            scale: [1.1, 0.8, 1.2, 1.1],
            rotate: [0, -120, 120, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-secondary"
        />
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, 60, -80, 0],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-brand-primary/40"
        />
      </div>

      {/* Borrowed Time: Floating Particles for Depth */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * windowSize.width, 
              y: Math.random() * windowSize.height,
              opacity: Math.random() * 0.3
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-brand-secondary rounded-full"
          />
        ))}
      </div>

      {/* Grid Pattern (Interacts with spotlight) */}
      <div 
        className="absolute inset-0 z-[5] opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #002B5B 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </motion.div>
  );
}
