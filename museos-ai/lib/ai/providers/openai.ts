import type { AIRequest, AIResponse, MuseAIProvider } from "@/lib/ai/types";

export class OpenAIProvider implements MuseAIProvider {
    readonly id = "openai" as const;
    readonly label = "OpenAI";
    readonly model = "not-configured";

    isConfigured(): boolean {
        return false;
    }

    async generate(_request: AIRequest): Promise<AIResponse> {
        throw new Error("OpenAI is not configured");
    }
}