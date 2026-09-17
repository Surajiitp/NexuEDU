"use client";

import React from "react";
import { motion } from "framer-motion";

interface Animated3DOrbProps {
  size?: number;
  className?: string;
}

export default function Animated3DOrb({ size = 56, className = "" }: Animated3DOrbProps) {
  return (
    <div
      style={{ perspective: 800, width: size, height: size }}
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* 3D Core Sphere with glowing gradient */}
      <motion.div
        animate={{
          scale: [1, 1.08, 0.96, 1],
          boxShadow: [
            "0 0 20px rgba(34,211,238,0.4), inset 0 0 15px rgba(255,255,255,0.4)",
            "0 0 32px rgba(52,211,153,0.6), inset 0 0 20px rgba(255,255,255,0.6)",
            "0 0 20px rgba(168,85,247,0.4), inset 0 0 15px rgba(255,255,255,0.4)",
            "0 0 20px rgba(34,211,238,0.4), inset 0 0 15px rgba(255,255,255,0.4)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-emerald-300 to-lime-300 relative z-10 flex items-center justify-center"
      >
        <div className="w-3 h-3 rounded-full bg-white/70 blur-[1px]" />
      </motion.div>

      {/* 3D Orbiting Ring 1 */}
      <motion.div
        animate={{
          rotateX: [65, 65, 65],
          rotateY: [0, 180, 360],
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-full border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
      />

      {/* 3D Orbiting Ring 2 */}
      <motion.div
        animate={{
          rotateX: [35, 35, 35],
          rotateY: [360, 180, 0],
          rotateZ: [360, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute inset-1 rounded-full border border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.35)]"
      />

      {/* 3D Orbiting Ring 3 */}
      <motion.div
        animate={{
          rotateX: [-50, -50, -50],
          rotateY: [0, 360],
          rotateZ: [0, 180, 360],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute inset-2 rounded-full border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
      />
    </div>
  );
}
