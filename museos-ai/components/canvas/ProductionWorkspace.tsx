"use client";

import {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  Clapperboard,
  ClipboardList,
  Copy,
  Download,
  History,
  MoreHorizontal,
  Pencil,
  Presentation,
  LoaderCircle,
  Megaphone,
  RefreshCw,
  Rocket,
  Trash2,
  Sparkles,
  X,
  ChevronDown,
  FileJson,
  FileText,
  FileType2,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CreativeProject,
  PitchDeckOutputData,
  ProductionOutputType,
} from "@/types/creative";

import { generateProductionOutput } from "@/lib/api";
import StoryboardStudio from "@/components/canvas/StoryboardStudio";
import PitchDeckStudio from "@/components/canvas/PitchDeckStudio";
import { useProductionHistory } from "@/hooks/useProductionHistory";
import { exportProductionOutput, ProductionExportFormat } from "@/lib/exportProductionOutput";

interface ProductionWorkspaceProps {
  project: CreativeProject;
  versionId?: string;
  versionLabel?: string;
  branchName?: string;
}

export interface ProductionWorkspaceHandle {
  generateStoryboard: () => Promise<void>;
  generatePitchDeck: () => Promise<void>;
  generateCreativeBible: () => Promise<void>;
  generateProductionPlan: () => Promise<void>;
  generateMarketingPlan: () => Promise<void>;
  generateInvestorBrief: () => Promise<void>;
  generateSocialCampaign: () => Promise<void>;
  generateProjectBrief: () => Promise<void>;
  focusProduction: () => void;
}

