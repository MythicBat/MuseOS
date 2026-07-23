"use client";

import {
  Bot,
  ChevronRight,
  CircleDot,
  Clapperboard,
  Download,
  Fingerprint,
  FolderOpen,
  History,
  LayoutDashboard,
  PanelsTopLeft,
  Presentation,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import {
  CreativeProject,
  SavedCreativeProject,
} from "@/types/creative";

export interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  group: SpotlightGroup;
  icon: ReactNode;
  keywords?: string[];
  onSelect: () => void;
}

type SpotlightGroup =
  | "Projects"
  | "Workspace"
  | "Nodes"
  | "Agents"
  | "Actions";

interface MuseSpotlightProps {
  open: boolean;
  onClose: () => void;

  currentProject?: CreativeProject | null;
  savedProjects?: SavedCreativeProject[];

  onOpenProject?: (
    projectId: string
  ) => void;

  onOpenDashboard?: () => void;

  onFocusCommandCore?: () => void;
}

export default function MuseSpotlight({
  open,
  onClose,
  currentProject = null,
  savedProjects = [],
  onOpenProject,
  onOpenDashboard,
  onFocusCommandCore,
}: MuseSpotlightProps) {
  const [query, setQuery] =
    useState("");

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const closeSpotlight = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  const actions = useMemo(
    () =>
      createSpotlightActions({
        currentProject,
        savedProjects,
        onOpenProject,
        onOpenDashboard,
        onFocusCommandCore,
        onClose: closeSpotlight,
      }),
    [
      currentProject,
      closeSpotlight,
      onFocusCommandCore,
      onOpenDashboard,
      onOpenProject,
      savedProjects,
    ]
  );

  const filteredActions = useMemo(
    () => {
      const normalizedQuery =
        query.trim().toLowerCase();

      if (!normalizedQuery) {
        return actions;
      }

      return actions.filter(
        (action) => {
          const searchableText = [
            action.label,
            action.description,
            action.group,
            ...(action.keywords ?? []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedQuery
          );
        }
      );
    },
    [actions, query]
  );

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
        inputRef.current?.focus();
    }, 40);

    return () => window.clearTimeout(timer);
  }, [open]);


  const selectAction = (
    action: SpotlightAction
  ) => {
    action.onSelect();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          filteredActions.length === 0
            ? 0
            : (current + 1) %
              filteredActions.length
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          filteredActions.length === 0
            ? 0
            : (
                current -
                1 +
                filteredActions.length
              ) %
              filteredActions.length
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedAction =
        filteredActions[
          selectedIndex
        ];

      if (selectedAction) {
        selectAction(
          selectedAction
        );
      }
    }
  };

  const groupedActions =
    groupSpotlightActions(
      filteredActions
    );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/55 px-4 pt-[10vh] backdrop-blur-xl"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeSpotlight();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: -14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: -8,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/12 bg-[#12111a]/95 shadow-[0_40px_140px_rgba(0,0,0,0.65)] backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-violet-200/65" />

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                }}
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Search MuseOS..."
                className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/25"
              />

              <button
                type="button"
                onClick={closeSpotlight}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-white/35 transition hover:bg-white/10 hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-2">
              {filteredActions.length ===
              0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-white/30">
                    <Search className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm text-white/55">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Try searching for a
                    project, node, agent or
                    workspace section.
                  </p>
                </div>
              ) : (
                groupedActions.map(
                  (group) => (
                    <div
                      key={group.name}
                      className="mb-3 last:mb-0"
                    >
                      <p className="px-3 pb-1.5 pt-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/20">
                        {group.name}
                      </p>

                      <div className="space-y-1">
                        {group.actions.map(
                          (action) => {
                            const globalIndex =
                              filteredActions.findIndex(
                                (
                                  item
                                ) =>
                                  item.id ===
                                  action.id
                              );

                            const isSelected =
                              globalIndex ===
                              selectedIndex;

                            return (
                              <button
                                key={
                                  action.id
                                }
                                type="button"
                                onMouseEnter={() =>
                                  setSelectedIndex(
                                    globalIndex
                                  )
                                }
                                onClick={() =>
                                  selectAction(
                                    action
                                  )
                                }
                                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                                  isSelected
                                    ? "bg-white/[0.09]"
                                    : "hover:bg-white/[0.055]"
                                }`}
                              >
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                                    isSelected
                                      ? "border-violet-200/15 bg-violet-300/10 text-violet-100"
                                      : "border-white/[0.07] bg-white/[0.035] text-white/35"
                                  }`}
                                >
                                  {
                                    action.icon
                                  }
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm text-white/75">
                                    {
                                      action.label
                                    }
                                  </span>

                                  {action.description && (
                                    <span className="mt-0.5 block truncate text-[11px] text-white/27">
                                      {
                                        action.description
                                      }
                                    </span>
                                  )}
                                </span>

                                <ChevronRight
                                  className={`h-4 w-4 shrink-0 transition ${
                                    isSelected
                                      ? "translate-x-0 text-white/50"
                                      : "-translate-x-1 text-white/0"
                                  }`}
                                />
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3 text-[10px] text-white/20">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>Esc Close</span>
              </div>

              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Muse Spotlight
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CreateSpotlightActionsOptions {
  currentProject:
    | CreativeProject
    | null;

  savedProjects:
    SavedCreativeProject[];

  onOpenProject?: (
    projectId: string
  ) => void;

  onOpenDashboard?: () => void;

  onFocusCommandCore?: () => void;

  onClose: () => void;
}

function createSpotlightActions({
  currentProject,
  savedProjects,
  onOpenProject,
  onOpenDashboard,
  onFocusCommandCore,
  onClose,
}: CreateSpotlightActionsOptions): SpotlightAction[] {
  const actions: SpotlightAction[] =
    [];

  if (onOpenDashboard) {
    actions.push({
      id: "action-dashboard",
      label: "Open project dashboard",
      description:
        "Return to your creative universes",
      group: "Workspace",
      icon: (
        <LayoutDashboard className="h-4 w-4" />
      ),
      keywords: [
        "home",
        "projects",
        "universes",
      ],
      onSelect: () => {
        onClose();
        onOpenDashboard();
      },
    });
  }

  const workspaceSections = [
    {
      id: "workspace-canvas",
      label: "Open Canvas",
      icon: (
        <PanelsTopLeft className="h-4 w-4" />
      ),
      keywords: [
        "graph",
        "nodes",
      ],
    },
    {
      id: "workspace-agents",
      label: "Open Agents",
      icon: (
        <Bot className="h-4 w-4" />
      ),
      keywords: [
        "orchestra",
        "ai",
      ],
    },
    {
      id: "workspace-dna",
      label: "Open Creative DNA",
      icon: (
        <Fingerprint className="h-4 w-4" />
      ),
      keywords: [
        "style",
        "colors",
        "tone",
      ],
    },
    {
      id: "workspace-versioning",
      label: "Open Version History",
      icon: (
        <History className="h-4 w-4" />
      ),
      keywords: [
        "branches",
        "timeline",
        "versions",
      ],
    },
    {
      id: "workspace-production",
      label: "Open Production",
      icon: (
        <Clapperboard className="h-4 w-4" />
      ),
      keywords: [
        "outputs",
        "generate",
      ],
    },
    {
      id: "workspace-pitch-deck",
      label: "Open Pitch Deck",
      icon: (
        <Presentation className="h-4 w-4" />
      ),
      keywords: [
        "slides",
        "presentation",
      ],
    },
    {
      id: "workspace-exports",
      label: "Open Exports",
      icon: (
        <Download className="h-4 w-4" />
      ),
      keywords: [
        "pdf",
        "pptx",
        "json",
        "markdown",
      ],
    },
  ];

  if (currentProject) {
    workspaceSections.forEach(
      (section) => {
        actions.push({
          id: `section-${section.id}`,
          label: section.label,
          description:
            currentProject.title,
          group: "Workspace",
          icon: section.icon,
          keywords:
            section.keywords,
          onSelect: () => {
            const element =
              document.getElementById(
                section.id
              );

            if (!element) {
              return;
            }

            onClose();

            window.setTimeout(() => {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 80);
          },
        });
      }
    );

    currentProject.nodes.forEach(
      (node) => {
        actions.push({
          id: `node-${node.id}`,
          label: node.title,
          description:
            node.subtitle ||
            `${node.type} node`,
          group: "Nodes",
          icon: (
            <CircleDot className="h-4 w-4" />
          ),
          keywords: [
            node.type,
            node.subtitle,
          ].filter(Boolean),
          onSelect: () => {
            onClose();

            document
              .getElementById(
                "workspace-canvas"
              )
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
          },
        });
      }
    );

    currentProject.agents.forEach(
        (agent, index) => {
            actions.push({
                id: `agent-${agent.role}-${index}`,
                label: formatAgentRole(agent.role),
                description: agent.message || "Creative Agent",
                group: "Agents",
                icon: (<Bot className="h-4 w-4" />),
                keywords: [
                    agent.role,
                    agent.message,
                    agent.status ?? "",
                ],
                onSelect: () => {
                    onClose();

                    document.getElementById("workspace-agents")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                },
            });
        }
    );

    if (onFocusCommandCore) {
      actions.push({
        id: "action-command-core",
        label: "Ask Granite",
        description:
          "Focus the MuseOS Command Core",
        group: "Actions",
        icon: (
          <Sparkles className="h-4 w-4" />
        ),
        keywords: [
          "command",
          "generate",
          "refine",
          "granite",
        ],
        onSelect: () => {
          onClose();

          window.setTimeout(() => {
            onFocusCommandCore();
          }, 100);
        },
      });
    }
  }

  savedProjects.forEach(
    (savedProject) => {
      actions.push({
        id: `project-${savedProject.id}`,
        label: savedProject.title,
        description: `Updated ${formatRelativeTime(
          savedProject.updatedAt
        )}`,
        group: "Projects",
        icon: (
          <FolderOpen className="h-4 w-4" />
        ),
        keywords: [
          savedProject.project.title,
          "project",
          "universe",
        ],
        onSelect: () => {
          onClose();

          onOpenProject?.(
            savedProject.id
          );
        },
      });
    }
  );

  return actions;
}

function formatAgentRole(
    role: string
): string {
    return role
        .split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function groupSpotlightActions(
  actions: SpotlightAction[]
) {
  const groupOrder: SpotlightGroup[] =
    [
      "Projects",
      "Workspace",
      "Nodes",
      "Agents",
      "Actions",
    ];

  return groupOrder
    .map((name) => ({
      name,
      actions: actions.filter(
        (action) =>
          action.group === name
      ),
    }))
    .filter(
      (group) =>
        group.actions.length > 0
    );
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

  return `${days}d ago`;
}