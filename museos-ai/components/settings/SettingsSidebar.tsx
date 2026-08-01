"use client";

import type { ComponentType } from "react";

import {
  Bot,
  Download,
  Info,
  MonitorCog,
  Palette,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type {
  MuseSettings,
  SettingsSection,
} from "@/types/settings";

interface SettingsSidebarProps {
  activeSection: SettingsSection;

  settings: MuseSettings;

  onSectionChange: (
    section: SettingsSection
  ) => void;
}

interface NavigationItem {
  id: SettingsSection;
  label: string;
  description: string;
  icon: ComponentType<{
    className?: string;
  }>;
  keywords: string[];
}

const mainNavigation: NavigationItem[] = [
  {
    id: "appearance",
    label: "Appearance",
    description:
      "Theme, accent and motion",
    icon: Palette,
    keywords: [
      "theme",
      "colour",
      "color",
      "accent",
      "glass",
      "motion",
    ],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    description:
      "Provider and model behaviour",
    icon: Bot,
    keywords: [
      "ai",
      "provider",
      "granite",
      "openai",
      "ollama",
      "gemini",
      "claude",
      "temperature",
      "tokens",
    ],
  },
  {
    id: "generation",
    label: "Generation",
    description:
      "Saving, versions and quality",
    icon: WandSparkles,
    keywords: [
      "generation",
      "save",
      "version",
      "history",
      "quality",
      "fast",
      "balanced",
    ],
  },
  {
    id: "export",
    label: "Export",
    description:
      "Formats and delivery",
    icon: Download,
    keywords: [
      "export",
      "pdf",
      "powerpoint",
      "pptx",
      "markdown",
      "word",
      "quality",
      "metadata",
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    description:
      "Startup, canvas and performance",
    icon: MonitorCog,
    keywords: [
      "workspace",
      "startup",
      "sidebar",
      "animation",
      "performance",
      "zoom",
      "particles",
      "developer",
    ],
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    id: "about",
    label: "About MuseOS",
    description:
      "Version and system information",
    icon: Info,
    keywords: [
      "about",
      "version",
      "credits",
      "system",
      "technology",
      "watsonx",
      "granite",
    ],
  },
];

export default function SettingsSidebar({
  activeSection,
  settings,
  onSectionChange,
}: SettingsSidebarProps) {
  const providerLabel =
    getProviderLabel(
      settings.ai.provider
    );

  const workspaceLabel =
    getPerformanceLabel(
      settings.workspace
        .performanceMode
    );

  const themeLabel =
    getThemeLabel(
      settings.appearance.theme
    );

  return (
    <aside className="flex shrink-0 flex-col border-b border-white/10 bg-black/10 md:w-72 md:border-b-0 md:border-r">
      <div className="border-b border-white/10 p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.09] text-violet-100">
            <Sparkles className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white/85">
              MuseOS Settings
            </p>

            <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.15em] text-white/25">
              System preferences
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />

          <input
            type="search"
            placeholder="Search settings"
            aria-label="Search settings"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-2.5 pl-9 pr-3 text-xs text-white/65 outline-none transition placeholder:text-white/20 focus:border-violet-300/25 focus:bg-white/[0.05]"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto p-3 md:overflow-y-auto md:p-4">
        <div className="flex gap-2 md:block md:space-y-6">
          <NavigationGroup
            label="Preferences"
            items={mainNavigation}
            activeSection={activeSection}
            onSectionChange={
              onSectionChange
            }
          />

          <NavigationGroup
            label="System"
            items={secondaryNavigation}
            activeSection={activeSection}
            onSectionChange={
              onSectionChange
            }
          />
        </div>
      </div>

      <div className="hidden border-t border-white/10 p-4 md:block">
        <p className="px-1 text-[9px] font-medium uppercase tracking-[0.17em] text-white/20">
          Current system
        </p>

        <div className="mt-3 space-y-2">
          <SidebarStatus
            label="AI provider"
            value={providerLabel}
            status={
              settings.ai.provider ===
              "granite"
                ? "connected"
                : "pending"
            }
          />

          <SidebarStatus
            label="Workspace"
            value={workspaceLabel}
          />

          <SidebarStatus
            label="Theme"
            value={themeLabel}
          />

          <SidebarStatus
            label="Version"
            value="0.1.0"
          />
        </div>
      </div>
    </aside>
  );
}

function NavigationGroup({
  label,
  items,
  activeSection,
  onSectionChange,
}: {
  label: string;
  items: NavigationItem[];
  activeSection: SettingsSection;

  onSectionChange: (
    section: SettingsSection
  ) => void;
}) {
  return (
    <section className="min-w-max md:min-w-0">
      <p className="mb-2 hidden px-2 text-[9px] font-medium uppercase tracking-[0.17em] text-white/20 md:block">
        {label}
      </p>

      <div className="flex gap-2 md:flex-col md:gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          const selected =
            activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSectionChange(
                  item.id
                )
              }
              aria-current={
                selected
                  ? "page"
                  : undefined
              }
              className={`group flex min-w-[150px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition md:min-w-0 ${
                selected
                  ? "border-violet-300/20 bg-violet-400/[0.09] text-violet-100"
                  : "border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white/65"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                  selected
                    ? "border-violet-300/15 bg-violet-400/[0.1] text-violet-100"
                    : "border-white/[0.07] bg-white/[0.035] text-white/30 group-hover:text-white/50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">
                  {item.label}
                </span>

                <span
                  className={`mt-0.5 hidden truncate text-[10px] md:block ${
                    selected
                      ? "text-violet-100/45"
                      : "text-white/20"
                  }`}
                >
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SidebarStatus({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?:
    | "connected"
    | "pending";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.11em] text-white/20">
          {label}
        </p>

        <p className="mt-1 truncate text-[11px] font-medium text-white/50">
          {value}
        </p>
      </div>

      {status && (
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            status ===
            "connected"
              ? "bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.65)]"
              : "bg-amber-300"
          }`}
        />
      )}
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

function getPerformanceLabel(
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

function getThemeLabel(
  theme:
    MuseSettings["appearance"]["theme"]
): string {
  switch (theme) {
    case "midnight":
      return "Midnight";

    case "system":
      return "System";

    case "dark":
    default:
      return "Dark";
  }
}