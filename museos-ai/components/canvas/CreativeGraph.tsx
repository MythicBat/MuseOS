"use client";

import { CreativeProject } from "@/types/creative";
import CanvasNode from "@/components/canvas/CanvasNode";
import ConnectionLine from "@/components/canvas/ConnectionLine";
import AgentDock from "@/components/canvas/AgentDock";
import { useState } from "react";
import OutputModal from "@/components/canvas/OutputModal";
import { formatOutputName } from "@/lib/helpers";
import CreativeDNAPanel from "@/components/canvas/CreativeDNAPanel";
import Timeline from "@/components/canvas/Timeline";

interface CreativeGraphProps {
  project: CreativeProject;
}

export default function CreativeGraph({ project }: CreativeGraphProps) {
  const [selectedOutput, setSelectedOutput] = useState<{
    title: string;
    content: string;
  } | null>(null);

  return (
  <div>
    <div className="relative min-h-[680px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.04] p-5 backdrop-blur-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {project.edges.map((edge, index) => (
          <ConnectionLine
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            nodes={project.nodes}
            index={index}
          />
        ))}
      </svg>

      {project.nodes.map((node, index) => (
        <CanvasNode key={node.id} node={node} index={index} />
      ))}
    </div>

    <AgentDock agents={project.agents} />
    <CreativeDNAPanel dna={project.dna} />
    <Timeline />
    
    <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
  <p className="mb-4 text-sm font-medium text-white/80">
    One-Click Creative Outputs
  </p>

  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {Object.entries(project.outputs).map(([key, value]) => (
      <button
        key={key}
        onClick={() =>
          setSelectedOutput({
            title: formatOutputName(key),
            content: value,
          })
        }
        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-left text-sm text-white/70 transition hover:bg-white/10"
      >
        {formatOutputName(key)}
      </button>
    ))}
  </div>
</div>

{selectedOutput && (
  <OutputModal
    title={selectedOutput.title}
    content={selectedOutput.content}
    onClose={() => setSelectedOutput(null)}
  />
)}
  </div>
  );
}