"use client";

import {
    BrainCircuit,
    Check,
    Cloud,
    Cpu,
    Laptop,
    Radio,
    Sparkles,
    Waves,
    RefreshCw,
} from "lucide-react";

import type { AIProvider, MuseSettings } from "@/types/settings";
import type { AIProviderStatus } from "@/types/aiProviderStatus";

interface AISettingsPanelProps {
    settings: MuseSettings["ai"];
    providerStatuses: AIProviderStatus[];
    statusLoading: boolean;
    statusError: string | null;
    checkedAt: number | null;

    onRefreshStatus: () => Promise<void>;
    onChange: (updates: Partial<MuseSettings["ai"]>) => void;
}

interface ProviderOption {
    id: AIProvider;
    name: string;
    subtitle: string;
    description: string;
    icon: typeof Cpu;
}

const providers: ProviderOption[] = [
  {
    id: "granite",
    name: "IBM Granite",
    subtitle: "watsonx.ai",
    description:
      "Primary MuseOS provider for creative reasoning and production generation.",
    icon: Cpu,
  },
  {
    id: "openai",
    name: "OpenAI",
    subtitle: "GPT models",
    description:
      "Cloud-based language and multimodal models.",
    icon: Sparkles,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    subtitle: "Vertex AI",
    description:
      "Google multimodal models for text, image and reasoning tasks.",
    icon: Cloud,
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    subtitle: "Claude models",
    description:
      "Long-context models designed for analysis and creative writing.",
    icon: BrainCircuit,
  },
  {
    id: "ollama",
    name: "Ollama",
    subtitle: "Local models",
    description:
      "Run supported models locally for private and offline generation.",
    icon: Laptop,
  },
];

const tokenOptions = [
    1024,
    2048,
    4096,
    8192,
    16384,
];

