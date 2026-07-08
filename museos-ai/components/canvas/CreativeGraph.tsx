"use client";

import { CreativeProject, CanvasNode as CanvasNodeType, CanvasEdge } from "@/types/creative";
import CanvasNode from "@/components/canvas/CanvasNode";
import ConnectionLine from "@/components/canvas/ConnectionLine";
import AgentDock from "@/components/canvas/AgentDock";
import { useState } from "react";
import OutputModal from "@/components/canvas/OutputModal";
import { formatOutputName } from "@/lib/helpers";
import CreativeDNAPanel from "@/components/canvas/CreativeDNAPanel";
import Timeline from "@/components/canvas/Timeline";
import { AnimatePresence } from "framer-motion";
import NodeDetailPanel from "./NodeDetailPanel";

interface CreativeGraphProps {
  project: CreativeProject;
}

export default function CreativeGraph({ project }: CreativeGraphProps) {
  const [selectedOutput, setSelectedOutput] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const [selectedNode, setSelectedNode] = useState<CanvasNodeType | null>(null)
  const [nodes, setNodes] = useState<CanvasNodeType[]>(project.nodes);
  const [edges, setEdges] = useState<CanvasEdge[]>(project.edges);

  const expandNode = (node: CanvasNodeType) => {
    const alreadyExpanded = nodes.some((item) => item.id.startsWith(`${node.id}-detail`));

    if (alreadyExpanded) return;

    const childNodes: CanvasNodeType[] = [
      {
        id: `${node.id}-detail-1`,
        title: "Deep Direction",
        subtitle: `A more detailed creative direction for ${node.title.toLowerCase()}.`,
        type: node.type === "core" ? "story" : node.type,
        x: Math.max(12, node.x - 16),
        y: Math.min(88, node.y + 18),
      },
      {
        id: `${node.id}-detail-2`,
        title: "Signature Moment",
        subtitle: `The memorable scene, visual, or hook that makes ${node.title.toLowerCase()} stand out`,
        type: node.type === "core" ? "visual" : node.type,
        x: Math.min(88, node.x + 16),
        y: Math.min(88, node.y + 18),
      },
    ];

    const childEdges: CanvasEdge[] = childNodes.map((child) => ({
      from: node.id,
      to: child.id,
    }));

    setNodes((current) => [...current, ...childNodes]);
    setEdges((current) => [...current, ...childEdges]);
  };

  return (
  <div>
    <div className="relative min-h-[680px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.04] p-5 backdrop-blur-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {edges.map((edge, index) => (
          <ConnectionLine
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            nodes={nodes}
            index={index}
          />
        ))}
      </svg>

      {nodes.map((node, index) => (
        <CanvasNode key={node.id} node={node} index={index} selected={selectedNode?.id === node.id} onClick={() => setSelectedNode(node)} />
      ))}

      <AnimatePresence>
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onExpand={() => expandNode(selectedNode)}
          />
        )}
      </AnimatePresence>
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