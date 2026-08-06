import "server-only";

const DEFAULT_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "qwen2.5:3b";

export function getOllamaBaseUrl(): string {
    return (
        process.env.OLLAMA_BASE_URL?.trim() || DEFAULT_BASE_URL
    ).replace(/\/+$/, "");
}

export function getOllamaModel(): string {
    return (
        process.env.OLLAMA_MODEL?.trim() || DEFAULT_MODEL
    );
}

export function isOllamaConfigured(): boolean {
    return Boolean(
        getOllamaBaseUrl() && getOllamaModel()
    );
}