export default function AISettingsPanel({
    settings,
    providerStatuses,
    statusLoading,
    statusError,
    checkedAt,
    onRefreshStatus,
    onChange,
}: AISettingsPanelProps) {
    const activeProvider = providers.find((provider) => provider.id === settings.provider) ?? providers[0];

    const activeServerStatus = providerStatuses.find((status) => status.id === settings.provider);
    const activeConnected = activeServerStatus?.status === "connected";
    const activeStatusLabel = statusLoading ? "Checking" : activeConnected ? "Connected" : activeServerStatus?.status === "unavailable" ? "Unavailable" : "Configuration required";
    const creativityLabel = getCreativityLabel(settings.creativity);

    return (
        <div className="space-y-8">
            <PanelHeader
                title="Artificial Intelligence"
                description="Configure how MuseOS selects models, generates creative output and handles responses."
            />

            <SettingsGroup
                title="AI Provider"
                description="Choose the provider MuseOS should use for future generation requests."
            >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-white/[0.025] px-4 py-3">
                    <div>
                        <p className="text-xs font-medium text-white/55">Provider configuration</p>

                        <p className="mt-1 text-[10px] text-white/25">
                            {statusLoading ? "Checking server configuration..." : checkedAt ? `Last checked ${formatStatusTime(checkedAt)}` : "Status has not been checked."}
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={statusLoading}
                        onClick={() => { void onRefreshStatus(); }}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/45 transition hover:bg-white/10 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${statusLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {statusError && (
                    <div className="mb-4 rounded-[20px] border border-red-300/10 bg-red-400/[0.05] p-4">
                        <p className="text-sm font-medium text-red-100/70">Unable to check providers</p>

                        <p className="mt-1 text-xs leading-5 text-white/35">{statusError}</p>
                    </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                    {providers.map((provider) => {
                        const Icon = provider.icon;

                        const selected = provider.id === settings.provider;

                        const serverStatus = providerStatuses.find((status) => status.id === provider.id);
                        const connected = serverStatus?.status === "connected";
                        const statusLabel = statusLoading ? "Checking" : connected ? "Connected" : serverStatus?.status === "unavailable" ? "Unavailable" : "Not configured";

                        return (
                            <button
                                key={provider.id}
                                type="button"
                                onClick={() => onChange({provider: provider.id,})}
                                className={`relative rounded-[22px] border p-4 text-left transition ${
                                    selected ? "border-violet-300/25 bg-violet-400/[0.08]" : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                                            selected ? "border-violet-300/20 bg-violet-400/10 text-violet-100" : "border-white/10 bg-white/5 text-white/40"
                                        }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white/80">{provider.name}</p>
                                            <p className="mt-0.5 text-xs text-white/30">{provider.subtitle}</p>
                                        </div>
                                    </div>

                                    {selected && (
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-300 text-black">
                                            <Check className="h-3 w-3" />
                                        </span>
                                    )}
                                </div>

                                <p className="mt-4 text-xs leading-5 text-white/30">{provider.description}</p>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${
                                        statusLoading ? "bg-sky-300/70" : connected ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.7)]" : serverStatus?.status === "unavailable" ? "bg-red-300/70" : "bg-amber-300/70"
                                    }`}
                                    />

                                    <span className={`text-[10px] uppercase tracking-[0.14em] ${
                                        statusLoading ? "text-sky-200/45" : connected ? "text-emerald-200/55" : serverStatus?.status === "unavailable" ? "text-red-200/50" : "text-amber-200/45"
                                    }`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {settings.provider !== "granite" && (
                    <div className="mt-4 rounded-[20px] border border-amber-300/10 bg-amber-400/[0.045] p-4">
                        <p className="text-sm font-medium text-amber-100/70">Provider integration pending</p>

                        <p className="mt-1 text-xs leading-5 text-white/35">
                            This preference will be saved,
                            but MuseOS will continue using IBM Granite
                            until the selected provider is connected
                        </p>
                    </div>
                )}
            </SettingsGroup>

            <SettingsGroup
                title="Creativity"
                description="Control how adventurous or predictable generated ideas should be."
            >
                <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white/70">Creative Freedom</p>

                            <p className="mt-1 text-xs text-white/30">{creativityLabel}</p>
                        </div>

                        <span className="rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-100/75">{settings.creativity}%</span>
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={settings.creativity}
                        onChange={(event) => onChange({
                            creativity: Number(event.target.value),
                        })}
                        aria-label="Creativity"
                        className="mt-5 w-full accent-violet-400"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-white/70">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Experimental</span>
                    </div>
                </div>
            </SettingsGroup>

            <SettingsGroup
                title=" Temperature"
                description="Adjust the randomness supplied to compatible language models."
            >
                <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-white/70">Model Temperature</p>
                                <p className="mt-1 text-xs text-white/30">
                                    Lower values are focused;
                                    Higher values are more varied.
                                </p>
                            </div>

                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/65">
                                {settings.temperature.toFixed(1)}
                            </span>
                        </div>

                        <input
                            type="range"
                            min={0}
                            max={2}
                            step={0.1}
                            value={settings.temperature}
                            onChange={(event) => onChange({
                                temperature: Number(event.target.value),
                            })}
                            aria-label="Temperature"
                            className="mt-5 w-full accent-violet-400"
                        />

                        <div className="mt-2 flex justify-between text-[10px] text-white/20">
                            <span>0.0</span>
                            <span>1.0</span>
                            <span>2.0</span>
                        </div>
                </div>
            </SettingsGroup>

            <SettingsGroup
                title="Response Limits"
                description="Choose the maximum amount of content a provider may return."
            >
                <label className="block rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
                        <span className="text-sm font-medium text-white/70">Maximum output tokens</span>

                        <span className="mt-1 block text-xs leading-5 text-white/30">
                            Higher limits allow longer
                            documents but may increase
                            generation time and provider usage.
                        </span>

                        <select
                            value={settings.maxTokens}
                            onChange={(event) => onChange({
                                maxTokens: Number(event.target.value),
                            })}
                            className="mt-4 w-full rounded-2xl border border-white/10 bg-[#11101a] px-4 py-3 text-sm text-white/70 outline-none transition focus:border-violet-300/30"
                        >
                            {tokenOptions.map((tokens) => (
                                <option
                                    key={tokens}
                                    value={tokens}
                                >
                                    {tokens.toLocaleString()} tokens
                                </option>
                            ))}
                        </select>
                </label>
            </SettingsGroup>

            <SettingsGroup
                title="Response Delivery"
                description="Control how generated responses are presented."
            >
                <SettingsToggle
                    icon={<Waves className="h-4 w-4" />}
                    label="Stream responses"
                    description="Display generated content progressively when supported by the active provider."
                    checked={settings.streaming}
                    onChange={(checked) => onChange({
                        streaming: checked,
                    })}
                />
            </SettingsGroup>

            <SettingsGroup
                title="Provider Status"
                description="Current AI configuration used by MuseOS."
            >
                <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-100/75">
                                <Radio className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white/80">{activeProvider.name}</p>

                                <p className="mt-1 text-xs text-white/30">{activeServerStatus?.model ?? activeProvider.subtitle}</p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${
                                        statusLoading ? "bg-sky-300" : activeConnected ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.7)]"
                                        : activeServerStatus?.status === "unavailable" ? "bg-red-300" : "bg-amber-300"
                                    }`} />

                                    <span className="text-xs text-white/40">
                                        {activeStatusLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                            <StatusValue
                                label="Creativity"
                                value={`${settings.creativity}%`}
                            />

                            <StatusValue
                                label="Temperature"
                                value={settings.temperature.toFixed(1)}
                            />

                            <StatusValue
                                label="Token limit"
                                value={settings.maxTokens.toLocaleString()}
                            />

                            <StatusValue
                                label="Streaming"
                                value={settings.streaming ? "Enabled" : "Disabled"}
                            />

                            <StatusValue
                                label="Streaming Support"
                                value={activeServerStatus?.supportsStreaming ? "Supported" : "Not available"}
                            />
                        </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Used by</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {[
                                "Command Core",
                                "Production Studio",
                                "Storyboard",
                                "Pitch Deck",
                                "Creative Bible",
                            ].map((feature) => (
                                <span
                                    key={feature}
                                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/35"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsGroup>
        </div>
    );
}

function formatStatusTime(timestamp: number): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
        }
    ).format(new Date(timestamp));
}

function getCreativityLabel(value: number) : string {
    if (value <= 20) { return "Deterministic"; }
    if (value <= 40) { return "Precise"; }
    if (value <= 60) { return "Balanced"; }
    if (value <= 80) { return "Creative"; }

    return "Experimental";
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
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">MuseOS Settings</p>

            <h2 className="mt-2 text-2xl font-semibold text-white/90">{title}</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">{description}</p>
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
                <h3 className="text-sm font-medium text-white/70">{title}</h3>

                <p className="mt-1 text-xs text-white/30">{description}</p>
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
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between gap-5 rounded-[22px] border border-white/10 bg-white/[0.025] p-4 text-left transition hover:bg-white/[0.05]"
        >
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
                        {icon}
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium text-white/70">{label}</p>

                    <p className="mt-1 text-xs leading-5 text-white/30">{description}</p>
                </div>
            </div>

            <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                checked ? "bg-violet-400" : "bg-white/10"
            }`}
            >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
                    checked ? "left-6" : "left-1"
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
        <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">{label}</p>

            <p className="mt-1 text-xs font-medium text-white/55">{value}</p>
        </div>
    );
}