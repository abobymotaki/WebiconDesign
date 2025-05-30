
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}

// Simple throttle function
function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
          timeoutId = null;
        }
      }, delay);
    }
  };
  return throttled as T;
}


const MouseTrail: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const addParticle = useCallback((x: number, y: number) => {
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 10, // Reduced spread
      y: y + (Math.random() - 0.5) * 10, // Reduced spread
      size: 8, // More consistent size
      opacity: 0.8 + Math.random() * 0.2, 
      rotation: Math.random() * 360,
    };

    setParticles((prevParticles) => {
      const updatedParticles = [...prevParticles, newParticle];
      return updatedParticles.slice(Math.max(updatedParticles.length - 25, 0)); 
    });
  }, []);

  useEffect(() => {
    const throttledAddParticle = throttle(addParticle, 10); // Increased frequency

    const handleMouseMove = (event: MouseEvent) => {
      throttledAddParticle(event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [addParticle]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x - particle.size / 2,
              y: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              scale: 1,
              rotate: particle.rotation,
            }}
            animate={{
              opacity: 0,
              scale: 0.3, 
              y: particle.y - particle.size / 2 - (30 + Math.random() * 20), 
              rotate: particle.rotation + (Math.random() - 0.5) * 90, 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 + Math.random() * 0.5, ease: "easeOut" }} 
            style={{
              position: 'absolute',
              backgroundColor: Math.random() > 0.5 ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--accent) / 0.6)',
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 6 + 6}px ${Math.random() > 0.5 ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--accent) / 0.4)'}, 0 0 ${Math.random() * 8 + 8}px hsl(var(--secondary) / 0.2)`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MouseTrail;
