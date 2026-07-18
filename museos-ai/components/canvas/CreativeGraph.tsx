"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  CanvasEdge,
  CanvasNode as CanvasNodeType,
  CreativeProject,
  CreativeVersionComparison,
  OrchestraStage,
} from "@/types/creative";

import CanvasNode from "@/components/canvas/CanvasNode";
import ConnectionLine from "@/components/canvas/ConnectionLine";
import AgentDock from "@/components/canvas/AgentDock";
import OutputModal from "@/components/canvas/OutputModal";
import CreativeDNAPanel from "@/components/canvas/CreativeDNAPanel";
import Timeline from "@/components/canvas/Timeline";
import NodeDetailPanel from "@/components/canvas/NodeDetailPanel";
import CommandCore, {
  CommandCoreHandle,
} from "@/components/canvas/CommandCore";
import VersionCompareModal from "@/components/canvas/VersionCompareModal";

import { formatOutputName } from "@/lib/helpers";
import { runCreativeCommand } from "@/lib/api";
import { cloneCreativeProject } from "@/lib/creativeVersion";

import { useCreativeOrchestra } from "@/hooks/useCreativeOrchestra";
import { useCreativeHistory } from "@/hooks/useCreativeHistory";

interface CreativeGraphProps {
  project: CreativeProject;
}

