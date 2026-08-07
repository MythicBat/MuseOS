export type ImageProviderId =
  | "replicate"
  | "openai";

export type ImageAspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4";

export type ImageOutputFormat =
  | "webp"
  | "png"
  | "jpg";

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;

  width?: number;
  height?: number;

  aspectRatio?: ImageAspectRatio;

  seed?: number;
  steps?: number;
  guidanceScale?: number;

  outputFormat?: ImageOutputFormat;
  outputQuality?: number;
}

export interface GeneratedImage {
  url: string;
  provider: ImageProviderId;
  model: string;
  revisedPrompt?: string;
  seed?: number;
}

export interface ImageProvider {
  readonly id: ImageProviderId;
  readonly label: string;
  readonly model: string;
  readonly supportsSeed: boolean;
  readonly supportsNegativePrompt: boolean;

  isConfigured(): boolean;

  generate(
    request: ImageGenerationRequest
  ): Promise<GeneratedImage>;
}