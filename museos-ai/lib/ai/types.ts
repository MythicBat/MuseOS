import type { AIProvider as AIProviderId } from "@/types/settings";

export interface AIRequest {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}

export interface AIUsage {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
}

export interface AIResponse {
    text: string;
    provider: AIProviderId;
    model: string;
    usage?: AIUsage;
}

export interface MuseAIProvider {
    readonly id: AIProviderId;
    readonly label: string;
    readonly model: string;
    readonly supportsStreaming: boolean;

    isConfigured(): boolean;
    generate(request: AIRequest): Promise<AIResponse>;
}