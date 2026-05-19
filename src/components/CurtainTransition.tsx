import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const };

export default function CurtainTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('idle');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('starting');
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('ending');
      }, 900); // Slightly longer for 'silky' feel

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      {/* Curtain Layer */}
      <motion.div
        className="fixed inset-0 bg-brand-primary z-[500] pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={{ 
          scaleY: transitionStage === 'starting' ? 1 : 0,
          transformOrigin: transitionStage === 'starting' ? 'top' : 'bottom'
        }}
        transition={transition}
        onAnimationComplete={() => {
          if (transitionStage === 'ending') setTransitionStage('idle');
        }}
      />
      
      {/* Branding Reveal during curtain */}
      <motion.div
        className="fixed inset-0 z-[501] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: transitionStage === 'starting' ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-white font-title text-4xl font-black tracking-tighter uppercase italic">
          Borrowed <span className="text-brand-secondary">Time</span>
        </div>
      </motion.div>
    </>
  );
}
