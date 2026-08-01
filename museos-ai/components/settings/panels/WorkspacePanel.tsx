"use client";

import type { ReactNode } from "react";

import {
  Bug,
  Check,
  Gauge,
  LayoutDashboard,
  MonitorCog,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  Rocket,
  Sparkles,
  TimerReset,
  View,
  WandSparkles,
  ZoomIn,
} from "lucide-react";

import type {
  AnimationSpeed,
  MuseSettings,
  PerformanceMode,
  SidebarBehavior,
  StartupView,
} from "@/types/settings";

interface WorkspacePanelProps {
  settings: MuseSettings["workspace"];

  onChange: (
    updates: Partial<MuseSettings["workspace"]>
  ) => void;
}

interface StartupOption {
  id: StartupView;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}

interface SidebarOption {
  id: SidebarBehavior;
  label: string;
  description: string;
  icon: typeof PanelLeft;
}

interface AnimationOption {
  id: AnimationSpeed;
  label: string;
  description: string;
}

interface PerformanceOption {
  id: PerformanceMode;
  label: string;
  description: string;
  detail: string;
  icon: typeof Gauge;
}

const startupOptions: StartupOption[] = [
  {
    id: "dashboard",
    label: "Open Dashboard",
    description:
      "Start MuseOS from the dashboard with access to recent projects and workspace activity.",
    icon: LayoutDashboard,
  },
  {
    id: "last-project",
    label: "Resume Last Project",
    description:
      "Automatically reopen the most recently active creative universe.",
    icon: PlayCircle,
  },
];

const sidebarOptions: SidebarOption[] = [
  {
    id: "expanded",
    label: "Always Expanded",
    description:
      "Open the workspace sidebar in its full navigation state.",
    icon: PanelLeftOpen,
  },
  {
    id: "collapsed",
    label: "Always Collapsed",
    description:
      "Begin with a compact sidebar to maximise canvas space.",
    icon: PanelLeftClose,
  },
  {
    id: "remember",
    label: "Remember Last State",
    description:
      "Restore the sidebar state used during the previous session.",
    icon: PanelLeft,
  },
];

const animationOptions: AnimationOption[] = [
  {
    id: "slow",
    label: "Slow",
    description:
      "Longer, more cinematic transitions.",
  },
  {
    id: "normal",
    label: "Normal",
    description:
      "Balanced motion for everyday use.",
  },
  {
    id: "fast",
    label: "Fast",
    description:
      "Quick transitions with minimal delay.",
  },
];

const performanceOptions: PerformanceOption[] = [
  {
    id: "quality",
    label: "Quality",
    description:
      "Preserve the full visual experience.",
    detail:
      "Best for modern devices and presentation environments.",
    icon: WandSparkles,
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Balance visuals and responsiveness.",
    detail:
      "Recommended for most MuseOS workspaces.",
    icon: Gauge,
  },
  {
    id: "performance",
    label: "Performance",
    description:
      "Reduce demanding visual effects.",
    detail:
      "Best for lower-powered devices or large creative graphs.",
    icon: Rocket,
  },
];

const zoomOptions = [
  75,
  100,
  125,
  150,
] as const;

