"use client";

import {
  Copy,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useState,
} from "react";

import {
  SavedCreativeProject,
} from "@/types/creative";

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

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your creative universes
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Reopen an existing universe or
              begin a new Granite-powered
              creative project.
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
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(
              (savedProject, index) => {
                const menuOpen =
                  menuProjectId ===
                  savedProject.id;

                const isRenaming =
                  renamingProjectId ===
                  savedProject.id;

                return (
                  <motion.article
                    key={savedProject.id}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        Math.min(index, 8) *
                        0.04,
                    }}
                    className="group relative overflow-visible rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.065]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-blue-400/10 text-violet-100">
                        <FolderOpen className="h-5 w-5" />
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuProjectId(
                              menuOpen
                                ? null
                                : savedProject.id
                            )
                          }
                          className="rounded-full border border-white/10 bg-black/20 p-2 text-white/35 transition hover:bg-white/10"
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
                              className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1925] p-1.5 shadow-2xl"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  beginRename(
                                    savedProject
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/10"
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
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/10"
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

                                  if (
                                    !confirmed
                                  ) {
                                    return;
                                  }

                                  onDeleteProject(
                                    savedProject.id
                                  );

                                  setMenuProjectId(
                                    null
                                  );
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-200/55 hover:bg-red-400/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {isRenaming ? (
                      <div className="mt-6">
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
                          className="w-full rounded-xl border border-violet-300/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
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
                      <button
                        type="button"
                        onClick={() =>
                          onOpenProject(
                            savedProject.id
                          )
                        }
                        className="mt-6 block w-full text-left"
                      >
                        <h2 className="truncate text-lg font-medium text-white/85">
                          {savedProject.title}
                        </h2>

                        <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-white/35">
                          {getProjectDescription(
                            savedProject
                          )}
                        </p>
                      </button>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-white/25">
                      <span>
                        Updated{" "}
                        {formatRelativeTime(
                          savedProject.updatedAt
                        )}
                      </span>

                      <span>
                        {countProjectNodes(
                          savedProject
                        )}{" "}
                        creative nodes
                      </span>
                    </div>
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