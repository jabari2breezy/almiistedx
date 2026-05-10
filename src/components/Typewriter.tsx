import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cursorColor?: string;
}

export default function Typewriter({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 25,
  cursorColor = "#00A859" 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || isComplete) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, text, isStarted, isComplete, speed]);

  return (
    <span className={`${className} inline relative`}>
      {displayedText}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block w-[0.1em] h-[1em] ml-1 bg-brand-secondary align-middle"
      />
    </span>
  );
}
