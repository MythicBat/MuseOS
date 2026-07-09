import { CreativeProject } from "@/types/creative";

export function createFallbackProject(idea: string): CreativeProject {
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
        text: `MuseOS expands "${idea}" into a story-driven experience with emotional depth, visual identity, and a clear creative direction.`,
      },
      {
        title: "Characters",
        text: "Characters should represent curiosity, transformation, tension, and emotional growth.",
      },
      {
        title: "Visual Style",
        text: "The world should feel cinematic, elegant, atmospheric, and instantly recognizable.",
      },
      {
        title: "Marketing",
        text: "Position this as a memorable creative concept that turns imagination into execution.",
      },
    ],
    agents: [
      {
        role: "Writer",
        status: "complete",
        message:
          "The strongest version needs a clear emotional turning point.",
      },
      {
        role: "Art Director",
        status: "complete",
        message:
          "Give the world one visual signature people remember instantly.",
      },
      {
        role: "Producer",
        status: "complete",
        message:
          "Keep the prototype focused around one hero moment and one polished output.",
      },
      {
        role: "Marketing Strategist",
        status: "complete",
        message:
          "The pitch should focus on creative empowerment and speed.",
      },
    ],
    outputs: {
      pitchSummary: `MuseOS transforms "${idea}" into a complete creative universe with story, design, audience, strategy, and production-ready outputs.`,
      storyboard:
        "Scene 1: Introduce the idea.\nScene 2: Reveal conflict.\nScene 3: Expand the world.\nScene 4: Deliver the emotional payoff.",
      socialCampaign:
        "Hook: What if one idea could become an entire creative universe in seconds?",
      projectBrief:
        "A polished AI-assisted creative project that helps users move from inspiration to execution through structured creative collaboration.",
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