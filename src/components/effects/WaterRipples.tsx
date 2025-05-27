
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
  maxSize: number;
  duration: number;
}

const WaterRipples: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  const addRipple = useCallback((e: MouseEvent) => {
    if (!mounted) return;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(), 
      x: e.clientX,
      y: e.clientY,
      maxSize: Math.random() * 150 + 100, // Random max size: 100px to 250px
      duration: Math.random() * 1 + 1.5, // Random duration: 1.5s to 2.5s
    };
    setRipples((prev) => [...prev, newRipple].slice(-7)); 
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    window.addEventListener('click', addRipple);
    return () => {
      window.removeEventListener('click', addRipple);
    };
  }, [addRipple, mounted]);
  
  if (!mounted) {
    return null; 
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              // width and height are now animated, not fixed here
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)', // Ensures center is at cursor
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.7) 0%, hsl(var(--secondary) / 0.5) 50%, hsl(var(--accent) / 0.3) 100%)',
              boxShadow: `
                0px 3px 8px hsl(var(--primary) / 0.4), 
                0px 6px 15px hsl(var(--secondary) / 0.3),
                inset 0 0 5px hsl(var(--background) / 0.1)
              `,
            }}
            initial={{ 
              width: 0, 
              height: 0, 
              opacity: 0.9 
            }}
            animate={{ 
              width: ripple.maxSize, 
              height: ripple.maxSize, 
              opacity: 0,
            }}
            transition={{ duration: ripple.duration, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WaterRipples;
