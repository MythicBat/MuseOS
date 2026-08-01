import type { AIRequest, AIResponse, MuseAIProvider } from "@/lib/ai/types";

export class AIProviderManager {
    constructor(private readonly provider: MuseAIProvider) {}

    getProvider(): MuseAIProvider { return this.provider; }
    isConfigured(): boolean { return this.provider.isConfigured(); }

    async generate(request: AIRequest): Promise<AIResponse> {
        if (!this.provider.isConfigured()) {
            throw new Error(`${this.provider.label} is not configured.`);
        }

        return this.provider.generate(request);
    }
}