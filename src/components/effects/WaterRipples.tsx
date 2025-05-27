
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const WaterRipples: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure component is mounted before adding event listeners
  }, []);

  const addRipple = useCallback((e: MouseEvent) => {
    if (!mounted) return;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(), // Ensure unique ID
      x: e.clientX,
      y: e.clientY,
    };
    setRipples((prev) => [...prev, newRipple].slice(-7)); // Limit to 7 ripples for performance
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    window.addEventListener('click', addRipple);
    return () => {
      window.removeEventListener('click', addRipple);
    };
  }, [addRipple, mounted]);
  
  if (!mounted) {
    return null; // Avoid rendering on server or before hydration
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              width: 10, // Start small
              height: 10,
              left: ripple.x,
              top: ripple.y,
              // Centering the ripple origin using translate
              transform: 'translate(-50%, -50%)', 
              // Purple gradient: #6B46C1 (center), #B794F4 (mid), #D6BCFA (outer)
              background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
              // Glow effect using theme colors
              boxShadow: '0 0 12px hsl(var(--primary) / 0.6), 0 0 20px hsl(var(--secondary) / 0.4)',
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ 
              scale: [0.5, 2.5, 2], // More organic scaling
              opacity: [0.9, 0.4, 0],
              width: [20, 200, 250], // Dynamic width change
              height: [20, 200, 250], // Dynamic height change
            }}
            transition={{ duration: 2, ease: 'easeOut', times: [0, 0.7, 1] }}
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
