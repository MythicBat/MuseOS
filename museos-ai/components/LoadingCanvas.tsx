"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingCanvas() {
  return (
    <div className="flex h-full min-h-[640px] items-center justify-center rounded-[2rem] border border-white/10 bg-black/20">
      <div className="max-w-md text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10"
        >
          <Sparkles className="h-7 w-7" />
        </motion.div>

        <h2 className="text-3xl font-semibold tracking-tight">
          Building your creative universe...
        </h2>

        <p className="mt-4 leading-7 text-white/50">
          MuseOS is shaping your idea into story, visuals, strategy, and agent
          feedback.
        </p>
      </div>
    </div>
  );
}