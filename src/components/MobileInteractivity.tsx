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
        <button 
          onClick={requestPermission}
          className="bg-brand-secondary text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg active:scale-95 transition-transform"
        >
          <Zap size={18} className="animate-pulse" />
          <span className="font-typewriter text-[10px] uppercase tracking-widest font-bold">Enable Motion Effects</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
