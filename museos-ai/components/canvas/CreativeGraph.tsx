"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import {
  CreativeProject,
  CanvasNode as CanvasNodeType,
  CanvasEdge,
} from "@/types/creative";

import CanvasNode from "@/components/canvas/CanvasNode";
import ConnectionLine from "@/components/canvas/ConnectionLine";
import AgentDock from "@/components/canvas/AgentDock";
import OutputModal from "@/components/canvas/OutputModal";
import CreativeDNAPanel from "@/components/canvas/CreativeDNAPanel";
import Timeline from "@/components/canvas/Timeline";
import NodeDetailPanel from "@/components/canvas/NodeDetailPanel";
import CommandCore from "@/components/canvas/CommandCore";
import { formatOutputName } from "@/lib/helpers";
import { getRandomValues } from "crypto";

interface CreativeGraphProps {
  project: CreativeProject;
}

export default function CreativeGraph({ project }: CreativeGraphProps) {
  const [selectedOutput, setSelectedOutput] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const [selectedNode, setSelectedNode] = useState<CanvasNodeType | null>(null);
  const [nodes, setNodes] = useState<CanvasNodeType[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<CanvasNodeType[]>([]);
  const [visibleEdges, setVisibleEdges] = useState<CanvasEdge[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedNode(null);
    setVisibleNodes([]);
    setVisibleEdges([]);
    setNodes(project.nodes);
    setEdges(project.edges);

    project.nodes.forEach((node, index) => {
      const timer = setTimeout(() => {
        setVisibleNodes((current) =>
          current.some((item) => item.id === node.id)
            ? current
            : [...current, node]
        );
      }, index * 350);

      timers.push(timer);
    });

    project.edges.forEach((edge, index) => {
      const timer = setTimeout(() => {
        setVisibleEdges((current) =>
          current.some(
            (item) => item.from === edge.from && item.to === edge.to
          )
            ? current
            : [...current, edge]
        );
      }, 500 + index * 350);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [project]);

  const expandNode = (node: CanvasNodeType) => {
    const alreadyExpanded = nodes.some((item) =>
      item.id.startsWith(`${node.id}-detail`)
    );

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
        subtitle: `The memorable scene, visual, or hook that makes ${node.title.toLowerCase()} stand out.`,
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

    childNodes.forEach((child, index) => {
      setTimeout(() => {
        setVisibleNodes((current) =>
          current.some((item) => item.id === child.id)
            ? current
            : [...current, child]
        );
      }, index * 250);
    });

    childEdges.forEach((edge, index) => {
      setTimeout(() => {
        setVisibleEdges((current) =>
          current.some(
            (item) => item.from === edge.from && item.to === edge.to
          )
            ? current
            : [...current, edge]
        );
      }, 200 + index * 250);
    });
  };

  const runCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    const nodeType = getCommandNodeType(lowerCommand);

    const commandNode: CanvasNodeType = {
      id: `command-${Date.now()}`,
      title: createCommandTitle(command),
      subtitle: createCommandSubtitle(command, nodeType),
      type: nodeType,
      x: getRandomPosition(25, 75),
      y: getRandomPosition(18,88),
    };

    const commandEdge: CanvasEdge = {
      from: "core",
      to: commandNode.id,
    };

    setNodes((current) => [...current, commandNode]);
    setEdges((current) => [...current, commandEdge]);

    setVisibleNodes((current) => 
      current.some((item) => item.id === commandNode.id)
        ? current : [...current, commandNode]);
    
    setVisibleEdges((current) =>
      current.some((item) => item.from === commandEdge.from && item.to === commandEdge.to)
        ? current : [...current, commandEdge]);
  };

  return (
    <div>
      <div className="relative min-h-[680px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.04] p-5 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />

        <CommandCore onCommand={runCommand} />

        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {visibleEdges.map((edge, index) => (
            <ConnectionLine
              key={`${edge.from}-${edge.to}-${index}`}
              edge={edge}
              nodes={visibleNodes}
              index={index}
            />
          ))}
        </svg>

        {visibleNodes.map((node, index) => (
          <CanvasNode
            key={node.id}
            node={node}
            index={index}
            selected={selectedNode?.id === node.id}
            onClick={() => setSelectedNode(node)}
          />
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

function getCommandNodeType(command: string): CanvasNodeType["type"] {
  if (
    command.includes("character") ||
    command.includes("villain") ||
    command.includes("hero") ||
    command.includes("protagonist")
  ) {
    return "character";
  }

  if (
    command.includes("visual") ||
    command.includes("color") ||
    command.includes("poster") ||
    command.includes("style") ||
    command.includes("look")
  ) {
    return "visual";
  }

  if (
    command.includes("market") ||
    command.includes("launch") ||
    command.includes("campaign") ||
    command.includes("social") ||
    command.includes("audience")
  ) {
    return "marketing";
  }

  if (
    command.includes("music") ||
    command.includes("sound") ||
    command.includes("song") ||
    command.includes("audio")
  ) {
    return "music";
  }

  if (
    command.includes("world") ||
    command.includes("setting") ||
    command.includes("place") ||
    command.includes("lore")
  ) {
    return "world";
  }

  if (
    command.includes("story") ||
    command.includes("scene") ||
    command.includes("ending") ||
    command.includes("trailer") ||
    command.includes("plot")
  ) {
    return "story";
  }

  return "core";
}

function createCommandTitle(command: string) {
  const trimmed = command.trim();

  if (trimmed.length <= 32) return trimmed;

  return `${trimmed.slice(0, 32)}...`;
}

function createCommandSubtitle(
  command: string,
  type: CanvasNodeType["type"]
) {
  const labels: Record<CanvasNodeType["type"], string> = {
    core: "A user-directed creative refinement.",
    story: "A narrative refinement that changes the arc, scene, or emotional direction.",
    character:
      "A character-focused refinement that adds personality, conflict, or relationship depth.",
    visual:
      "A visual refinement that changes the look, color, mood, or design language.",
    marketing:
      "A strategy refinement that improves audience fit, launch hook, or positioning.",
    world:
      "A world-building refinement that expands setting, rules, atmosphere, or lore.",
    music:
      "A sound-focused refinement that adds mood, rhythm, soundtrack, or audio identity.",
  };

  return `${labels[type]} Command: "${command}"`;
}

function getRandomPosition(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}