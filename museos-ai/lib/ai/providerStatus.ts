import "server-only";
import { createAIProvider } from "@/lib/ai";
import type { AIProvider } from "@/types/settings";
import type { AIProviderStatus } from "@/types/aiProviderStatus";

const providerIds: AIProvider[] = [
    "granite",
    "claude",
    "gemini",
    "openai",
    "ollama",
];

export function getAIProviderStatuses(): AIProviderStatus[] {
    return providerIds.map((providerId) => {
        try {
            const provider = createAIProvider(providerId);
            const configured = provider.isConfigured();

            return {
                id: provider.id,
                label: provider.label,
                model: provider.model,
                configured,
                status: configured ? "connected" : "not-configured",
                supportsStreaming: provider.supportsStreaming,
                message: configured ? `${provider.label} is configured and available` : `${provider.label} requires configuration`,
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
    });
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