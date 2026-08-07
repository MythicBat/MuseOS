import type { AIProvider } from "@/types/settings";

export interface ImageGenerationRequest {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    seed?: number;
    steps?: number;
    guidanceScale?: number;
}

export interface GeneratedImage {
    url: string;
    provider: AIProvider;
    model: string;
    revisedPrompt?: string;
}

export interface ImageProvider {
    readonly id: string;
    readonly label: string;
    readonly model: string;
    readonly supportsSeed: boolean;
    readonly supportsNegativePrompt: boolean;
    isConfigured(): boolean;
    generate(request: ImageGenerationRequest): Promise<GeneratedImage>; 
}