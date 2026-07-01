import { NextResponse } from "next/server";
import { CreativeProject } from "@/types/creative";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const project = generateCreativeUniverse(idea);

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function generateCreativeUniverse(idea: string): CreativeProject {
  return {
    title: createTitle(idea),
    idea,
    dna: {
      genre: "Cinematic Creative Concept",
      tone: "Emotional, imaginative, polished",
      audience: "Creators, students, storytellers, designers",
      mood: "Premium, inspiring, future-facing",
      colors: ["Midnight", "Pearl", "Electric Blue"],
    },
    sections: [
      {
        title: "Story",
        text: `This concept begins with: "${idea}". MuseOS expands it into a story-driven experience with a clear emotional hook, strong world-building, and a memorable creative direction.`,
      },
      {
        title: "Characters",
        text: "The main characters should represent contrasting emotional forces: curiosity, fear, ambition, and transformation.",
      },
      {
        title: "Visual Style",
        text: "The visual language should feel cinematic, minimal, elegant, and emotionally expressive, with strong contrast and atmospheric lighting.",
      },
      {
        title: "Marketing",
        text: "The strongest positioning is to frame this as a highly shareable creative experience that helps people turn imagination into finished outputs.",
      },
    ],
    agents: [
      {
        role: "Writer",
        status: "complete" as const,
        message:
          "The story needs a clear emotional turning point where the idea becomes personal, not just visually interesting.",
      },
      {
        role: "Art Director",
        status: "complete" as const,
        message:
          "The world should have one instantly recognizable visual signature so the project feels memorable.",
      },
      {
        role: "Producer",
        status: "thinking" as const,
        message:
          "For a prototype, keep the scope focused: one strong concept, one hero moment, and one beautiful final export.",
      },
      {
        role: "Marketing Strategist",
        status: "waiting" as const,
        message:
          "The pitch should focus on speed, creative empowerment, and helping anyone move from idea to execution.",
      },
    ],
    outputs: {
      pitchSummary: `MuseOS transforms "${idea}" into a complete creative direction with story, characters, visual identity, audience strategy, and launch-ready outputs.`,
      storyboard:
        "Scene 1: The idea is introduced. Scene 2: Conflict appears. Scene 3: The creative world expands. Scene 4: The emotional payoff lands.",
      socialCampaign:
        "Launch hook: What if one idea could become an entire creative universe in seconds?",
      projectBrief:
        "A polished AI-assisted creative project designed to help users move from inspiration to execution through structured creative collaboration.",
    },

    nodes: [
      {
        id: "core",
        title: createTitle(idea),
        subtitle: "The central creative spark.",
        type: "core",
        x: 50,
        y: 50,
      },
      {
        id: "story",
        title: "Story",
        subtitle: "Emotional arc, conflict, and transformation.",
        type: "story",
        x: 50,
        y: 18,
      },
      {
        id: "characters",
        title: "Characters",
        subtitle: "People, personalities, and relationships.",
        type: "character",
        x: 22,
        y: 40,
      },
      {
        id: "world",
        title: "World",
        subtitle: "Setting, rules, atmosphere, and lore.",
        type: "world",
        x: 78,
        y: 40,
      },
      {
        id: "visual",
        title: "Visual Style",
        subtitle: "Color, mood, composition, and design language.",
        type: "visual",
        x: 28,
        y: 75,
      },
      {
        id: "marketing",
        title: "Marketing",
        subtitle: "Audience, positioning, and launch hook.",
        type: "marketing",
        x: 72,
        y: 75,
      },
    ],
    edges: [
      { from: "core", to: "story" },
      { from: "core", to: "characters" },
      { from: "core", to: "world" },
      { from: "core", to: "visual" },
      { from: "core", to: "marketing" },
    ],
  };
}

function createTitle(idea: string) {
  const cleaned = idea.trim().replace(/[^\w\s]/g, "");
  const words = cleaned.split(/\s+/).slice(0, 4);

  if (words.length === 0) return "Untitled Creative Universe";

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}