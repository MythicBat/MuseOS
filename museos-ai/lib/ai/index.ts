import type { AIProvider as AIProviderId } from "@/types/settings";
import { AIProviderManager } from "@/lib/ai/manager";
import { GraniteProvider } from "@/lib/ai/providers/granite";
import { OpenAIProvider } from "@/lib/ai/providers/openai";
import { GeminiProvider } from "@/lib/ai/providers/gemini";
import { ClaudeProvider } from "@/lib/ai/providers/claude";
import { OllamaProvider } from "@/lib/ai/providers/ollama";
import type { MuseAIProvider } from "@/lib/ai/types";

export function createAIProvider(providerId: AIProviderId): MuseAIProvider {
    switch (providerId) {
        case "openai":
            return new OpenAIProvider();
        case "gemini":
            return new GeminiProvider();
        case "claude":
            return new ClaudeProvider();
        case "ollama":
            return new OllamaProvider();
        case "granite":
        default:
            return new GraniteProvider();
    }
}

export function createAIManager(providerId: AIProviderId): AIProviderManager {
    return new AIProviderManager(createAIProvider(providerId));
}

export type {
    AIRequest,
    AIResponse,
    AIUsage,
    MuseAIProvider,
} from "@/lib/ai/types";