export default function CreativeGraph({
  project,
}: CreativeGraphProps) {
  const [selectedOutput, setSelectedOutput] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const [selectedNode, setSelectedNode] =
    useState<CanvasNodeType | null>(null);

  const [liveProject, setLiveProject] =
    useState<CreativeProject>(() =>
      cloneCreativeProject(project)
    );

  const [nodes, setNodes] = useState<CanvasNodeType[]>(
    () => project.nodes.map((node) => ({ ...node }))
  );

  const [edges, setEdges] = useState<CanvasEdge[]>(
    () => project.edges.map((edge) => ({ ...edge }))
  );

  const [
    manuallyVisibleNodeIds,
    setManuallyVisibleNodeIds,
  ] = useState<string[]>([]);

  const [scale, setScale] = useState(1);

  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] =
    useState(false);

  const [lastMouse, setLastMouse] = useState({
    x: 0,
    y: 0,
  });

  const commandCoreRef =
    useRef<CommandCoreHandle>(null);

  const [versionComparison, setVersionComparison] = useState<CreativeVersionComparison | null>(null);

  /*
   * Creative history
   */

  const {
    versions,
    branches,
    activeVersionId,
    activeVersionIndex,
    activeBranchId,
    branchVersions,
    addVersion,
    selectVersion,
    restoreVersion,
    createBranch,
    switchBranch,
    renameBranch,
    deleteBranch,
    toggleVersionApproval,
    updateVersionNote,
    compareVersions,
    clearStoredHistory,
  } = useCreativeHistory({
    initialProject: project,
    storageKey: `museos-history-${project.title}`,
  });

  /*
   * Phase 7 orchestra
   */

  const handleStageChange = useCallback(
    (
      stage: OrchestraStage,
      stageVisibleNodeIds: string[]
    ) => {
      const newlyVisibleNodeId = [...stage.nodeIds]
        .reverse()
        .find((id) =>
          stageVisibleNodeIds.includes(id)
        );

      if (!newlyVisibleNodeId) {
        return;
      }

      const targetNode = project.nodes.find(
        (node) => node.id === newlyVisibleNodeId
      );

      if (!targetNode) {
        return;
      }

      setScale((current) =>
        Math.max(current, 1.04)
      );

      setOffset({
        x: (50 - targetNode.x) * 4,
        y: (48 - targetNode.y) * 3,
      });
    },
    [project.nodes]
  );

  const {
    orchestra,
    currentStage,
    visibleNodeIds: orchestraVisibleNodeIds,
    visibleDebate,
    isRunning,
    isComplete,
  } = useCreativeOrchestra({
    project,
    autoStart: true,
    onStageChange: handleStageChange,
    onComplete: () => {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    },
  });

  /*
   * Visible graph
   */

  const allVisibleNodeIds = useMemo(
    () =>
      new Set([
        ...orchestraVisibleNodeIds,
        ...manuallyVisibleNodeIds,
      ]),
    [
      manuallyVisibleNodeIds,
      orchestraVisibleNodeIds,
    ]
  );

  const visibleNodes = useMemo(
    () =>
      nodes.filter((node) =>
        allVisibleNodeIds.has(node.id)
      ),
    [allVisibleNodeIds, nodes]
  );

  const visibleEdges = useMemo(
    () =>
      edges.filter(
        (edge) =>
          allVisibleNodeIds.has(edge.from) &&
          allVisibleNodeIds.has(edge.to)
      ),
    [allVisibleNodeIds, edges]
  );

  const resetCanvas = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  /*
   * Keyboard shortcuts
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        Boolean(target?.isContentEditable);

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        commandCoreRef.current?.focus();
        return;
      }

      if (event.key === "Escape") {
        setSelectedNode(null);
        setSelectedOutput(null);
        return;
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "0"
      ) {
        event.preventDefault();
        resetCanvas();
        return;
      }

      if (isTyping) {
        return;
      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {
        event.preventDefault();

        setScale((current) =>
          Math.min(1.6, current + 0.1)
        );
      }

      if (
        event.key === "-" ||
        event.key === "_"
      ) {
        event.preventDefault();

        setScale((current) =>
          Math.max(0.65, current - 0.1)
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [resetCanvas]);

  /*
   * Graph helpers
   */

  const revealManualNodes = useCallback(
    (nodeIds: string[]) => {
      setManuallyVisibleNodeIds((current) => [
        ...new Set([...current, ...nodeIds]),
      ]);
    },
    []
  );

  const applyHistoricalProject = useCallback(
    (historicalProject: CreativeProject) => {
      const nextProject =
        cloneCreativeProject(historicalProject);

      setLiveProject(nextProject);
      setNodes(nextProject.nodes);
      setEdges(nextProject.edges);

      // History navigation should reveal the complete snapshot.
      setManuallyVisibleNodeIds(
        nextProject.nodes.map((node) => node.id)
      );

      setSelectedNode(null);
      setSelectedOutput(null);

      setScale(1);
      setOffset({ x: 0, y: 0 });
    },
    []
  );

  /*
   * Time Machine handlers
   */

  const handleSelectVersion = useCallback(
    (versionId: string) => {
      const historicalProject =
        selectVersion(versionId);

      if (historicalProject) {
        applyHistoricalProject(
          historicalProject
        );
      }
    },
    [applyHistoricalProject, selectVersion]
  );

  const handleRestoreVersion = useCallback(
    (versionId: string) => {
      const restoredProject =
        restoreVersion(versionId);

      if (restoredProject) {
        applyHistoricalProject(
          restoredProject
        );
      }
    },
    [applyHistoricalProject, restoreVersion]
  );

  const handleCreateBranch = useCallback(
    (
      name: string,
      versionId?: string
    ) => {
      const result = createBranch({
        name,
        fromVersionId: versionId,
      });

      if (result) {
        applyHistoricalProject(result.project);
      }
    },
    [applyHistoricalProject, createBranch]
  );

  const handleSwitchBranch = useCallback(
    (branchId: string) => {
      const branchProject =
        switchBranch(branchId);

      if (branchProject) {
        applyHistoricalProject(branchProject);
      }
    },
    [applyHistoricalProject, switchBranch]
  );

  const handleRenameBranch = useCallback(
    (branchId: string, name: string) => {
      renameBranch(branchId, name);
    },
    [renameBranch]
  );

  const handleDeleteBranch = useCallback(
    (branchId: string) => {
      const nextProject = 
        deleteBranch(branchId);

      if (nextProject) {
        applyHistoricalProject(nextProject);
      }
    },
    [applyHistoricalProject, deleteBranch]
  );

  const handleCompareVersions =
  useCallback(
    (
      firstVersionId: string,
      secondVersionId: string
    ) => {
      const comparison =
        compareVersions(
          firstVersionId,
          secondVersionId
        );

      if (comparison) {
        setVersionComparison(
          comparison
        );
      }
    },
    [compareVersions]
  );

  const handleClearHistory = useCallback(
    () => {
      const initialSnapshot = 
        clearStoredHistory();

      applyHistoricalProject(initialSnapshot);
    },
    [applyHistoricalProject, clearStoredHistory,]
  );

  /*
   * Node expansion
   */

  const expandNode = (
    node: CanvasNodeType
  ) => {
    const alreadyExpanded = nodes.some((item) =>
      item.id.startsWith(
        `${node.id}-detail`
      )
    );

    if (alreadyExpanded) {
      return;
    }

    const childNodes: CanvasNodeType[] = [
      {
        id: `${node.id}-detail-1`,
        title: "Deep Direction",
        subtitle: `A more detailed creative direction for ${node.title.toLowerCase()}.`,
        type:
          node.type === "core"
            ? "story"
            : node.type,
        x: Math.max(12, node.x - 16),
        y: Math.min(88, node.y + 18),
      },
      {
        id: `${node.id}-detail-2`,
        title: "Signature Moment",
        subtitle: `The memorable scene, visual, or hook that makes ${node.title.toLowerCase()} stand out.`,
        type:
          node.type === "core"
            ? "visual"
            : node.type,
        x: Math.min(88, node.x + 16),
        y: Math.min(88, node.y + 18),
      },
    ];

    const childEdges: CanvasEdge[] =
      childNodes.map((child) => ({
        from: node.id,
        to: child.id,
      }));

    const nextNodes = [
      ...nodes,
      ...childNodes,
    ];

    const nextEdges = [
      ...edges,
      ...childEdges,
    ];

    const nextProject: CreativeProject = {
      ...liveProject,
      nodes: nextNodes,
      edges: nextEdges,
    };

    setNodes(nextNodes);
    setEdges(nextEdges);
    setLiveProject(nextProject);

    childNodes.forEach((child, index) => {
      window.setTimeout(() => {
        revealManualNodes([child.id]);
      }, index * 260);
    });

    addVersion({
      project: nextProject,
      label: `Expanded ${node.title}`,
      description: `Added deeper creative directions for ${node.title}.`,
      source: "node-expansion",
    });
  };

  /*
   * Command Core
   */

  const runCommand = async (
    command: string
  ) => {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    const nodeType = getCommandNodeType(
      trimmedCommand.toLowerCase()
    );

    const nodeId = `command-${Date.now()}`;

    const optimisticNode: CanvasNodeType = {
      id: nodeId,
      title:
        createCommandTitle(trimmedCommand),
      subtitle:
        "MuseOS is refining this branch...",
      type: nodeType,
      x: getRandomPosition(25, 75),
      y: getRandomPosition(25, 82),
    };

    const coreNode =
      nodes.find(
        (node) => node.type === "core"
      ) ?? nodes[0];

    const commandEdge: CanvasEdge = {
      from: coreNode?.id ?? "core",
      to: optimisticNode.id,
    };

    const optimisticNodes = [
      ...nodes,
      optimisticNode,
    ];

    const optimisticEdges = [
      ...edges,
      commandEdge,
    ];

    setNodes(optimisticNodes);
    setEdges(optimisticEdges);

    revealManualNodes([
      commandEdge.from,
      optimisticNode.id,
    ]);

    setScale(1.08);

    setOffset({
      x: (50 - optimisticNode.x) * 4,
      y: (48 - optimisticNode.y) * 3,
    });

    try {
      const result =
        await runCreativeCommand({
          command: trimmedCommand,
          projectTitle: liveProject.title,
        });

      const updatedNode: CanvasNodeType = {
        ...optimisticNode,
        title: result.title,
        subtitle: result.subtitle,
      };

      const nextNodes =
        optimisticNodes.map((node) =>
          node.id === nodeId
            ? updatedNode
            : node
        );

      const nextProject: CreativeProject = {
        ...liveProject,

        dna: {
          ...liveProject.dna,
          ...result.dnaPatch,

          colors:
            result.dnaPatch?.colors ??
            liveProject.dna.colors,
        },

        nodes: nextNodes,
        edges: optimisticEdges,
      };

      setNodes(nextNodes);
      setEdges(optimisticEdges);
      setLiveProject(nextProject);

      addVersion({
        project: nextProject,
        label: result.title,
        description: result.subtitle,
        source: "command",
        command: trimmedCommand,
      });

      setSelectedNode((current) =>
        current?.id === nodeId
          ? updatedNode
          : current
      );
    } catch (error) {
      console.error(
        "Creative command failed:",
        error
      );

      const failedNode: CanvasNodeType = {
        ...optimisticNode,
        subtitle:
          "MuseOS could not complete this refinement. Try again.",
      };

      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId
            ? failedNode
            : node
        )
      );

      setSelectedNode((current) =>
        current?.id === nodeId
          ? failedNode
          : current
      );
    }
  };

  /*
   * Canvas interaction
   */

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setScale((current) => {
      const next =
        current - event.deltaY * 0.001;

      return Math.min(
        1.6,
        Math.max(0.65, next)
      );
    });
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const target =
      event.target as HTMLElement;

    if (
      target.closest("[data-canvas-node]") ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea")
    ) {
      return;
    }

    setIsDragging(true);

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isDragging) {
      return;
    }

    const dx =
      event.clientX - lastMouse.x;

    const dy =
      event.clientY - lastMouse.y;

    setOffset((current) => ({
      x: current.x + dx,
      y: current.y + dy,
    }));

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
          isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />

        <motion.div
          animate={{
            opacity: isRunning
              ? [0.2, 0.45, 0.2]
              : 0.2,

            scale: isRunning
              ? [0.9, 1.1, 0.9]
              : 1,
          }}
          transition={{
            duration: 3,

            repeat: isRunning
              ? Number.POSITIVE_INFINITY
              : 0,
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[110px]"
        />

        <CommandCore
          ref={commandCoreRef}
          onCommand={runCommand}
        />

        <AnimatePresence>
          {!isComplete && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              className="absolute left-1/2 top-[88px] z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs text-white/65 backdrop-blur-xl"
            >
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-violet-300" />

              {currentStage.label}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={resetCanvas}
          className="absolute bottom-5 right-5 z-30 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/60 backdrop-blur-xl transition hover:bg-white/10"
        >
          Reset View ·{" "}
          {Math.round(scale * 100)}%
        </button>

        <div className="absolute bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/40 backdrop-blur-xl md:flex">
          <span>⌘K Command</span>
          <span className="text-white/15">
            •
          </span>
          <span>Scroll Zoom</span>
          <span className="text-white/15">
            •
          </span>
          <span>Drag Pan</span>
          <span className="text-white/15">
            •
          </span>
          <span>Esc Close</span>
        </div>

        <div
          className="absolute inset-0 origin-center transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {visibleEdges.map(
              (edge, index) => (
                <ConnectionLine
                  key={`${edge.from}-${edge.to}`}
                  edge={edge}
                  nodes={visibleNodes}
                  index={index}
                />
              )
            )}
          </svg>

          {visibleNodes.map(
            (node, index) => (
              <CanvasNode
                key={node.id}
                node={node}
                index={index}
                selected={
                  selectedNode?.id === node.id
                }
                onClick={() =>
                  setSelectedNode(node)
                }
              />
            )
          )}

          <AnimatePresence>
            {selectedNode && (
              <NodeDetailPanel
                node={selectedNode}
                onClose={() =>
                  setSelectedNode(null)
                }
                onExpand={() =>
                  expandNode(selectedNode)
                }
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AgentDock
        agents={liveProject.agents}
        activities={orchestra.activities}
        debate={visibleDebate}
        currentStage={currentStage}
        isComplete={isComplete}
      />

      <CreativeDNAPanel
        dna={liveProject.dna}
        versionId={activeVersionId}
      />

      <Timeline
        versions={branchVersions}
        allVersions={versions}
        branches={branches}
        activeVersionId={activeVersionId}
        activeVersionIndex={
          activeVersionIndex
        }
        activeBranchId={activeBranchId}
        onSelectVersion={
          handleSelectVersion
        }
        onRestoreVersion={
          handleRestoreVersion
        }
        onCreateBranch={
          handleCreateBranch
        }
        onSwitchBranch={
          handleSwitchBranch
        }
        onRenameBranch={
          handleRenameBranch
        }
        onDeleteBranch={
          handleDeleteBranch
        }
        onToggleApproval={
          toggleVersionApproval
        }
        onUpdateNote={
          updateVersionNote
        }
        onCompare={
          handleCompareVersions
        }
        onClearHistory={
          handleClearHistory
        }
      />

      <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
        <p className="mb-4 text-sm font-medium text-white/80">
          One-Click Creative Outputs
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(
            liveProject.outputs
          ).map(([key, value]) => (
            <button
              type="button"
              key={key}
              onClick={() =>
                setSelectedOutput({
                  title:
                    formatOutputName(key),
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
          onClose={() =>
            setSelectedOutput(null)
          }
        />
      )}

      {versionComparison && (
        <VersionCompareModal
          comparison={versionComparison}
          onClose={() => setVersionComparison(null)}
        />
      )}
    </div>
  );
}

function getCommandNodeType(
  command: string
): CanvasNodeType["type"] {
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
    command.includes("colour") ||
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

function createCommandTitle(
  command: string
) {
  const trimmed = command.trim();

  return trimmed.length <= 32
    ? trimmed
    : `${trimmed.slice(0, 32)}...`;
}

function getRandomPosition(
  min: number,
  max: number
) {
  return Math.floor(
    Math.random() * (max - min + 1) +
      min
  );
}