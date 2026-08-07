import { ImageProviderManager } from "./manager";
import { ReplicateProvider } from "../providers/replicate";
import { OpenAIImageProvider } from "../providers/openai";

export function createImageManager() {
    return new ImageProviderManager(new ReplicateProvider());
}

export {
    ReplicateProvider,
    OpenAIImageProvider,
};

export type {
    GeneratedImage,
    ImageGenerationRequest,
    ImageProvider,
} from "./types";