import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

export default function MobileInteractivity() {
  const [showPermission, setShowPermission] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    
    // Check if orientation permission is already granted or needed
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setShowPermission(true);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const response = await (DeviceOrientationEvent as any).requestPermission();
      if (response === 'granted') {
        setShowPermission(false);
        window.location.reload(); // Reload to activate listeners
      }
    } catch (error) {
      console.error('Orientation permission error:', error);
    }
  };

  if (!isMobile || !showPermission) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-6 right-6 z-[400] flex justify-center"
      >
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={requestPermission}
          className="bg-brand-secondary text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-[0_20px_50px_rgba(0,168,89,0.3)] border border-white/20 backdrop-blur-xl"
        >
          <div className="relative">
            <Zap size={20} className="relative z-10" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white rounded-full -m-1"
            />
          </div>
          <div className="flex flex-col items-start leading-none group">
            <span className="font-typewriter text-[10px] uppercase tracking-widest font-bold">Enhance Experience</span>
            <span className="font-editorial text-[9px] lowercase italic opacity-60 mt-1">enable motion & depth.</span>
          </div>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
