"use client";

import {
  Check,
  Monitor,
  Moon,
  Sparkles,
} from "lucide-react";

import type {
  GlassIntensity,
  MuseAccent,
  MuseSettings,
  MuseTheme,
} from "@/types/settings";

interface AppearancePanelProps {
  settings:
    MuseSettings["appearance"];

  onChange: (
    updates: Partial<
      MuseSettings["appearance"]
    >
  ) => void;
}

const themes: Array<{
  value: MuseTheme;
  label: string;
  description: string;
  icon: typeof Moon;
}> = [
  {
    value: "dark",
    label: "Dark",
    description:
      "MuseOS standard dark interface.",
    icon: Moon,
  },
  {
    value: "midnight",
    label: "Midnight",
    description:
      "Deeper contrast for focused creative work.",
    icon: Sparkles,
  },
  {
    value: "system",
    label: "System",
    description:
      "Follow your device appearance.",
    icon: Monitor,
  },
];

const accents: Array<{
  value: MuseAccent;
  label: string;
  className: string;
}> = [
  {
    value: "violet",
    label: "Violet",
    className:
      "bg-violet-400",
  },
  {
    value: "blue",
    label: "Blue",
    className:
      "bg-blue-400",
  },
  {
    value: "emerald",
    label: "Emerald",
    className:
      "bg-emerald-400",
  },
  {
    value: "rose",
    label: "Rose",
    className:
      "bg-rose-400",
  },
  {
    value: "amber",
    label: "Amber",
    className:
      "bg-amber-400",
  },
];

const glassOptions: Array<{
  value: GlassIntensity;
  label: string;
  description: string;
}> = [
  {
    value: "low",
    label: "Low",
    description:
      "Sharper panels with less blur.",
  },
  {
    value: "medium",
    label: "Medium",
    description:
      "Balanced depth and readability.",
  },
  {
    value: "high",
    label: "High",
    description:
      "Maximum translucent glass effect.",
  },
];

export default function AppearancePanel({
  settings,
  onChange,
}: AppearancePanelProps) {
  return (
    <div className="space-y-8">
      <PanelHeader
        title="Appearance"
        description="Control how MuseOS looks and feels across your creative workspace."
      />

      <SettingsGroup
        title="Theme"
        description="Choose the overall interface style."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {themes.map((theme) => {
            const Icon = theme.icon;

            const selected =
              settings.theme ===
              theme.value;

            return (
              <button
                key={theme.value}
                type="button"
                onClick={() =>
                  onChange({
                    theme:
                      theme.value,
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
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                      selected
                        ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {selected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-300 text-black">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-medium text-white/80">
                  {theme.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-white/30">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Accent color"
        description="Choose the highlight color used throughout MuseOS."
      >
        <div className="flex flex-wrap gap-3">
          {accents.map((accent) => {
            const selected =
              settings.accent ===
              accent.value;

            return (
              <button
                key={accent.value}
                type="button"
                onClick={() =>
                  onChange({
                    accent:
                      accent.value,
                  })
                }
                aria-label={`Use ${accent.label} accent`}
                className={`group flex items-center gap-3 rounded-full border px-4 py-3 transition ${
                  selected
                    ? "border-white/20 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${accent.className}`}
                />

                <span className="text-xs text-white/55">
                  {accent.label}
                </span>

                {selected && (
                  <Check className="h-3.5 w-3.5 text-white/65" />
                )}
              </button>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Glass intensity"
        description="Adjust panel transparency and blur."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {glassOptions.map(
            (option) => {
              const selected =
                settings.glassIntensity ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      glassIntensity:
                        option.value,
                    })
                  }
                  className={`rounded-[20px] border p-4 text-left transition ${
                    selected
                      ? "border-violet-300/20 bg-violet-400/[0.07]"
                      : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white/70">
                      {option.label}
                    </p>

                    {selected && (
                      <Check className="h-4 w-4 text-violet-200" />
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-white/30">
                    {option.description}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Motion"
        description="Control animation behavior."
      >
        <SettingsToggle
          label="Reduce motion"
          description="Use simpler transitions and reduce animated movement."
          checked={
            settings.reduceMotion
          }
          onChange={(checked) =>
            onChange({
              reduceMotion:
                checked,
            })
          }
        />
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
  label,
  description,
  checked,
  onChange,
}: {
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
      <div>
        <p className="text-sm font-medium text-white/70">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/30">
          {description}
        </p>
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