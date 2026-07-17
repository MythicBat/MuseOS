import "server-only";

import { WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

let cachedClient: WatsonXAI | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function isWatsonxConfigured(): boolean {
  return Boolean(
    process.env.WATSONX_AI_APIKEY?.trim() &&
      process.env.WATSONX_AI_PROJECT_ID?.trim() &&
      process.env.WATSONX_AI_URL?.trim()
  );
}

export function getWatsonxProjectId(): string {
  return requireEnv("WATSONX_AI_PROJECT_ID");
}

export function getWatsonxModelId(): string {
  return (
    process.env.WATSONX_AI_MODEL_ID?.trim() ||
    "ibm/granite-4-h-small"
  );
}

export function getWatsonxServiceUrl(): string {
  const rawUrl = requireEnv("WATSONX_AI_URL");

  return rawUrl.replace(/\/+$/, "");
}

export function getWatsonxClient(): WatsonXAI {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new WatsonXAI({
    version: "2024-05-31",
    serviceUrl: getWatsonxServiceUrl(),
    authenticator: new IamAuthenticator({
      apikey: requireEnv("WATSONX_AI_APIKEY"),
    }),
  });

  return cachedClient;
}