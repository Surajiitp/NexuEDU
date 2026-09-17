import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

export default function FloatingParticles() {
  const particles: Particle[] = useMemo(() => {
    const colors = [
      "rgba(34, 211, 238, 0.45)", // cyan-400
      "rgba(110, 231, 183, 0.40)", // emerald-300
      "rgba(163, 230, 53, 0.35)",  // lime-400
      "rgba(99, 102, 241, 0.35)",  // indigo-500
      "rgba(255, 255, 255, 0.25)", // white glow
    ];

    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: (i * 3.14 * 17) % 100, // deterministic distribution across 0-100%
      y: (i * 2.71 * 23) % 100,
      size: (i % 5) + 3, // 3px to 7px
      duration: 14 + (i % 10) * 2, // 14s to 32s smooth gentle floating
      delay: (i % 7) * 1.2,
      opacity: 0.2 + (i % 4) * 0.15,
      color: colors[i % colors.length],
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Subtle ambient gradient orbs in background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
          }}
          animate={{
            y: [0, -35, 15, -25, 0],
            x: [0, 20, -15, 25, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.7, p.opacity * 0.3, p.opacity * 0.4],
            scale: [1, 1.25, 0.9, 1.15, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
