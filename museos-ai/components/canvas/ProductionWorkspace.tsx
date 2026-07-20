"use client";

import {
  useState,
} from "react";

import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  Clapperboard,
  ClipboardList,
  Copy,
  Download,
  Presentation,
  LoaderCircle,
  Megaphone,
  RefreshCw,
  Rocket,
  Sparkles,
  X,
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

interface ProductionWorkspaceProps {
  project: CreativeProject;
  versionId?: string;
  versionLabel?: string;
  branchName?: string;
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

export default function ProductionWorkspace({
  project,
  versionId,
  versionLabel,
  branchName,
}: ProductionWorkspaceProps) {

  const productionStorageKey = `museos-production-${createStorageSlug(project.title)}`;

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

  const generateOutput = async (
    type: ProductionOutputType
  ) => {
    setSelectedType(type);
    setLoadingType(type);
    setError(null);

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

    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate output.";

      setError(message);
    } finally {
      setLoadingType(null);
    }
  };

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

  const downloadMarkdown = () => {
    if (!activeOutput) return;

    const safeTitle =
      activeOutput.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const fileContent = `# ${activeOutput.title}

Project: ${activeOutput.projectTitle}
Branch: ${activeOutput.branchName || "Main"}
Generated: ${new Date(
      activeOutput.generatedAt
    ).toLocaleString()}

${activeOutput.content}
`;

    const blob = new Blob([fileContent], {
      type: "text/markdown;charset=utf-8",
    });

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = `${safeTitle || "museos-output"}.md`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
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
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/30">
            Generated assets
          </p>

          <div className="flex flex-wrap gap-2">
            {generatedOutputs.map((output) => (
              <button
                type="button"
                key={output.id}
                onClick={() =>
                  setActiveOutputId(output.id)
                }
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  activeOutputId === output.id
                    ? "border-violet-300/25 bg-violet-400/15 text-violet-100"
                    : "border-white/10 bg-black/25 text-white/45 hover:bg-white/10"
                }`}
              >
                {output.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeOutput && (
          <motion.div
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
            className="mt-5 overflow-hidden rounded-[26px] border border-white/10 bg-black/30"
          >
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-white/35">
                  Granite-generated deliverable
                </p>

                <h4 className="mt-1 text-lg font-semibold text-white/85">
                  {activeOutput.title}
                </h4>

                <p className="mt-1 text-xs text-white/30">
                  {activeOutput.provider === "watsonx"
                    ? "IBM Granite · watsonx.ai"
                    : "Fallback mode"}
                </p>
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

                <button
                  type="button"
                  onClick={downloadMarkdown}
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-black"
                >
                  <Download className="h-3.5 w-3.5" />
                  Markdown
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveOutputId(null)
                  }
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/40 hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-[760px] overflow-y-auto p-6">
              {activeOutput.structuredData?.format === 
                "storyboard" ? (
                  <StoryboardStudio
                    storyboard={activeOutput.structuredData}
                  />
                ) : activeOutput.structuredData?.format === 
                  "pitch-deck" ? (
                    <PitchDeckStudio
                      key={activeOutput.id}
                      deck={activeOutput.structuredData}
                      onChange={updatePitchDeck}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                      {activeOutput.content}
                    </div>
                  )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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