import { NextResponse } from "next/server";
import { CreativeProject } from "@/types/creative";
import { buildCreativePrompt } from "@/lib/prompts";
import { createFallbackProject } from "@/lib/fallbackProject";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const project = await generateWithAI(idea);

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function generateWithAI(idea: string): Promise<CreativeProject> {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return createFallbackProject(idea);
  }

  try {
    const prompt = buildCreativePrompt(idea);

    /*
      Later, we will replace this section with IBM Granite / watsonx.

      For now, fallback keeps the app stable.
    */

    console.log("AI prompt ready:", prompt.slice(0, 120));

    return createFallbackProject(idea);
  } catch (error) {
    console.error("AI generation failed. Using fallback.", error);
    return createFallbackProject(idea);
  }
}