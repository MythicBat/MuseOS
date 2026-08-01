import type {
  AIRequest,
  AIResponse,
  MuseAIProvider,
} from "@/lib/ai/types";

export class ClaudeProvider
  implements MuseAIProvider
{
  readonly id = "claude" as const;
  readonly label =
    "Anthropic Claude";
  readonly model = "not-configured";

  isConfigured(): boolean {
    return false;
  }

  async generate(
    _request: AIRequest
  ): Promise<AIResponse> {
    throw new Error(
      "Anthropic Claude is not configured."
    );
  }
}