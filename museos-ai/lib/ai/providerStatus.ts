import "server-only";
import { createAIProvider } from "@/lib/ai";
import type { AIProvider } from "@/types/settings";
import type { AIProviderStatus } from "@/types/aiProviderStatus";
import type { MuseAIProvider } from "@/lib/ai/types";
import { getOllamaBaseUrl } from "@/lib/ollama";

const providerIds: AIProvider[] = [
    "granite",
    "claude",
    "gemini",
    "openai",
    "ollama",
];

export async function getAIProviderStatuses(): Promise<AIProviderStatus[]> {
    return Promise.all(
        providerIds.map(
            async (providerId) => {
                try {
                    const provider = createAIProvider(providerId);

                    if (providerId === "ollama") {
                        return checkOllamaStatus(provider);
                    }

                    const configured = provider.isConfigured();

                    return {
                        id: provider.id,
                        label: provider.label,
                        model: provider.model,
                        configured,
                        status: configured ? "connected" : "not-configured",
                        supportsStreaming: provider.supportsStreaming,
                        message: configured ? `${provider.label} is configured and avilable` : `${provider.label} requires configuration.`,
                    };
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Unable to inspect provider.";

                    return {
                        id: providerId,
                        label: getFallbackProviderLabel(providerId),
                        model: "unknown",
                        configured: false,
                        status: "unavailable",
                        supportsStreaming: false,
                        message,
                    };
                }
            }
        )
    );
}

async function checkOllamaStatus(provider: MuseAIProvider): Promise<AIProviderStatus> {
    const baseUrl = getOllamaBaseUrl();

    try {
        const response = await fetch(`${baseUrl}/api/tags`, {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(
                `Ollama returned status ${response.status}.`
            );
        }

        const body = (await response.json().catch(() => null)) as
            | {
                models?: Array<{
                    name?: string; 
                    model?: string;}>;
            } | null;

        const installedModels = body?.models?.map((item) => item.name ?? item.model).filter((model): model is string => typeof model === "string") ?? [];
        const selectedModelInstalled = installedModels.some((model) => model === provider.model || model === `${provider.model}:latest` || `${model}:latest` === provider.model);

        return {
            id: provider.id,
            label: provider.label,
            model: provider.model,
            configured: selectedModelInstalled,
            status: selectedModelInstalled ? "connected" : "not-configured",
            supportsStreaming: provider.supportsStreaming,
            message: installedModels.length === 0 ? "Ollama is running but no models are installed." : selectedModelInstalled
                ? `${provider.model} is installed and available` : `${provider.model} is not installed.`,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to connect to Ollama";

        return {
            id: provider.id,
            label: provider.label,
            model: provider.model,
            configured: false,
            status: "unavailable",
            supportsStreaming: provider.supportsStreaming,
            message: `Ollama is offline or unreachable. ${message}`,
        };
    }
}

function getFallbackProviderLabel(providerId: AIProvider): string {
    switch (providerId) {
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