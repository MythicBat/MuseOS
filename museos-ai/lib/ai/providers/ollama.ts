import type {
  AIRequest,
  AIResponse,
  MuseAIProvider,
} from "@/lib/ai/types";

export class OllamaProvider
  implements MuseAIProvider
{
  readonly id = "ollama" as const;
  readonly label = "Ollama";
  readonly model = "not-configured";

  isConfigured(): boolean {
    return false;
  }

  async generate(
    _request: AIRequest
  ): Promise<AIResponse> {
    throw new Error(
      "Ollama is not configured."
    );
  }
}