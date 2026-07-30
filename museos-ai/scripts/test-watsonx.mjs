import { WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { IamAuthenticator } from "ibm-cloud-sdk-core";
import fs from "node:fs";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} was not found`);
  }

  const contents = fs.readFileSync(path, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const required = [
  "WATSONX_AI_APIKEY",
  "WATSONX_AI_PROJECT_ID",
  "WATSONX_AI_URL",
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing ${name}`);
  }
}

const serviceUrl = process.env.WATSONX_AI_URL.replace(/\/+$/, "");

console.log("Testing watsonx:", {
  serviceUrl,
  projectIdStart: process.env.WATSONX_AI_PROJECT_ID.slice(0, 8),
  modelId:
    process.env.WATSONX_AI_MODEL_ID || "ibm/granite-4-h-small",
});

const watsonx = new WatsonXAI({
  version: "2024-05-31",
  serviceUrl,
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSONX_AI_APIKEY,
  }),
});

try {
  const response = await watsonx.textChat({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    modelId:
      process.env.WATSONX_AI_MODEL_ID || "ibm/granite-4-h-small",
    messages: [
      {
        role: "user",
        content: "Reply with exactly: Granite connected",
      },
    ],
    maxTokens: 30,
  });

  console.log(
    response.result.choices?.[0]?.message?.content ??
      response.result
  );
} catch (error) {
  console.error("watsonx test failed:");
  console.error(error);
  process.exitCode = 1;
}