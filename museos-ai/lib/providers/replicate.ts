import type {
    GeneratedImage,
    ImageGenerationRequest,
    ImageProvider,
} from "@/lib/image/types";

export class ReplicateProvider implements ImageProvider {
    readonly id = "replicate";
    readonly label = "Replicate";
    readonly model = "flux-dev";
    readonly supportsSeed = true;
    readonly supportsNegativePrompt = true;
    isConfigured() { return false; }
    async generate(_request: ImageGenerationRequest): Promise<GeneratedImage> {
        throw new Error("Replicate is not configured.");
    }
}