import type { GeneratedImage, ImageGenerationRequest, ImageProvider } from "../types";

export class OpenAIImageProvider implements ImageProvider {
    readonly id = "openai";
    readonly label = "OpenAI Images";
    readonly model = "gpt-image-1";
    readonly supportsSeed = false;
    readonly supportsNegativePrompt = false;
    isConfigured() {
        return false;
    }
    async generate(_request: ImageGenerationRequest): Promise<GeneratedImage> {
        throw new Error("OpenAI Images not configured.");
    }

}