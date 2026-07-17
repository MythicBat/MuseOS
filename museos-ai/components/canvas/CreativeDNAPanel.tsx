"use client";

import { AnimatePresence, motion } from "framer-motion";

import { DNA } from "@/types/creative";

interface CreativeDNAPanelProps {
  dna: DNA;
  versionId?: string;
}

export default function CreativeDNAPanel({
  dna,
  versionId,
}: CreativeDNAPanelProps) {
  return (
    <div className="mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">
            Creative DNA
          </p>

          <p className="mt-1 text-xs text-white/35">
            Evolves with every creative decision.
          </p>
        </div>

        <motion.span
          key={versionId}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full bg-violet-400/15 px-3 py-1 text-xs text-violet-200"
        >
          Evolving
        </motion.span>
      </div>

      <motion.div
        layout
        className="grid gap-3 md:grid-cols-4"
      >
        <DNAItem
          label="Genre"
          value={dna.genre}
          versionId={versionId}
        />

        <DNAItem
          label="Tone"
          value={dna.tone}
          versionId={versionId}
        />

        <DNAItem
          label="Audience"
          value={dna.audience}
          versionId={versionId}
        />

        <DNAItem
          label="Mood"
          value={dna.mood}
          versionId={versionId}
        />
      </motion.div>

      <div className="mt-4">
        <p className="mb-2 text-xs text-white/35">
          Visual palette
        </p>

        <motion.div
          layout
          className="flex flex-wrap gap-2"
        >
          <AnimatePresence mode="popLayout">
            {dna.colors.map((color) => (
              <motion.span
                layout
                key={`${versionId}-${color}`}
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/60"
              >
                {color}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function DNAItem({
  label,
  value,
  versionId,
}: {
  label: string;
  value: string;
  versionId?: string;
}) {
  return (
    <motion.div
      layout
      className="min-h-[104px] rounded-2xl border border-white/10 bg-black/25 p-4"
    >
      <p className="mb-2 text-xs text-white/40">
        {label}
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${versionId}-${label}-${value}`}
          initial={{
            opacity: 0,
            y: 8,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -8,
            filter: "blur(4px)",
          }}
          transition={{ duration: 0.3 }}
          className="text-sm leading-6 text-white/75"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}