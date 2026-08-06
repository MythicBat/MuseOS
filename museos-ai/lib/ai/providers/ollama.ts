import "server-only";

import type {
  AIRequest,
  AIResponse,
  MuseAIProvider,
} from "@/lib/ai/types";

import {
  getOllamaBaseUrl,
  getOllamaModel,
  isOllamaConfigured,
} from "@/lib/ollama";

interface OllamaGenerateResponse {
  model?: string;
  response?: string;
  done?: boolean;
  done_reason?: string;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaTagsResponse {
  models?: Array<{
    name?: string;
    model?: string;
  }>;
}

export class OllamaProvider
  implements MuseAIProvider
{
  readonly id = "ollama" as const;
  readonly label = "Ollama";
  readonly supportsStreaming = false;

  get model(): string {
    return getOllamaModel();
  }

  isConfigured(): boolean {
    return isOllamaConfigured();
  }

  async generate(
    request: AIRequest
  ): Promise<AIResponse> {
    const baseUrl =
      getOllamaBaseUrl();

    const model =
      getOllamaModel();

    await ensureModelExists(
      baseUrl,
      model
    );

    const prompt =
      request.systemPrompt
        ? `${request.systemPrompt}

USER REQUEST:
${request.prompt}`
        : request.prompt;

    const response = await fetch(
      `${baseUrl}/api/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model,
          prompt,

          // MuseOS currently expects one
          // complete JSON response.
          stream: false,

          options: {
            temperature:
              request.temperature ??
              0.7,

            num_predict:
              request.maxTokens ??
              4096,
          },
        }),

        signal:
          AbortSignal.timeout(
            180_000
          ),
      }
    );

    const body =
      (await response
        .json()
        .catch(() => null)) as
        | OllamaGenerateResponse
        | {
            error?: string;
          }
        | null;

    if (!response.ok) {
      const message =
        body &&
        "error" in body &&
        typeof body.error ===
          "string"
          ? body.error
          : `Ollama request failed with status ${response.status}.`;

      throw new Error(message);
    }

    if (
      !body ||
      !("response" in body) ||
      typeof body.response !==
        "string" ||
      !body.response.trim()
    ) {
      throw new Error(
        "Ollama returned an empty response."
      );
    }

    const promptTokens =
      typeof body.prompt_eval_count ===
      "number"
        ? body.prompt_eval_count
        : undefined;

    const completionTokens =
      typeof body.eval_count ===
      "number"
        ? body.eval_count
        : undefined;

    return {
      text: body.response.trim(),

      provider: this.id,

      model:
        typeof body.model === "string"
          ? body.model
          : model,

      usage: {
        promptTokens,
        completionTokens,

        totalTokens:
          promptTokens !== undefined ||
          completionTokens !==
            undefined
            ? (promptTokens ?? 0) +
              (completionTokens ?? 0)
            : undefined,
      },
    };
  }
}

async function ensureModelExists(
  baseUrl: string,
  requiredModel: string
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(
      `${baseUrl}/api/tags`,
      {
        method: "GET",
        cache: "no-store",
        signal:
          AbortSignal.timeout(
            5000
          ),
      }
    );
  } catch {
    throw new Error(
      "Ollama is offline. Start Ollama and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Unable to reach Ollama at ${baseUrl}.`
    );
  }

  const body =
    (await response
      .json()
      .catch(() => null)) as
      | OllamaTagsResponse
      | null;

  const modelNames =
    body?.models
      ?.map(
        (model) =>
          model.name ??
          model.model
      )
      .filter(
        (
          model
        ): model is string =>
          typeof model ===
          "string"
      ) ?? [];

  const hasModel =
    modelNames.some(
      (modelName) =>
        modelName ===
          requiredModel ||
        modelName ===
          `${requiredModel}:latest` ||
        `${modelName}:latest` ===
          requiredModel
    );

  if (!hasModel) {
    throw new Error(
      `Ollama model "${requiredModel}" is not installed. Run: ollama pull ${requiredModel}`
    );
  }
}