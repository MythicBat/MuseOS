import type {
  AIRequest,
  AIResponse,
  MuseAIProvider,
} from "@/lib/ai/types";

export class GeminiProvider
  implements MuseAIProvider
{
  readonly id = "gemini" as const;
  readonly label =
    "Google Gemini";
  readonly model = "not-configured";

  isConfigured(): boolean {
    return false;
  }

  async generate(
    _request: AIRequest
  ): Promise<AIResponse> {
    throw new Error(
      "Google Gemini is not configured."
    );
  }
}