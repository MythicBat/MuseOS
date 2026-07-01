"use client";

import { CreativeProject } from "@/types/creative";
import CanvasNode from "@/components/canvas/CanvasNode";
import ConnectionLine from "@/components/canvas/ConnectionLine";
import AgentDock from "@/components/canvas/AgentDock";

interface CreativeGraphProps {
  project: CreativeProject;
}

export default function CreativeGraph({ project }: CreativeGraphProps) {
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
  </div>
  );
}