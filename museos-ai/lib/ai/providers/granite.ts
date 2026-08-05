import "server-only";

import type { AIRequest, AIResponse, MuseAIProvider } from "@/lib/ai/types";
import { getWatsonxClient, getWatsonxModelId, getWatsonxProjectId, isWatsonxConfigured } from "@/lib/watsonx";

export class GraniteProvider implements MuseAIProvider {
    readonly id = "granite" as const;
    readonly label = "IBM Granite";
    readonly supportsStreaming = false;

    get model(): string {
        return getWatsonxModelId();
    }

    isConfigured(): boolean {
        return isWatsonxConfigured();
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const watsonx = getWatsonxClient();

        const response = await watsonx.textChat({
            modelId: getWatsonxModelId(),
            projectId: getWatsonxProjectId(),

            messages: [
                ...(request.systemPrompt ? [
                    {
                        role: "system" as const,
                        content: request.systemPrompt,
                    },
                ] : []),

                {
                    role: "user" as const,
                    content: request.prompt,
                },
            ],

            temperature: request.temperature ?? 0.7,

            maxTokens: request.maxTokens ?? 4096,
        });

        const text = response.result.choices?.[0]?.message?.content;

        if (typeof text !== "string" || !text.trim()) {
            throw new Error("IBM Granite returned an empty response.");
        }

        return {
            text: text.trim(),
            provider: this.id,
            model: getWatsonxModelId(),
        };
    }
}