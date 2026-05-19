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
    <span className={`${className} relative inline-grid grid-cols-1 grid-rows-1`}>
      {/* Spacer to reserve layout space */}
      <span className="invisible select-none pointer-events-none col-start-1 row-start-1">
        {text}
      </span>
      {/* Actual typing text */}
      <span className="col-start-1 row-start-1">
        {displayedText}
        <AnimatePresence>
          {!isComplete && (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundColor: cursorColor }}
              className="inline-block w-[0.15em] h-[1em] ml-1 align-middle"
            />
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}
