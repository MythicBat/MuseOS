"use client";

import {
  Bot,
  Check,
  CircleDot,
  Clapperboard,
  Copy,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useState,
  ReactNode,
} from "react";

import {
  CreativeProject,
  SavedCreativeProject,
} from "@/types/creative";

import UniversePreview from "@/components/dashboard/UniversePreview";

interface ProjectDashboardProps {
  projects: SavedCreativeProject[];
  onCreateProject: () => void;
  onOpenProject: (
    projectId: string
  ) => void;
  onRenameProject: (
    projectId: string,
    title: string
  ) => void;
  onDuplicateProject: (
    projectId: string
  ) => void;
  onDeleteProject: (
    projectId: string
  ) => void;
}

export default function ProjectDashboard({
  projects,
  onCreateProject,
  onOpenProject,
  onRenameProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectDashboardProps) {
  const [
    menuProjectId,
    setMenuProjectId,
  ] = useState<string | null>(null);

  const [
    renamingProjectId,
    setRenamingProjectId,
  ] = useState<string | null>(null);

  const [renameValue, setRenameValue] =
    useState("");

  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const beginRename = (
    project: SavedCreativeProject
  ) => {
    setRenamingProjectId(project.id);
    setRenameValue(project.title);
    setMenuProjectId(null);
  };

  const confirmRename = () => {
    if (!renamingProjectId) return;

    onRenameProject(
      renamingProjectId,
      renameValue
    );

    setRenamingProjectId(null);
    setRenameValue("");
  };

  return (
    <main className="min-h-screen bg-[#08070d] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-200/70">
              <Sparkles className="h-4 w-4" />

              <p className="text-xs uppercase tracking-[0.2em]">
                MuseOS Workspace
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Your creative universes
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Continue an evolving universe,
              explore its creative intelligence,
              or begin something entirely new.
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateProject}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New universe
          </button>
        </header>

        {projects.length === 0 ? (
          <motion.button
            type="button"
            onClick={onCreateProject}
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-12 flex min-h-[360px] w-full flex-col items-center justify-center rounded-[36px] border border-dashed border-white/15 bg-white/[0.035] px-6 text-center transition hover:bg-white/[0.055]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-400/10 text-violet-200">
              <Sparkles className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-xl font-medium">
              Create your first universe
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
              Start with one creative idea and
              let MuseOS orchestrate narrative,
              visual direction, production and
              launch strategy.
            </p>
          </motion.button>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(
              (savedProject, index) => {
                const menuOpen =
                  menuProjectId ===
                  savedProject.id;

                const isRenaming =
                  renamingProjectId ===
                  savedProject.id;
                
                const isHovered = 
                  hoveredProjectId ===
                  savedProject.id;
                
                const stats = 
                  getProjectQuickLookStats(savedProject);

                return (
                  <motion.article
  key={savedProject.id}
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay:
      Math.min(index, 8) *
      0.045,
    type: "spring",
    stiffness: 180,
    damping: 22,
  }}
  whileHover={{
    y: -6,
  }}
  onHoverStart={() =>
    setHoveredProjectId(
      savedProject.id
    )
  }
  onHoverEnd={() =>
    setHoveredProjectId(
      null
    )
  }
  className="group relative rounded-[32px] border border-white/10 bg-white/[0.045] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-colors hover:border-white/15 hover:bg-white/[0.065]"
>
  <div className="relative">
    <UniversePreview
      project={
        savedProject.project
      }
      active={isHovered}
    />

    <div className="absolute right-3 top-3 z-20">
      <button
        type="button"
        aria-label="Project actions"
        onClick={(event) => {
          event.stopPropagation();

          setMenuProjectId(
            menuOpen
              ? null
              : savedProject.id
          );
        }}
        className="rounded-full border border-white/10 bg-black/40 p-2 text-white/45 backdrop-blur-xl transition hover:bg-black/60 hover:text-white/75"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: -4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: -4,
            }}
            className="absolute right-0 top-11 z-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1925]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
          >
            <button
              type="button"
              onClick={() =>
                beginRename(
                  savedProject
                )
              }
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 transition hover:bg-white/10 hover:text-white/80"
            >
              <Pencil className="h-3.5 w-3.5" />
              Rename
            </button>

            <button
              type="button"
              onClick={() => {
                onDuplicateProject(
                  savedProject.id
                );

                setMenuProjectId(
                  null
                );
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 transition hover:bg-white/10 hover:text-white/80"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>

            <button
              type="button"
              onClick={() => {
                const confirmed =
                  window.confirm(
                    `Delete "${savedProject.title}"?`
                  );

                if (!confirmed) {
                  return;
                }

                onDeleteProject(
                  savedProject.id
                );

                setMenuProjectId(
                  null
                );
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-200/55 transition hover:bg-red-400/10 hover:text-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

  <div className="px-2 pb-2 pt-5">
    {isRenaming ? (
      <div>
        <input
          autoFocus
          value={renameValue}
          onChange={(event) =>
            setRenameValue(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
              "Enter"
            ) {
              confirmRename();
            }

            if (
              event.key ===
              "Escape"
            ) {
              setRenamingProjectId(
                null
              );
            }
          }}
          className="w-full rounded-xl border border-violet-300/20 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-violet-200/40"
        />

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={confirmRename}
            className="rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-black"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() =>
              setRenamingProjectId(
                null
              )
            }
            className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/45"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              onOpenProject(
                savedProject.id
              )
            }
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white/35">
                {stats.projectType}
              </span>

              {stats.provider && (
                <span className="flex items-center gap-1 rounded-full border border-blue-300/10 bg-blue-400/[0.08] px-2.5 py-1 text-[9px] text-blue-100/55">
                  <WandSparkles className="h-2.5 w-2.5" />

                  {stats.provider}
                </span>
              )}
            </div>

            <h2 className="mt-3 truncate text-lg font-medium tracking-tight text-white/90">
              {savedProject.title}
            </h2>

            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-white/35">
              {getProjectDescription(
                savedProject
              )}
            </p>
          </button>

          <motion.div
            animate={{
              scale: isHovered
                ? 1.06
                : 1,
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-violet-100/70"
          >
            <Clapperboard className="h-5 w-5" />
          </motion.div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <QuickStat
            icon={
              <CircleDot className="h-3.5 w-3.5" />
            }
            value={stats.nodeCount}
            label="Nodes"
          />

          <QuickStat
            icon={
              <Bot className="h-3.5 w-3.5" />
            }
            value={stats.agentCount}
            label="Agents"
          />

          <QuickStat
            icon={
              <Check className="h-3.5 w-3.5" />
            }
            value={`${stats.completion}%`}
            label="Ready"
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/30">
              {stats.stage}
            </span>

            <span className="text-white/20">
              {stats.completion}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${stats.completion}%`,
              }}
              transition={{
                duration: 0.8,
                delay:
                  index * 0.04 + 0.2,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-gradient-to-r from-violet-400/70 via-fuchsia-300/70 to-blue-300/70"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
              Last edited
            </p>

            <p className="mt-1 text-[11px] text-white/38">
              {formatRelativeTime(
                savedProject.updatedAt
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenProject(
                savedProject.id
              )
            }
            className="group/button flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/55 transition hover:bg-white hover:text-black"
          >
            Continue

            <motion.span
              animate={{
                x: isHovered
                  ? 3
                  : 0,
              }}
            >
              →
            </motion.span>
          </button>
        </div>
      </>
    )}
  </div>

  <motion.div
    aria-hidden
    animate={{
      opacity: isHovered
        ? 1
        : 0,
    }}
    className="pointer-events-none absolute -inset-px -z-10 rounded-[32px] bg-gradient-to-br from-violet-400/15 via-transparent to-blue-400/10 blur-xl"
  />
</motion.article>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}

interface QuickStatProps {
  icon: ReactNode;
  value: string | number;
  label: string;
}

function QuickStat({
  icon,
  value,
  label,
}: QuickStatProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-3">
      <div className="flex items-center gap-1.5 text-white/30">
        {icon}

        <span className="text-[9px] uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-base font-medium text-white/75">
          {value}
      </motion.p>
    </div>
  );
}

interface ProjectQuickLookStats {
  projectType: string;
  nodeCount: number;
  agentCount: number;
  completion: number;
  stage: string;
  provider: string | null;
}

function getProjectQuickLookStats(
  savedProject: SavedCreativeProject
): ProjectQuickLookStats {
  const project =
    savedProject.project;

  const nodeCount =
    Array.isArray(project.nodes)
      ? project.nodes.length
      : 0;

  const agentCount =
    Array.isArray(project.agents)
      ? project.agents.length
      : 0;

  const projectType =
    inferProjectType(project);

  const provider =
    inferProjectProvider(
      savedProject
    );

  const completion =
    calculateProjectCompletion(
      project
    );

  return {
    projectType,
    nodeCount,
    agentCount,
    completion,
    stage:
      getProjectStage(
        completion,
        nodeCount
      ),
    provider,
  };
}

function inferProjectType(
  project: CreativeProject
): string {
  const searchableText = [
    project.title,
    getStringProperty(
      project,
      "description"
    ),
    getStringProperty(
      project,
      "summary"
    ),
    getStringProperty(
      project,
      "coreIdea"
    ),
    getStringProperty(
      project,
      "concept"
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    searchableText.includes(
      "film"
    ) ||
    searchableText.includes(
      "movie"
    ) ||
    searchableText.includes(
      "cinema"
    )
  ) {
    return "Film";
  }

  if (
    searchableText.includes(
      "game"
    )
  ) {
    return "Game";
  }

  if (
    searchableText.includes(
      "album"
    ) ||
    searchableText.includes(
      "music"
    ) ||
    searchableText.includes(
      "song"
    )
  ) {
    return "Music";
  }

  if (
    searchableText.includes(
      "campaign"
    ) ||
    searchableText.includes(
      "brand"
    )
  ) {
    return "Campaign";
  }

  if (
    searchableText.includes(
      "series"
    ) ||
    searchableText.includes(
      "show"
    )
  ) {
    return "Series";
  }

  if (
    searchableText.includes(
      "book"
    ) ||
    searchableText.includes(
      "novel"
    )
  ) {
    return "Story";
  }

  return "Creative Universe";
}

function inferProjectProvider(
  savedProject: SavedCreativeProject
): string | null {
  const record =
    savedProject as unknown as Record<
      string,
      unknown
    >;

  const projectRecord =
    savedProject.project as unknown as Record<
      string,
      unknown
    >;

  const candidate =
    record.provider ??
    record.lastProvider ??
    projectRecord.provider ??
    projectRecord.aiProvider;

  if (
    candidate === "watsonx"
  ) {
    return "Granite";
  }

  if (
    candidate === "fallback"
  ) {
    return "Fallback";
  }

  if (
    typeof candidate === "string"
  ) {
    return candidate;
  }

  return "Granite";
}

function calculateProjectCompletion(
  project: CreativeProject
): number {
  let score = 20;

  if (
    project.nodes.length >= 4
  ) {
    score += 20;
  }

  if (
    project.nodes.length >= 8
  ) {
    score += 15;
  }

  if (
    project.edges.length >= 3
  ) {
    score += 10;
  }

  if (
    project.agents.length >= 3
  ) {
    score += 15;
  }

  if (
    project.dna
  ) {
    score += 20;
  }

  return Math.min(
    score,
    100
  );
}

function getProjectStage(
  completion: number,
  nodeCount: number
): string {
  if (completion >= 95) {
    return "Production ready";
  }

  if (completion >= 75) {
    return "Creative development";
  }

  if (completion >= 50) {
    return "Universe expanding";
  }

  if (nodeCount > 0) {
    return "Concept formation";
  }

  return "Initial spark";
}

function getStringProperty(
  value: object,
  property: string
): string {
  const record =
    value as Record<
      string,
      unknown
    >;

  const candidate =
    record[property];

  return typeof candidate ===
    "string"
    ? candidate
    : "";
}

function getProjectDescription(
  savedProject: SavedCreativeProject
): string {
  const project =
    savedProject.project as unknown as Record<
      string,
      unknown
    >;

  const candidates = [
    project.description,
    project.summary,
    project.coreIdea,
    project.concept,
  ];

  const description =
    candidates.find(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    );

  return typeof description === "string"
    ? description
    : "A Granite-orchestrated creative universe ready for exploration and production.";
}

function countProjectNodes(
  savedProject: SavedCreativeProject
): number {
  const project =
    savedProject.project as unknown as Record<
      string,
      unknown
    >;

  const candidates = [
    project.nodes,
    project.canvasNodes,
    project.creativeNodes,
  ];

  const nodes =
    candidates.find(Array.isArray);

  return Array.isArray(nodes)
    ? nodes.length
    : 0;
}

function formatRelativeTime(
  timestamp: number
): string {
  const difference =
    Date.now() - timestamp;

  const minutes = Math.floor(
    difference / 60_000
  );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 30) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(timestamp));
}