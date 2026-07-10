"server-only";

import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

let watsonxClient: WatsonXAI | null = null;

function requireEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export function isWatsonxConfigured(): boolean {
    return Boolean(
        process.env.WATSONX_AI_APIKEY &&
            process.env.WATSONX_AI_PROJECT_ID &&
            process.env.WATSONX_AI_URL
    );
}

export function getWatsonxProjectId(): string {
    return requireEnvironmentVariable("WATSONX_AI_PROJECT_ID");
}

export function getWatsonxModelId(): string {
    return process.env.WATSONX_AI_MODEL_ID || "ibm/granite-4-h-small";
}

export function getWatsonxClient(): WatsonXAI {
    if (watsonxClient) {
        return watsonxClient;
    }

    watsonxClient = new WatsonXAI({
        version: "2024-05-31",
        serviceUrl: requireEnvironmentVariable("WATSONX_AI_URL"),
    });

    return watsonxClient;
}