import { NextResponse } from "next/server";

import {
  CreativeProject,
  GeneratedProductionOutput,
  PitchDeckOutputData,
  PitchDeckSlide,
  ProductionOutputType,
  StoryboardOutputData,
  StoryboardScene,
  StructuredProductionOutput,
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
        {
          error:
            "A valid output type is required.",
        },
        { status: 400 }
      );
    }

    if (!isCreativeProject(body.project)) {
      return NextResponse.json(
        {
          error:
            "A valid creative project is required.",
        },
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
    let structuredData:
      | StructuredProductionOutput
      | undefined;

    let provider: "watsonx" | "fallback";

    if (isWatsonxConfigured()) {
      try {
        const graniteResult =
          await generateWithGranite(prompt);

        if (isStructuredType(outputType)) {
          structuredData =
            parseStructuredOutput(
              graniteResult,
              outputType
            );

          content =
            structuredOutputToText(
              structuredData
            );
        } else {
          content = graniteResult;
        }

        provider = "watsonx";
      } catch (error) {
        console.error(
          "Granite output generation failed:",
          error
        );

        const fallback =
          createFallbackOutput(
            outputType,
            project
          );

        content = fallback.content;
        structuredData =
          fallback.structuredData;
        provider = "fallback";
      }
    } else {
      const fallback =
        createFallbackOutput(
          outputType,
          project
        );

      content = fallback.content;
      structuredData =
        fallback.structuredData;
      provider = "fallback";
    }

    const response: GeneratedProductionOutput = {
      id: `output-${Date.now()}`,
      type: outputType,
      title: getOutputTitle(outputType),
      content,
      structuredData,
      generatedAt: Date.now(),
      provider,
      projectTitle: project.title,
      versionId,
      versionLabel,
      branchName,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Production output request failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate the output.",
      },
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

    maxTokens: 4000,
    temperature: 0.5,
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

function isStructuredType(
  outputType: ProductionOutputType
): outputType is "pitch-deck" | "storyboard" {
  return (
    outputType === "pitch-deck" ||
    outputType === "storyboard"
  );
}

function parseStructuredOutput(
  rawContent: string,
  outputType: "pitch-deck" | "storyboard"
): StructuredProductionOutput {
  const cleanedContent =
    cleanJsonResponse(rawContent);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedContent);
  } catch {
    throw new Error(
      "Granite returned invalid structured JSON."
    );
  }

  if (outputType === "storyboard") {
    if (!isStoryboardOutput(parsed)) {
      throw new Error(
        "Granite returned an invalid storyboard structure."
      );
    }

    return parsed;
  }

  if (!isPitchDeckOutput(parsed)) {
    throw new Error(
      "Granite returned an invalid pitch-deck structure."
    );
  }

  return parsed;
}

function cleanJsonResponse(
  rawContent: string
): string {
  let cleaned = rawContent.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  return cleaned;
}

function isStoryboardOutput(
  value: unknown
): value is StoryboardOutputData {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const storyboard =
    value as Partial<StoryboardOutputData>;

  return Boolean(
    storyboard.format === "storyboard" &&
      typeof storyboard.logline ===
        "string" &&
      typeof storyboard.visualApproach ===
        "string" &&
      Array.isArray(storyboard.scenes) &&
      storyboard.scenes.length > 0 &&
      storyboard.scenes.every(
        isStoryboardScene
      )
  );
}

function isStoryboardScene(
  value: unknown
): value is StoryboardScene {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const scene =
    value as Partial<StoryboardScene>;

  return Boolean(
    typeof scene.id === "string" &&
      typeof scene.sceneNumber ===
        "number" &&
      typeof scene.title === "string" &&
      typeof scene.location === "string" &&
      typeof scene.time === "string" &&
      typeof scene.shotType === "string" &&
      typeof scene.visualComposition ===
        "string" &&
      typeof scene.action === "string" &&
      typeof scene.dialogueOrSound ===
        "string" &&
      typeof scene.emotionalPurpose ===
        "string" &&
      typeof scene.cameraDirection ===
        "string" &&
      typeof scene.imagePrompt === "string"
  );
}

function isPitchDeckOutput(
  value: unknown
): value is PitchDeckOutputData {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const deck =
    value as Partial<PitchDeckOutputData>;

  return Boolean(
    deck.format === "pitch-deck" &&
      typeof deck.deckTitle === "string" &&
      typeof deck.deckSubtitle ===
        "string" &&
      Array.isArray(deck.slides) &&
      deck.slides.length > 0 &&
      deck.slides.every(isPitchDeckSlide)
  );
}

function isPitchDeckSlide(
  value: unknown
): value is PitchDeckSlide {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const slide =
    value as Partial<PitchDeckSlide>;

  return Boolean(
    typeof slide.id === "string" &&
      typeof slide.slideNumber ===
        "number" &&
      typeof slide.title === "string" &&
      typeof slide.headline === "string" &&
      Array.isArray(
        slide.supportingPoints
      ) &&
      slide.supportingPoints.every(
        (point) =>
          typeof point === "string"
      ) &&
      typeof slide.visualDirection ===
        "string" &&
      typeof slide.speakerNotes ===
        "string"
  );
}

