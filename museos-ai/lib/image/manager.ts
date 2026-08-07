import type {
    GeneratedImage,
    ImageGenerationRequest,
    ImageProvider,
} from "@/lib/image/types";

export class ImageProviderManager {
    constructor(private readonly provider: ImageProvider) {}

    isConfigured() {
        return this.provider.isConfigured();
    }

    generate(request: ImageGenerationRequest): Promise<GeneratedImage> {
        if (!this.provider.isConfigured()) {
            throw new Error(`${this.provider.label} is not configured.`);
        }

        return this.provider.generate(request);
    }

    getProvider() {
        return this.provider;
    }
}