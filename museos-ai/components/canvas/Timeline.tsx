"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = ["Idea", "Creative DNA", "Universe", "Agent Review", "Exports"];

export default function Timeline() {
  return (
    <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <p className="mb-5 text-sm font-medium text-white/80">
        Creative Timeline
      </p>

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-black/25 p-4"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-white">{step}</p>
            <p className="mt-1 text-xs text-white/40">
              Checkpoint {index + 1}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}