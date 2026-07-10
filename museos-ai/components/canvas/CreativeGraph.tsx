"use client";

import { useEffect, useState, useRef } from "react";
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
import CommandCore, { CommandCoreHandle } from "@/components/canvas/CommandCore";
import { formatOutputName } from "@/lib/helpers";
import { runCreativeCommand } from "@/lib/api";

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

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const commandCoreRef = useRef<CommandCoreHandle>(null);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      const isTyping = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        commandCoreRef.current?.focus();
        return;
      }

      if (event.key === "Escape") {
        setSelectedNode(null);
        setSelectedOutput(null);
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "0") {
        event.preventDefault();
        setScale(1);
        setOffset({ x: 0, y: 0 });
        return;
      }

      if (isTyping) return;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setScale((current) => Math.min(1.6, current + 0.1));
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setScale((current) => Math.max(0.65, current - 0.1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  }, []);

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

  const runCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    const nodeType = getCommandNodeType(lowerCommand);
    const nodeId = `command-${Date.now()}`;

    const optimisticNode: CanvasNodeType = {
      id: nodeId,
      title: createCommandTitle(command),
      subtitle: "MuseOS is refining this branch...",
      type: nodeType,
      x: getRandomPosition(25, 75),
      y: getRandomPosition(18, 88),
    };

    const commandEdge: CanvasEdge = {
      from: "core",
      to: optimisticNode.id,
    };

    setNodes((current) => [...current, optimisticNode]);
    setEdges((current) => [...current, commandEdge]);
    setVisibleNodes((current) => [...current, optimisticNode]);
    setVisibleEdges((current) => [...current, commandEdge]);

    try {
      const result = await runCreativeCommand({
        command,
        projectTitle: project.title,
      });

      const updatedNode: CanvasNodeType = {
        ...optimisticNode,
        title: result.title,
        subtitle: result.subtitle,
      };

      setNodes((current) => 
        current.map((node) => (node.id === nodeId ? updatedNode : node)));

      setVisibleNodes((current) =>
        current.map((node) => (node.id === nodeId ? updatedNode : node)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    setScale((current) => {
      const next = current - event.deltaY * 0.001;
      return Math.min(1.6, Math.max(0.65, next));
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (
      target.closest("[data-canvas-node]") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    setIsDragging(true);
    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = event.clientX - lastMouse.x;
    const dy = event.clientY - lastMouse.y;

    setOffset((current) => ({
      x: current.x + dx,
      y: current.y + dy,
    }));

    setLastMouse({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCanvas = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div>
      <div 
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative min-h-[680px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.04] p-5 backdrop-blur-2xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[110px]" />

        <CommandCore
          ref={commandCoreRef}
          onCommand={runCommand}
        />

        <button
          onClick={resetCanvas}
          className="absolute bottom-5 right-5 z-30 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/60 backdrop-blur-xl transition hover:bg-white/10"
        >
          Reset View · {Math.round(scale * 100)}%
        </button>

        <div className="absolute bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/40 backdrop-blur-xl md:flex">
          <span>⌘K Command</span>
          <span className="text-white/15">•</span>
          <span>Scroll Zoom</span>
          <span className="text-white/15">•</span>
          <span>Drag Pan</span>
          <span className="text-white/15">•</span>
          <span>Esc Close</span>
        </div>

        <div
          className="absolute inset-0 origin-center transition-transform duration-100"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
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