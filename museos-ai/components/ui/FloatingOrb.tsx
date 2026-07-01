"use client";

import { motion } from "framer-motion";

interface FloatingOrbProps {
  size?: number;
}

export default function FloatingOrb({
  size = 140,
}: FloatingOrbProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        scale: [1, 1.03, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 5,
      }}
      style={{
        width: size,
        height: size,
      }}
      className="
      relative
      rounded-full
      bg-gradient-to-br
      from-violet-500
      via-fuchsia-400
      to-cyan-400
      blur-[0.3px]
      shadow-[0_0_120px_rgba(120,100,255,.5)]
      "
    >
      <div className="absolute inset-3 rounded-full bg-white/10 backdrop-blur-xl" />
    </motion.div>
  );
}