"use client";

import type { ReactNode } from "react";

import {
  BadgeCheck,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  ExternalLink,
  GitBranch,
  Globe2,
  Layers3,
  PackageCheck,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import type { MuseSettings } from "@/types/settings";

interface AboutPanelProps {
  settings: MuseSettings;
}

interface TechnologyItem {
  name: string;
  description: string;
  icon: ReactNode;
}

interface CapabilityItem {
  title: string;
  description: string;
  icon: ReactNode;
}

const technologies: TechnologyItem[] = [
  {
    name: "Next.js",
    description:
      "Application framework powering the MuseOS interface and API routes.",
    icon: <Globe2 className="h-4 w-4" />,
  },
  {
    name: "React",
    description:
      "Interactive component architecture for the creative workspace.",
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    name: "TypeScript",
    description:
      "Strong typing across creative projects, production outputs and settings.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    name: "Tailwind CSS",
    description:
      "Responsive visual styling and the MuseOS glass interface system.",
    icon: <Palette className="h-4 w-4" />,
  },
  {
    name: "Framer Motion",
    description:
      "Motion, transitions and interaction feedback throughout MuseOS.",
    icon: <WandSparkles className="h-4 w-4" />,
  },
  {
    name: "IBM watsonx.ai",
    description:
      "AI platform currently powering IBM Granite generation workflows.",
    icon: <Cloud className="h-4 w-4" />,
  },
];

const capabilities: CapabilityItem[] = [
  {
    title: "Creative Canvas",
    description:
      "Visualise ideas as connected creative nodes, agents and concepts.",
    icon: <Layers3 className="h-5 w-5" />,
  },
  {
    title: "Command Core",
    description:
      "Refine the active creative universe using natural-language commands.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Production Studio",
    description:
      "Generate storyboards, pitch decks, briefs and campaign assets.",
    icon: <Boxes className="h-5 w-5" />,
  },
  {
    title: "AI Orchestra",
    description:
      "Coordinate writer, art director, producer and marketing perspectives.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Version Intelligence",
    description:
      "Track branches, compare changes and restore creative versions.",
    icon: <PackageCheck className="h-5 w-5" />,
  },
  {
    title: "Provider Architecture",
    description:
      "Prepared for Granite and future AI provider integrations.",
    icon: <Bot className="h-5 w-5" />,
  },
];

export default function AboutPanel({
  settings,
}: AboutPanelProps) {
  const providerLabel =
    getProviderLabel(
      settings.ai.provider
    );

  const providerStatus =
    settings.ai.provider === "granite"
      ? "Connected"
      : "Not configured";

  return (
    <div className="space-y-8">
      <PanelHeader
        title="About MuseOS"
        description="MuseOS is an AI creative operating system for turning an initial idea into a structured, production-ready creative universe."
      />

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_45%)]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-violet-300/15 bg-violet-400/[0.1] text-violet-100 shadow-[0_0_36px_rgba(139,92,246,0.12)]">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-semibold tracking-tight text-white/90">
                  MuseOS
                </p>

                <p className="mt-1 text-sm text-white/35">
                  Creative Operating System
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoBadge
                    label="Version 0.1.0"
                  />

                  <InfoBadge
                    label="IBM Granite"
                  />

                  <InfoBadge
                    label="Local-first projects"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-emerald-300/10 bg-emerald-400/[0.05] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]" />

                <p className="text-xs font-medium text-emerald-100/75">
                  System operational
                </p>
              </div>

              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                MuseOS workspace
              </p>
            </div>
          </div>

          <p className="relative mt-6 max-w-3xl text-sm leading-7 text-white/40">
            MuseOS combines AI-assisted concept development, visual orchestration,
            version intelligence and production asset generation in one cohesive
            creative workspace.
          </p>
        </div>
      </section>

      <SettingsGroup
        title="Current system"
        description="Active configuration and environment information."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SystemValue
            label="AI provider"
            value={providerLabel}
          />

          <SystemValue
            label="Provider status"
            value={providerStatus}
          />

          <SystemValue
            label="Generation mode"
            value={formatGenerationMode(
              settings.generation.defaultMode
            )}
          />

          <SystemValue
            label="Export profile"
            value={formatExportProfile(
              settings
            )}
          />

          <SystemValue
            label="Workspace mode"
            value={formatPerformanceMode(
              settings.workspace.performanceMode
            )}
          />

          <SystemValue
            label="Theme"
            value={formatTitle(
              settings.appearance.theme
            )}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Core capabilities"
        description="The major systems currently available inside MuseOS."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map(
            (capability) => (
              <div
                key={capability.title}
                className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/[0.07] text-violet-100/65">
                    {capability.icon}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/75">
                      {capability.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/30">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Technology"
        description="Frameworks and platforms used to build MuseOS."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {technologies.map(
            (technology) => (
              <div
                key={technology.name}
                className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.025] p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
                  {technology.icon}
                </div>

                <div>
                  <p className="text-sm font-medium text-white/70">
                    {technology.name}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    {technology.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="AI foundation"
        description="Current provider and model architecture."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/[0.07] text-blue-100/70">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-white/80">
                  {providerLabel}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Current preference for MuseOS AI generation
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      settings.ai.provider === "granite"
                        ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.7)]"
                        : "bg-amber-300"
                    }`}
                  />

                  <span className="text-xs text-white/40">
                    {providerStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <MiniValue
                label="Creativity"
                value={`${settings.ai.creativity}%`}
              />

              <MiniValue
                label="Temperature"
                value={settings.ai.temperature.toFixed(
                  1
                )}
              />

              <MiniValue
                label="Max tokens"
                value={settings.ai.maxTokens.toLocaleString()}
              />

              <MiniValue
                label="Streaming"
                value={
                  settings.ai.streaming
                    ? "Enabled"
                    : "Disabled"
                }
              />
            </div>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Project status"
        description="Current maturity and readiness of the MuseOS application."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.06] text-emerald-100/70">
              <Rocket className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                Advanced prototype
              </p>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/30">
                MuseOS currently includes project persistence, creative graph
                orchestration, IBM Granite generation, production outputs,
                version history, Spotlight commands, notifications, activity
                history and system settings.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <ReadinessValue
              label="Creative workspace"
              ready
            />

            <ReadinessValue
              label="Granite integration"
              ready
            />

            <ReadinessValue
              label="Production outputs"
              ready
            />

            <ReadinessValue
              label="Saved projects"
              ready
            />

            <ReadinessValue
              label="Provider switching"
              ready={false}
            />

            <ReadinessValue
              label="Cloud collaboration"
              ready={false}
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Credits"
        description="Project attribution and purpose."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/[0.07] text-violet-100/70">
              <Cpu className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                Designed and developed by Alin Merchant
              </p>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/30">
                MuseOS was created as an experimental AI creative operating
                system exploring how specialised agents and production tools can
                work together in a unified interface.
              </p>
            </div>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Resources"
        description="Useful project and platform destinations."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ResourceButton
            icon={<GitBranch className="h-4 w-4" />}
            label="Project repository"
            description="Open the MuseOS source repository."
            disabled
          />

          <ResourceButton
            icon={
              <ExternalLink className="h-4 w-4" />
            }
            label="IBM watsonx.ai"
            description="Review the AI platform powering Granite."
            disabled
          />
        </div>

        <p className="mt-3 text-[11px] leading-5 text-white/20">
          Resource links are intentionally disabled until their final URLs are
          added.
        </p>
      </SettingsGroup>
    </div>
  );
}

function getProviderLabel(
  provider:
    MuseSettings["ai"]["provider"]
): string {
  switch (provider) {
    case "openai":
      return "OpenAI";

    case "gemini":
      return "Google Gemini";

    case "claude":
      return "Anthropic Claude";

    case "ollama":
      return "Ollama";

    case "granite":
    default:
      return "IBM Granite";
  }
}

function formatGenerationMode(
  mode:
    MuseSettings["generation"]["defaultMode"]
): string {
  switch (mode) {
    case "fast":
      return "Fast";

    case "quality":
      return "Quality";

    case "balanced":
    default:
      return "Balanced";
  }
}

function formatPerformanceMode(
  mode:
    MuseSettings["workspace"]["performanceMode"]
): string {
  switch (mode) {
    case "quality":
      return "Quality";

    case "performance":
      return "Performance";

    case "balanced":
    default:
      return "Balanced";
  }
}

function formatExportProfile(
  settings: MuseSettings
): string {
  const format =
    settings.export.defaultFormat === "pptx"
      ? "PowerPoint"
      : settings.export.defaultFormat === "markdown"
        ? "Markdown"
        : settings.export.defaultFormat === "docx"
          ? "Word"
          : "PDF";

  const quality =
    settings.export.quality === "high"
      ? "High"
      : "Standard";

  return `${format} · ${quality}`;
}

function formatTitle(
  value: string
): string {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function PanelHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
        MuseOS Settings
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-white/90">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
        {description}
      </p>
    </div>
  );
}

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white/70">
          {title}
        </h3>

        <p className="mt-1 text-xs text-white/30">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function InfoBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] text-white/35">
      {label}
    </span>
  );
}

function SystemValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[10px] uppercase tracking-[0.13em] text-white/20">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white/65">
        {value}
      </p>
    </div>
  );
}

function MiniValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-white/55">
        {value}
      </p>
    </div>
  );
}

function ReadinessValue({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      {ready ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300/75" />
      ) : (
        <BadgeCheck className="h-4 w-4 shrink-0 text-amber-300/60" />
      )}

      <div>
        <p className="text-xs font-medium text-white/55">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] uppercase tracking-[0.11em] text-white/20">
          {ready
            ? "Available"
            : "Planned"}
        </p>
      </div>
    </div>
  );
}

function ResourceButton({
  icon,
  label,
  description,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.025] p-4 text-left transition enabled:hover:bg-white/[0.055] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/70">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/30">
          {description}
        </p>
      </div>

      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-white/20" />
    </button>
  );
}