interface OutputDefinition {
  type: ProductionOutputType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const outputDefinitions: OutputDefinition[] = [
  {
    type: "pitch-deck",
    title: "Pitch Deck",
    description:
      "A compelling 10-slide creative presentation.",
    icon: (
      <Presentation className="h-5 w-5" />
    ),
  },
  {
    type: "storyboard",
    title: "Storyboard",
    description:
      "An eight-scene cinematic visual sequence.",
    icon: (
      <Clapperboard className="h-5 w-5" />
    ),
  },
  {
    type: "creative-bible",
    title: "Creative Bible",
    description:
      "The complete vision, world and creative rules.",
    icon: (
      <BookOpen className="h-5 w-5" />
    ),
  },
  {
    type: "production-plan",
    title: "Production Plan",
    description:
      "Scope, team, timeline, risks and execution.",
    icon: (
      <ClipboardList className="h-5 w-5" />
    ),
  },
  {
    type: "marketing-plan",
    title: "Marketing Plan",
    description:
      "Positioning, launch phases and audience growth.",
    icon: (
      <Megaphone className="h-5 w-5" />
    ),
  },
  {
    type: "investor-brief",
    title: "Investor Brief",
    description:
      "A clear stakeholder and opportunity narrative.",
    icon: (
      <BriefcaseBusiness className="h-5 w-5" />
    ),
  },
  {
    type: "social-campaign",
    title: "Social Campaign",
    description:
      "Launch-ready posts, videos and activations.",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    type: "project-brief",
    title: "Project Brief",
    description:
      "A structured brief for production stakeholders.",
    icon: (
      <ClipboardList className="h-5 w-5" />
    ),
  },
];

const ProductionWorkspace = forwardRef<
ProductionWorkspaceHandle,
ProductionWorkspaceProps>(function ProductionWorkspace(
  {
    project,
    versionId,
    versionLabel,
    branchName,
  },
  ref
) {

  const productionStorageKey = `museos-production-${createStorageSlug(project.title)}`;

  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOutputId, setMenuOutputId] = useState<string | null>(null);
  const [renamingOutputId, setRenamingOutputId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const {
    outputs: generatedOutputs,
    activeOutput,
    activeOutputId,
    setActiveOutputId,
    saveOutput,
    updateOutput,
    renameOutput,
    duplicateOutput,
    deleteOutput,
    clearOutputs,
  } = useProductionHistory({
    storageKey: productionStorageKey,
  });

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ProductionExportFormat | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const [selectedType, setSelectedType] =
    useState<ProductionOutputType | null>(
      null
    );

  const [loadingType, setLoadingType] =
    useState<ProductionOutputType | null>(
      null
    );

  const [error, setError] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  
  const generateOutput = useCallback(
  async (
    type: ProductionOutputType
  ): Promise<void> => {
    setSelectedType(type);
    setLoadingType(type);
    setError(null);

    document
      .getElementById(
        "workspace-production"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    try {
      const output =
        await generateProductionOutput({
          outputType: type,
          project,
          versionId,
          versionLabel,
          branchName,
        });

      saveOutput(output);

      setActiveOutputId(
        output.id
      );

      window.setTimeout(() => {
        const sectionId =
          type === "storyboard"
            ? "workspace-storyboards"
            : type === "pitch-deck"
              ? "workspace-pitch-deck"
              : "workspace-production-output";

        document
          .getElementById(
            sectionId
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 180);
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate output.";

      setError(message);
    } finally {
      setLoadingType(null);
    }
  },
  [
    branchName,
    project,
    saveOutput,
    setActiveOutputId,
    versionId,
    versionLabel,
  ]);

  useImperativeHandle(
  ref,
  () => ({
    generateStoryboard: () =>
      generateOutput(
        "storyboard"
      ),

    generatePitchDeck: () =>
      generateOutput(
        "pitch-deck"
      ),

    generateCreativeBible: () =>
      generateOutput(
        "creative-bible"
      ),

    generateProductionPlan: () =>
      generateOutput(
        "production-plan"
      ),

    generateMarketingPlan: () =>
      generateOutput(
        "marketing-plan"
      ),

    generateInvestorBrief: () =>
      generateOutput(
        "investor-brief"
      ),

    generateSocialCampaign: () =>
      generateOutput(
        "social-campaign"
      ),

    generateProjectBrief: () =>
      generateOutput(
        "project-brief"
      ),

    focusProduction: () => {
      document
        .getElementById(
          "workspace-production"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    },
  }),
  [generateOutput]);
  
  const copyOutput = async () => {
    if (!activeOutput) return;

    await navigator.clipboard.writeText(
      activeOutput.content
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  };

  const handleExport = async(format: ProductionExportFormat) => {
    if (!activeOutput) return;

    setExportingFormat(format);
    setExportError(null);
    setExportMenuOpen(false);

    try {
      await exportProductionOutput(
        activeOutput,
        format
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to export this asset.";

      setExportError(message);
    } finally {
      setExportingFormat(null);
    }
  };

  const updatePitchDeck = (
    nextDeck: PitchDeckOutputData
  ) => {
    if(!activeOutput) return;

    const nextContent = pitchDeckToText(nextDeck);

    updateOutput(activeOutput.id, {
      content: nextContent,
      structuredData: nextDeck,
    });
  };

  const beginRename = (
    outputId: string,
    currentTitle: string
  ) => {
    setRenamingOutputId(outputId);
    setRenameValue(currentTitle);
    setMenuOutputId(null);
  };

  const confirmRename = () => {
    if (!renamingOutputId) return;

    renameOutput(renamingOutputId, renameValue);

    setRenamingOutputId(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenamingOutputId(null);
    setRenameValue("");
  }

  /* Handlers */
  const handleClearOutputs = () => {
    const confirmed = window.confirm("Delete all generated production assets for this project");

    if (!confirmed) return;

    clearOutputs();
    setMenuOutputId(null);
    setHistoryOpen(false);
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-200" />

            <p className="text-sm font-medium text-white/80">
              MuseOS Production Studio
            </p>
          </div>

          <h3 className="mt-2 text-xl font-semibold text-white">
            Turn this universe into production-ready assets
          </h3>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/40">
            Every deliverable is generated from the currently
            selected branch and Time Machine version.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/45">
            Branch: {branchName || "Main"}
          </span>

          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-white/45">
            {versionLabel || "Current version"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {outputDefinitions.map((definition) => {
          const loading =
            loadingType === definition.type;

          const selected =
            selectedType === definition.type;

          return (
            <motion.button
              type="button"
              layout
              key={definition.type}
              onClick={() =>
                generateOutput(definition.type)
              }
              disabled={Boolean(loadingType)}
              className={`rounded-[22px] border p-4 text-left transition ${
                selected
                  ? "border-violet-300/30 bg-violet-400/[0.1]"
                  : "border-white/10 bg-black/25 hover:bg-white/[0.07]"
              } disabled:cursor-wait disabled:opacity-60`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/70">
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    definition.icon
                  )}
                </div>

                {generatedOutputs.some(
                  (output) =>
                    output.type === definition.type
                ) && (
                  <Check className="h-4 w-4 text-emerald-300" />
                )}
              </div>

              <p className="text-sm font-medium text-white/80">
                {definition.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                {loading
                  ? "Granite is creating this deliverable..."
                  : definition.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-300/15 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200/70">
          {error}
        </div>
      )}

      {generatedOutputs.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Generated Assets
              </p>

              <p className="mt-1 text-xs text-white/25">
                {generatedOutputs.length} saved{" "}
                {generatedOutputs.length === 1 ? "asset" : "assets"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50 transition hover:bg-white/10"
            >
              <History className="h-3.5 w-3.5" />
              View History
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {generatedOutputs
              .slice(0, 6)
              .map((output) => (
                <button
                  type="button"
                  key={output.id}
                  onClick={() => setActiveOutputId(output.id)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${
                    activeOutputId === output.id
                      ? "border-violet-300/25 bg-violet-400/15 text-violet-100"
                      : "border-white/10 bg-black/25 text-white/45 hover:bg-white/10"
                  }`}
                >
                  {output.title}
                </button>
              ))}

              {generatedOutputs.length > 6 && (
                <button
                  type="button"
                  onClick={() => setHistoryOpen(true)}
                  className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/35 hover:bg-white/10"
                >
                  +{generatedOutputs.length - 6} more
                </button>
              )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeOutput && (
          <motion.div
            id="workspace-production-output"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 18,
            }}
            className="mt-5 scroll-mt-24 overflow-hidden rounded-[26px] border border-white/10 bg-black/30"
          >
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-white/35">
                  Granite-generated deliverable
                </p>

                <h4 className="mt-1 text-lg font-semibold text-white/85">
                  {activeOutput.title}
                </h4>

                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-white/30">
                  <span>
                    {activeOutput.provider === "watsonx"
                      ? "IBM Granite · watsonx.ai"
                      : "Fallback mode"
                    }
                  </span>

                  <span>•</span>

                  <span>
                    Branch:{" "}
                    {activeOutput.branchName || "Main"}
                  </span>

                  <span>•</span>

                  <span>
                    {activeOutput.versionLabel || "Current Version"}
                  </span>

                  <span>•</span>

                  <span>
                    {formatGeneratedDate(activeOutput.generatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    generateOutput(activeOutput.type)
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55 transition hover:bg-white/10"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={copyOutput}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55 transition hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}

                  {copied ? "Copied" : "Copy"}
                </button>

                <div id= "workspace-exports" className="relative scroll-mt-24">
                  <button
                    type="button"
                    onClick={() => setExportMenuOpen((current) => !current)}
                    disabled={Boolean(exportingFormat)}
                    className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {exportingFormat ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}

                    {exportingFormat ? "Exporting" : "Export"}

                    <ChevronDown className="h-3 w-3" />
                  </button>

                  <AnimatePresence>
                    {exportMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -4 }}
                        className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1925] p-1.5 shadow-2xl"
                      >
                        <ExportMenuButton
                          icon={<FileText className="h-3.5 w-3.5" />}
                          label="Markdown"
                          onClick={() => handleExport("markdown")}
                        />

                        <ExportMenuButton
                          icon={<FileJson className="h-3.5 w-3.5" />}
                          label="JSON"
                          onClick={() => handleExport("json")}
                        />

                        <ExportMenuButton
                          icon={<FileType2 className="h-3.5 w-3.5" />}
                          label="PDF document"
                          onClick={() => handleExport("pdf")}
                        />

                        {activeOutput.structuredData?.format === "pitch-deck" && (
                          <ExportMenuButton
                            icon={<Presentation className="h-3.5 w-3.5" />}
                            label="PowerPoint"
                            onClick={() => handleExport("powerpoint")}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveOutputId(null);
                    setExportMenuOpen(false);
                    setExportError(null);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/40 hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {exportError && (
              <div className="border-b border-red-300/10 bg-red-400/[0.06] px-5 py-3 text-xs text-red-200/65">
                {exportError}
              </div>
            )}

            <div className="max-h-[760px] overflow-y-auto p-6">
              {activeOutput.structuredData?.format === 
                "storyboard" ? (
                  <section
                    id="workspace-storyboards"
                    className="scroll-mt-6"
                  >
                    <StoryboardStudio
                      storyboard={activeOutput.structuredData}
                    />
                  </section>
                ) : activeOutput.structuredData?.format === 
                  "pitch-deck" ? (
                    <section
                      id="workspace-pitch-deck"
                      className="scroll-mt-6"
                    >
                      <PitchDeckStudio
                        key={activeOutput.id}
                        deck={activeOutput.structuredData}
                        onChange={updatePitchDeck}
                      />
                    </section>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                      {activeOutput.content}
                    </div>
                  )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {historyOpen && (
    <>
      <motion.button
        type="button"
        aria-label="Close production history"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setHistoryOpen(false);
          setMenuOutputId(null);
        }}
        className="fixed inset-0 z-[110] cursor-default bg-black/65 backdrop-blur-md"
      />

      <motion.aside
        initial={{
          opacity: 0,
          x: 40,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: 40,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className="fixed bottom-4 right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#11101a] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <div className="flex items-center gap-2 text-white/75">
              <History className="h-4 w-4" />

              <p className="text-sm font-medium">
                Production History
              </p>
            </div>

            <p className="mt-1 text-xs text-white/30">
              {generatedOutputs.length} saved assets for{" "}
              {project.title}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setHistoryOpen(false);
              setMenuOutputId(null);
            }}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/45 transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {generatedOutputs.map(
              (output) => {
                const isActive =
                  output.id ===
                  activeOutputId;

                const isRenaming =
                  renamingOutputId ===
                  output.id;

                const menuOpen =
                  menuOutputId ===
                  output.id;

                return (
                  <article
                    key={output.id}
                    className={`relative rounded-[22px] border p-4 transition ${
                      isActive
                        ? "border-violet-300/25 bg-violet-400/[0.09]"
                        : "border-white/10 bg-white/[0.035]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveOutputId(
                            output.id
                          );

                          setHistoryOpen(
                            false
                          );

                          setMenuOutputId(
                            null
                          );
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-white/35">
                            {formatOutputType(
                              output.type
                            )}
                          </span>

                          <span
                            className={`rounded-full border px-2 py-1 text-[9px] ${
                              output.provider ===
                              "watsonx"
                                ? "border-emerald-300/10 bg-emerald-400/[0.07] text-emerald-200/50"
                                : "border-amber-300/10 bg-amber-400/[0.07] text-amber-200/50"
                            }`}
                          >
                            {output.provider ===
                            "watsonx"
                              ? "IBM Granite"
                              : "Fallback"}
                          </span>
                        </div>

                        {isRenaming ? (
                          <div
                            className="mt-3"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={(event) =>
                                setRenameValue(
                                  event.target
                                    .value
                                )
                              }
                              onKeyDown={(
                                event
                              ) => {
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
                                  cancelRename();
                                }
                              }}
                              className="w-full rounded-xl border border-violet-300/20 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                            />

                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={
                                  confirmRename
                                }
                                className="rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-black"
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={
                                  cancelRename
                                }
                                className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/45"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h5 className="mt-3 truncate text-sm font-medium text-white/75">
                              {output.title}
                            </h5>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
                              {getOutputPreview(
                                output.content
                              )}
                            </p>
                          </>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/25">
                          <span>
                            {output.branchName ||
                              "Main"}
                          </span>

                          <span>
                            {output.versionLabel ||
                              "Current version"}
                          </span>

                          <span>
                            {formatGeneratedDate(
                              output.generatedAt
                            )}
                          </span>
                        </div>
                      </button>

                      {!isRenaming && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuOutputId(
                                menuOpen
                                  ? null
                                  : output.id
                              )
                            }
                            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/35 transition hover:bg-white/10"
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
                                className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1925] p-1.5 shadow-2xl"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    beginRename(
                                      output.id,
                                      output.title
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-white/55 hover:bg-white/10"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Rename
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    duplicateOutput(
                                      output.id
                                    );

                                    setMenuOutputId(
                                      null
                                    );
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-white/55 hover:bg-white/10"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  Duplicate
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteOutput(
                                      output.id
                                    );

                                    setMenuOutputId(
                                      null
                                    );
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-red-200/55 hover:bg-red-400/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleClearOutputs}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300/10 bg-red-400/[0.05] px-4 py-3 text-xs text-red-200/50 transition hover:bg-red-400/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear production history
          </button>
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>
    </div>
  );
});

ProductionWorkspace.displayName = "ProductionWorkspace";
export default ProductionWorkspace;

function ExportMenuButton({
  icon,
  label,
  onClick,
} : {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-white/55 transition hover:bg-white/10 hover:text-white/75"
    >
      {icon}
      {label}
    </button>
  );
}

function formatOutputType(
  type: ProductionOutputType
): string {
  return type
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function getOutputPreview(
  content: string
): string {
  return content
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function formatGeneratedDate(
  timestamp: number
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(timestamp));
}

function createStorageSlug(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function pitchDeckToText(
  deck: PitchDeckOutputData
): string {
  const slides = deck.slides
    .map(
      (slide) => `SLIDE ${slide.slideNumber}: ${slide.title}

${slide.headline}

${slide.supportingPoints
  .map((point) => `- ${point}`)
  .join("\n")}

Visual direction:
${slide.visualDirection}

Speaker notes:
${slide.speakerNotes}`
    )
    .join("\n\n---\n\n");

  return `${deck.deckTitle}

${deck.deckSubtitle}

${slides}`;
}