function structuredOutputToText(
  output: StructuredProductionOutput
): string {
  if (output.format === "storyboard") {
    const scenes = output.scenes
      .map(
        (scene) => `SCENE ${scene.sceneNumber}: ${scene.title}

Location: ${scene.location}
Time: ${scene.time}
Shot: ${scene.shotType}

Visual composition:
${scene.visualComposition}

Action:
${scene.action}

Dialogue / sound:
${scene.dialogueOrSound}

Emotional purpose:
${scene.emotionalPurpose}

Camera direction:
${scene.cameraDirection}

Image prompt:
${scene.imagePrompt}`
      )
      .join("\n\n---\n\n");

    return `CINEMATIC STORYBOARD

Logline:
${output.logline}

Visual approach:
${output.visualApproach}

${scenes}`;
  }

  const slides = output.slides
    .map(
      (slide) => `SLIDE ${slide.slideNumber}: ${slide.title}

${slide.headline}

${slide.supportingPoints
  .map((point) => `- ${point}`)
  .join("\n")}

Visual direction:
${slide.visualDirection}

Speaker notes:
${slide.speakerNotes}`
    )
    .join("\n\n---\n\n");

  return `${output.deckTitle}

${output.deckSubtitle}

${slides}`;
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
): {
  content: string;
  structuredData?:
    | StructuredProductionOutput;
} {
  if (outputType === "storyboard") {
    const structuredData =
      createFallbackStoryboard(project);

    return {
      content:
        structuredOutputToText(
          structuredData
        ),
      structuredData,
    };
  }

  if (outputType === "pitch-deck") {
    const structuredData =
      createFallbackPitchDeck(project);

    return {
      content:
        structuredOutputToText(
          structuredData
        ),
      structuredData,
    };
  }

  const relevantSection =
    project.sections
      .map(
        (section) =>
          `${section.title}\n${section.text}`
      )
      .join("\n\n");

  return {
    content: `${getOutputTitle(outputType)}

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

This fallback deliverable preserves the current creative universe. Regenerate when IBM Granite is available for a more detailed production document.`,
  };
}

function createFallbackStoryboard(
  project: CreativeProject
): StoryboardOutputData {
  const sceneTitles = [
    "The Invitation",
    "First Contact",
    "The World Opens",
    "A New Pressure",
    "The Turning Point",
    "The Choice",
    "Transformation",
    "The Final Image",
  ];

  const scenes: StoryboardScene[] =
    sceneTitles.map((title, index) => ({
      id: `scene-${index + 1}`,
      sceneNumber: index + 1,
      title,
      location:
        index < 3
          ? "The project's central environment"
          : "An evolved version of the creative world",
      time:
        index < 4
          ? "Early progression"
          : "Climactic progression",
      shotType:
        index === 0
          ? "Wide establishing shot"
          : index === 7
            ? "Final hero shot"
            : "Cinematic medium shot",
      visualComposition: `${project.dna.mood} imagery using ${project.dna.colors.join(
        ", "
      )}, composed around the central idea of ${project.title}.`,
      action: `${project.idea} advances through narrative beat ${
        index + 1
      }, revealing a new dimension of the experience.`,
      dialogueOrSound:
        "Atmospheric sound design supports the emotional progression.",
      emotionalPurpose:
        index < 4
          ? "Build curiosity and emotional investment."
          : "Increase momentum and deliver transformation.",
      cameraDirection:
        "Controlled cinematic movement with deliberate framing.",
      imagePrompt: `${project.title}, scene ${
        index + 1
      }, ${project.dna.genre}, ${project.dna.tone}, ${project.dna.mood}, cinematic composition, palette of ${project.dna.colors.join(
        ", "
      )}.`,
    }));

  return {
    format: "storyboard",
    logline: project.idea,
    visualApproach: `${project.dna.tone} visual storytelling shaped by ${project.dna.mood} atmosphere and a palette of ${project.dna.colors.join(
      ", "
    )}.`,
    scenes,
  };
}

function createFallbackPitchDeck(
  project: CreativeProject
): PitchDeckOutputData {
  const slideDefinitions = [
    [
      project.title,
      "A new creative universe begins.",
    ],
    [
      "The Opportunity",
      `An opportunity designed for ${project.dna.audience}.`,
    ],
    [
      "The Core Concept",
      project.idea,
    ],
    [
      "Story and World",
      "A coherent narrative system with room to expand.",
    ],
    [
      "Audience",
      `Built specifically for ${project.dna.audience}.`,
    ],
    [
      "Differentiation",
      `${project.dna.genre} shaped by a ${project.dna.tone} identity.`,
    ],
    [
      "The Experience",
      "A production-ready expression of the creative universe.",
    ],
    [
      "Launch Strategy",
      "A focused path from prototype to audience.",
    ],
    [
      "Roadmap",
      "A phased approach to test, learn and scale.",
    ],
    [
      "The Vision",
      `Bring ${project.title} to life.`,
    ],
  ];

  const slides: PitchDeckSlide[] =
    slideDefinitions.map(
      ([title, headline], index) => ({
        id: `slide-${index + 1}`,
        slideNumber: index + 1,
        title,
        headline,
        supportingPoints: [
          project.sections[
            index %
              project.sections.length
          ]?.text ||
            project.idea,
          `Creative tone: ${project.dna.tone}`,
          `Audience focus: ${project.dna.audience}`,
        ],
        visualDirection: `Use ${project.dna.colors.join(
          ", "
        )} with a refined, cinematic presentation system.`,
        speakerNotes:
          "Connect this slide directly to the central project vision.",
      })
    );

  return {
    format: "pitch-deck",
    deckTitle: project.title,
    deckSubtitle: project.idea,
    slides,
  };
}