"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const MouseTrail: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mousePosition.x === 0 && mousePosition.y === 0) return; // Don't spawn if mouse hasn't moved

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: mousePosition.x + (Math.random() - 0.5) * 20, // Add some spread
        y: mousePosition.y + (Math.random() - 0.5) * 20,
        size: Math.random() * 6 + 3, // Random size between 3px and 9px
        opacity: 1,
      };

      setParticles((prevParticles) => {
        const updatedParticles = [...prevParticles, newParticle];
        // Limit the number of particles to avoid performance issues
        return updatedParticles.slice(Math.max(updatedParticles.length - 30, 0));
      });
    }, 50); // Spawn particle every 50ms

    return () => clearInterval(interval);
  }, [mousePosition]);

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
            }}
            animate={{
              opacity: 0,
              scale: 0.5,
              y: particle.y - particle.size / 2 - 20, // Move up slightly
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              backgroundColor: 'hsl(var(--primary) / 0.7)',
              borderRadius: '50%',
              boxShadow: '0 0 8px hsl(var(--primary) / 0.5), 0 0 12px hsl(var(--accent) / 0.3)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MouseTrail;
