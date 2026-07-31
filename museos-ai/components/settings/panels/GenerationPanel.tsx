"use client";

import {
  Archive,
  Check,
  Gauge,
  History,
  Save,
  Sparkles,
  Tags,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";

import type {
  GenerationMode,
  MuseSettings,
} from "@/types/settings";

interface GenerationPanelProps {
  settings: MuseSettings["generation"];

  onChange: (
    updates: Partial<
      MuseSettings["generation"]
    >
  ) => void;
}

interface GenerationModeOption {
  id: GenerationMode;
  label: string;
  description: string;
  detail: string;
  icon: typeof Gauge;
}

const generationModes: GenerationModeOption[] = [
  {
    id: "fast",
    label: "Fast",
    description:
      "Prioritises shorter generation times.",
    detail:
      "Best for rapid ideation and early drafts.",
    icon: Gauge,
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Balances speed, depth and creative quality.",
    detail:
      "Recommended for most MuseOS workflows.",
    icon: WandSparkles,
  },
  {
    id: "quality",
    label: "Quality",
    description:
      "Prioritises detail and production-ready output.",
    detail:
      "Best for final documents and presentations.",
    icon: Sparkles,
  },
];

export default function GenerationPanel({
  settings,
  onChange,
}: GenerationPanelProps) {
  const activeMode =
    generationModes.find(
      (mode) =>
        mode.id === settings.defaultMode
    ) ?? generationModes[1];

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Generation"
        description="Control how MuseOS creates, saves and manages generated creative work."
      />

      <SettingsGroup
        title="Default generation mode"
        description="Choose the behaviour MuseOS should use when starting a new generation."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {generationModes.map(
            (mode) => {
              const Icon = mode.icon;

              const selected =
                settings.defaultMode ===
                mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      defaultMode:
                        mode.id,
                    })
                  }
                  className={`relative rounded-[22px] border p-4 text-left transition ${
                    selected
                      ? "border-violet-300/25 bg-violet-400/[0.08]"
                      : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                        selected
                          ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
                          : "border-white/10 bg-white/5 text-white/40"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-300 text-black">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-medium text-white/80">
                    {mode.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    {mode.description}
                  </p>

                  <p className="mt-3 text-[11px] leading-5 text-white/20">
                    {mode.detail}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Saving"
        description="Choose how generated work is stored."
      >
        <div className="space-y-3">
          <SettingsToggle
            icon={
              <Save className="h-4 w-4" />
            }
            label="Auto-save generated work"
            description="Automatically save successful generations to the current project."
            checked={settings.autoSave}
            onChange={(checked) =>
              onChange({
                autoSave: checked,
              })
            }
          />

          <SettingsToggle
            icon={
              <Archive className="h-4 w-4" />
            }
            label="Save outputs to production history"
            description="Keep generated storyboards, decks, briefs and plans available in project history."
            checked={
              settings.saveToHistory
            }
            onChange={(checked) =>
              onChange({
                saveToHistory:
                  checked,
              })
            }
          />
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Version intelligence"
        description="Control how MuseOS tracks changes between generated outputs."
      >
        <SettingsToggle
          icon={
            <History className="h-4 w-4" />
          }
          label="Automatically create versions"
          description="Create a new project version after meaningful generation changes."
          checked={
            settings.autoVersioning
          }
          onChange={(checked) =>
            onChange({
              autoVersioning:
                checked,
            })
          }
        />
      </SettingsGroup>

      <SettingsGroup
        title="Output organisation"
        description="Control how MuseOS names and organises generated content."
      >
        <SettingsToggle
          icon={
            <Tags className="h-4 w-4" />
          }
          label="Automatically title outputs"
          description="Let MuseOS generate descriptive names for storyboards, decks and production documents."
          checked={settings.autoTitles}
          onChange={(checked) =>
            onChange({
              autoTitles: checked,
            })
          }
        />
      </SettingsGroup>

      <SettingsGroup
        title="Replacement protection"
        description="Prevent accidental replacement of existing generated work."
      >
        <SettingsToggle
          icon={
            <TriangleAlert className="h-4 w-4" />
          }
          label="Confirm before replacing output"
          description="Ask for confirmation before overwriting an existing production document."
          checked={
            settings.confirmBeforeReplace
          }
          onChange={(checked) =>
            onChange({
              confirmBeforeReplace:
                checked,
            })
          }
        />
      </SettingsGroup>

      <SettingsGroup
        title="Current behaviour"
        description="Summary of your active generation preferences."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-100/75">
              <WandSparkles className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80">
                {activeMode.label} generation
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                {activeMode.description}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatusValue
              label="Auto-save"
              value={
                settings.autoSave
                  ? "Enabled"
                  : "Disabled"
              }
            />

            <StatusValue
              label="Versioning"
              value={
                settings.autoVersioning
                  ? "Automatic"
                  : "Manual"
              }
            />

            <StatusValue
              label="Output titles"
              value={
                settings.autoTitles
                  ? "Automatic"
                  : "Manual"
              }
            />

            <StatusValue
              label="History"
              value={
                settings.saveToHistory
                  ? "Saved"
                  : "Not saved"
              }
            />

            <StatusValue
              label="Replacement"
              value={
                settings.confirmBeforeReplace
                  ? "Confirmation required"
                  : "Replace immediately"
              }
            />

            <StatusValue
              label="Mode"
              value={activeMode.label}
            />
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
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
  children: React.ReactNode;
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

function SettingsToggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-center justify-between gap-5 rounded-[22px] border border-white/10 bg-white/[0.025] p-4 text-left transition hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
            {icon}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-white/70">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-violet-400"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function StatusValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-white/55">
        {value}
      </p>
    </div>
  );
}