export default function WorkspacePanel({
  settings,
  onChange,
}: WorkspacePanelProps) {
  const startupLabel =
    settings.startupView === "last-project"
      ? "Resume last project"
      : "Dashboard";

  const sidebarLabel =
    settings.sidebarBehavior === "expanded"
      ? "Always expanded"
      : settings.sidebarBehavior === "collapsed"
        ? "Always collapsed"
        : "Remember last state";

  const animationLabel =
    settings.animationSpeed === "slow"
      ? "Slow"
      : settings.animationSpeed === "fast"
        ? "Fast"
        : "Normal";

  const performanceLabel =
    settings.performanceMode === "quality"
      ? "Quality"
      : settings.performanceMode === "performance"
        ? "Performance"
        : "Balanced";

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Workspace"
        description="Configure how MuseOS starts, behaves and performs across creative workspaces."
      />

      <SettingsGroup
        title="Startup"
        description="Choose which area MuseOS should open when a new session begins."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {startupOptions.map((option) => {
            const Icon = option.icon;
            const selected =
              settings.startupView === option.id;

            return (
              <SelectionCard
                key={option.id}
                selected={selected}
                onClick={() =>
                  onChange({
                    startupView: option.id,
                  })
                }
                icon={
                  <Icon className="h-5 w-5" />
                }
                title={option.label}
                description={option.description}
              />
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Sidebar behaviour"
        description="Control how the workspace navigation sidebar appears when MuseOS opens."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {sidebarOptions.map((option) => {
            const Icon = option.icon;
            const selected =
              settings.sidebarBehavior ===
              option.id;

            return (
              <SelectionCard
                key={option.id}
                selected={selected}
                onClick={() =>
                  onChange({
                    sidebarBehavior:
                      option.id,
                  })
                }
                icon={
                  <Icon className="h-5 w-5" />
                }
                title={option.label}
                description={option.description}
              />
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Animation speed"
        description="Adjust the pace of workspace transitions, panels and motion effects."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {animationOptions.map(
            (option) => {
              const selected =
                settings.animationSpeed ===
                option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      animationSpeed:
                        option.id,
                    })
                  }
                  className={`relative rounded-[22px] border p-4 text-left transition ${
                    selected
                      ? "border-violet-300/25 bg-violet-400/[0.08]"
                      : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                          selected
                            ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
                            : "border-white/10 bg-white/5 text-white/35"
                        }`}
                      >
                        <TimerReset className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white/75">
                          {option.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/30">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {selected && (
                      <SelectedIndicator />
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Performance profile"
        description="Choose how MuseOS balances visual fidelity and responsiveness."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {performanceOptions.map(
            (option) => {
              const Icon = option.icon;
              const selected =
                settings.performanceMode ===
                option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      performanceMode:
                        option.id,
                    })
                  }
                  className={`relative rounded-[22px] border p-4 text-left transition ${
                    selected
                      ? "border-violet-300/25 bg-violet-400/[0.08]"
                      : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                        selected
                          ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
                          : "border-white/10 bg-white/5 text-white/35"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {selected && (
                      <SelectedIndicator />
                    )}
                  </div>

                  <p className="mt-4 text-sm font-medium text-white/75">
                    {option.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    {option.description}
                  </p>

                  <p className="mt-3 text-[11px] leading-5 text-white/20">
                    {option.detail}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Default canvas zoom"
        description="Set the zoom level used when opening a creative graph or production canvas."
      >
        <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/35">
              <ZoomIn className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/70">
                Canvas zoom
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                MuseOS will use this zoom level when a workspace does not have a saved canvas position.
              </p>
            </div>

            <span className="rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1 text-xs font-medium text-violet-100/70">
              {settings.defaultZoom}%
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {zoomOptions.map((zoom) => {
              const selected =
                settings.defaultZoom === zoom;

              return (
                <button
                  key={zoom}
                  type="button"
                  onClick={() =>
                    onChange({
                      defaultZoom: zoom,
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    selected
                      ? "border-violet-300/25 bg-violet-400/[0.1] text-violet-100"
                      : "border-white/10 bg-white/[0.025] text-white/35 hover:bg-white/[0.055] hover:text-white/60"
                  }`}
                >
                  {zoom}%
                </button>
              );
            })}
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Workspace effects"
        description="Enable or disable ambient interface behaviour throughout MuseOS."
      >
        <div className="space-y-3">
          <SettingsToggle
            icon={
              <Sparkles className="h-4 w-4" />
            }
            label="Ambient particles"
            description="Display subtle animated particles behind supported MuseOS workspaces."
            checked={
              settings.showParticles
            }
            onChange={(checked) =>
              onChange({
                showParticles: checked,
              })
            }
          />

          <SettingsToggle
            icon={
              <MonitorCog className="h-4 w-4" />
            }
            label="Auto-hide workspace dock"
            description="Hide the dock when it is not being used to provide additional canvas space."
            checked={
              settings.dockAutoHide
            }
            onChange={(checked) =>
              onChange({
                dockAutoHide: checked,
              })
            }
          />
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Developer tools"
        description="Enable additional diagnostics and experimental development features."
      >
        <SettingsToggle
          icon={
            <Bug className="h-4 w-4" />
          }
          label="Developer mode"
          description="Prepare MuseOS to expose request logs, debug overlays and experimental controls."
          checked={
            settings.developerMode
          }
          onChange={(checked) =>
            onChange({
              developerMode: checked,
            })
          }
        />

        {settings.developerMode && (
          <div className="mt-3 rounded-[20px] border border-amber-300/10 bg-amber-400/[0.045] p-4">
            <p className="text-sm font-medium text-amber-100/70">
              Developer mode enabled
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              This preference is active, but developer tools will remain hidden until their interfaces are connected.
            </p>
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup
        title="Current workspace profile"
        description="Summary of the workspace preferences MuseOS will apply."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-100/75">
              <View className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                MuseOS Workspace
              </p>

              <p className="mt-1 text-xs text-white/30">
                {performanceLabel} performance profile
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatusValue
              label="Startup"
              value={startupLabel}
            />

            <StatusValue
              label="Sidebar"
              value={sidebarLabel}
            />

            <StatusValue
              label="Animation"
              value={animationLabel}
            />

            <StatusValue
              label="Performance"
              value={performanceLabel}
            />

            <StatusValue
              label="Canvas zoom"
              value={`${settings.defaultZoom}%`}
            />

            <StatusValue
              label="Particles"
              value={
                settings.showParticles
                  ? "Enabled"
                  : "Disabled"
              }
            />

            <StatusValue
              label="Dock"
              value={
                settings.dockAutoHide
                  ? "Auto-hide"
                  : "Always visible"
              }
            />

            <StatusValue
              label="Developer mode"
              value={
                settings.developerMode
                  ? "Enabled"
                  : "Disabled"
              }
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

function SelectionCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-[22px] border p-4 text-left transition ${
        selected
          ? "border-violet-300/25 bg-violet-400/[0.08]"
          : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            selected
              ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
              : "border-white/10 bg-white/5 text-white/35"
          }`}
        >
          {icon}
        </div>

        {selected && (
          <SelectedIndicator />
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-white/75">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/30">
        {description}
      </p>
    </button>
  );
}

function SelectedIndicator() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-300 text-black">
      <Check className="h-3 w-3" />
    </span>
  );
}

function SettingsToggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon?: ReactNode;
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