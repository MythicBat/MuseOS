"use client";

import { motion } from "framer-motion";

const particles = [
  { left: "8%", top: "16%", size: 4, delay: 0 },
  { left: "18%", top: "72%", size: 3, delay: 1.2 },
  { left: "32%", top: "28%", size: 5, delay: 0.6 },
  { left: "46%", top: "82%", size: 3, delay: 1.8 },
  { left: "62%", top: "18%", size: 4, delay: 0.9 },
  { left: "74%", top: "68%", size: 5, delay: 1.5 },
  { left: "88%", top: "34%", size: 3, delay: 0.3 },
  { left: "92%", top: "84%", size: 4, delay: 2.1 },
];

export default function AmbientParticles() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((particle, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0.1, scale: 0.8 }}
                    animate={{
                        opacity: [0.15, 0.55, 0.15],
                        y: [0, -18, 0],
                        scale: [0.9, 1.25, 0.9],
                    }}
                    transition={{
                        duration: 5 + index * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: particle.size,
                        height: particle.size,
                    }}
                    className="absolute rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]"
                />
            ))}
        </div>
    );
}