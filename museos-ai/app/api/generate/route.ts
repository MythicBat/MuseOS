import { NextResponse } from "next/server";

import { createFallbackProject } from "@/lib/fallbackProject";
import { parseCreativeProject } from "@/lib/creativeProjectParser";
import { buildCreativePrompt } from "@/lib/prompts";
import {
  getWatsonxClient,
  getWatsonxModelId,
  getWatsonxProjectId,
  isWatsonxConfigured,
} from "@/lib/watsonx";
import { CreativeProject } from "@/types/creative";

export const runtime = "nodejs";

interface GenerateRequest {
  idea?: unknown;
}

export async function POST(request: Request) {
  let idea = "";

  try {
    const body = (await request.json()) as GenerateRequest;

    if (typeof body.idea !== "string" || !body.idea.trim()) {
      return NextResponse.json(
        { error: "A creative idea is required." },
        { status: 400 }
      );
    }

    idea = body.idea.trim();

    if (idea.length > 2000) {
      return NextResponse.json(
        { error: "Please keep the idea under 2,000 characters." },
        { status: 400 }
      );
    }

    const project = await generateCreativeUniverse(idea);

    return NextResponse.json(project, {
      headers: {
        "X-MuseOS-Provider": isWatsonxConfigured()
        ? "watsonx"
        : "fallback",
      },
    });
  } catch (error) {
    console.error("Creative-universe generation failed:", error);

    if (idea) {
      return NextResponse.json(createFallbackProject(idea), {
        headers: {
          "X-MuseOS-Provider": "fallback",
        },
      });
    }

    return NextResponse.json(
      { error: "MuseOS could not process this request." },
      { status: 500 }
    );
  }
}

async function generateCreativeUniverse(
  idea: string
): Promise<CreativeProject> {
  if (!isWatsonxConfigured()) {
    console.warn("watsonx.ai is not configured. Using fallback generation.");
    return createFallbackProject(idea);
  }

  try {
    const watsonx = getWatsonxClient();

    const response = await watsonx.textChat({
      modelId: getWatsonxModelId(),
      projectId: getWatsonxProjectId(),
      messages: [
        {
          role: "system",
          content:
            "You are MuseOS. Return only a valid JSON object matching the user's requested schema.",
        },
        {
          role: "user",
          content: buildCreativePrompt(idea),
        },
      ],
      maxTokens: 3000,
      temperature: 0.65,
    });

    const content = response.result.choices[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Granite returned an empty response.");
    }

    return parseCreativeProject(content, idea);
  } catch (error) {
    console.error(
      "Granite generation failed. Using MuseOS fallback:",
      error
    );

    return createFallbackProject(idea);
  }
}