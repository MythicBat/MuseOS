import { NextResponse } from "next/server";

import {
  CreativeProject,
  ProductionOutputType,
} from "@/types/creative";

import {
  getWatsonxClient,
  getWatsonxModelId,
  getWatsonxProjectId,
  isWatsonxConfigured,
} from "@/lib/watsonx";

import { buildProductionOutputPrompt } from "@/lib/prompts";

const supportedOutputTypes: ProductionOutputType[] = [
  "pitch-deck",
  "storyboard",
  "creative-bible",
  "production-plan",
  "marketing-plan",
  "investor-brief",
  "social-campaign",
  "project-brief",
];

interface OutputRequestBody {
  outputType?: unknown;
  project?: unknown;
  versionId?: unknown;
  versionLabel?: unknown;
  branchName?: unknown;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OutputRequestBody;

    if (
      typeof body.outputType !== "string" ||
      !supportedOutputTypes.includes(
        body.outputType as ProductionOutputType
      )
    ) {
      return NextResponse.json(
        { error: "A valid output type is required." },
        { status: 400 }
      );
    }

    if (!isCreativeProject(body.project)) {
      return NextResponse.json(
        { error: "A valid creative project is required." },
        { status: 400 }
      );
    }

    const outputType =
      body.outputType as ProductionOutputType;

    const project = body.project;

    const branchName =
      typeof body.branchName === "string"
        ? body.branchName
        : undefined;

    const versionLabel =
      typeof body.versionLabel === "string"
        ? body.versionLabel
        : undefined;

    const versionId =
      typeof body.versionId === "string"
        ? body.versionId
        : undefined;

    const prompt = buildProductionOutputPrompt({
      outputType,
      project,
      branchName,
      versionLabel,
    });

    let content: string;
    let provider: "watsonx" | "fallback";

    if (isWatsonxConfigured()) {
      try {
        content = await generateWithGranite(prompt);
        provider = "watsonx";
      } catch (error) {
        console.error(
          "Granite output generation failed:",
          error
        );

        content = createFallbackOutput(
          outputType,
          project
        );

        provider = "fallback";
      }
    } else {
      content = createFallbackOutput(
        outputType,
        project
      );

      provider = "fallback";
    }

    return NextResponse.json({
      id: `output-${Date.now()}`,
      type: outputType,
      title: getOutputTitle(outputType),
      content,
      generatedAt: Date.now(),
      provider,
      projectTitle: project.title,
      versionId,
      branchName,
    });
  } catch (error) {
    console.error(
      "Production output request failed:",
      error
    );

    return NextResponse.json(
      { error: "Unable to generate the output." },
      { status: 500 }
    );
  }
}

async function generateWithGranite(
  prompt: string
): Promise<string> {
  const watsonx = getWatsonxClient();

  const response = await watsonx.textChat({
    modelId: getWatsonxModelId(),
    projectId: getWatsonxProjectId(),

    messages: [
      {
        role: "system",
        content:
          "You are MuseOS, a senior creative director and production strategist.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    maxTokens: 2600,
    temperature: 0.55,
  });

  const content =
    response.result.choices?.[0]?.message?.content;

  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    throw new Error(
      "Granite returned an empty production output."
    );
  }

  return content.trim();
}

function isCreativeProject(
  value: unknown
): value is CreativeProject {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const project =
    value as Partial<CreativeProject>;

  return Boolean(
    typeof project.title === "string" &&
      typeof project.idea === "string" &&
      project.dna &&
      Array.isArray(project.nodes) &&
      Array.isArray(project.edges) &&
      Array.isArray(project.sections) &&
      Array.isArray(project.agents)
  );
}

function getOutputTitle(
  outputType: ProductionOutputType
): string {
  const titles: Record<
    ProductionOutputType,
    string
  > = {
    "pitch-deck": "Pitch Deck",
    storyboard: "Cinematic Storyboard",
    "creative-bible": "Creative Bible",
    "production-plan": "Production Plan",
    "marketing-plan": "Marketing Plan",
    "investor-brief": "Investor Brief",
    "social-campaign": "Social Campaign",
    "project-brief": "Project Brief",
  };

  return titles[outputType];
}

function createFallbackOutput(
  outputType: ProductionOutputType,
  project: CreativeProject
): string {
  const relevantSection =
    project.sections
      .map(
        (section) =>
          `${section.title}\n${section.text}`
      )
      .join("\n\n");

  return `${getOutputTitle(outputType)}

Project: ${project.title}

Creative premise:
${project.idea}

Creative DNA:
Genre: ${project.dna.genre}
Tone: ${project.dna.tone}
Audience: ${project.dna.audience}
Mood: ${project.dna.mood}
Palette: ${project.dna.colors.join(", ")}

Creative direction:
${relevantSection}

This fallback deliverable preserves the current creative universe. Regenerate when IBM Granite is available for a more detailed production document.`;
}