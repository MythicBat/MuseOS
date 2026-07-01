"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CreativeProject } from "@/types/creative";
import { formatOutputName } from "@/lib/helpers";
import CreativeCard from "@/components/CreativeCard";
import CreativeDNA from "@/components/CreativeDNA";

interface CreativeCanvasProps {
  project: CreativeProject;
}

export default function CreativeCanvas({ project }: CreativeCanvasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid h-full gap-5 xl:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
          <p className="mb-2 text-sm text-white/45">Generated from your idea</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {project.title}
          </h2>
          <p className="mt-4 leading-7 text-white/60">{project.idea}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {project.sections.map((section) => (
            <CreativeCard
              key={section.title}
              icon={<Sparkles className="h-5 w-5" />}
              title={section.title}
              text={section.text}
            />
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <p className="mb-4 text-sm font-medium text-white/80">
            One-Click Outputs
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(project.outputs).map(([key, value]) => (
              <button
                key={key}
                onClick={() => alert(value)}
                className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/10"
              >
                View {formatOutputName(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <CreativeDNA dna={project.dna} />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
          <p className="mb-4 text-sm font-medium text-white/80">
            AI Creative Room
          </p>

          <div className="space-y-3">
            {project.agents.map((agent) => (
              <div
                key={agent.role}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
              >
                <p className="mb-2 text-sm font-medium">{agent.role}</p>
                <p className="text-sm leading-6 text-white/55">
                  {agent.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}