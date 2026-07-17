import { NextResponse } from "next/server";

interface CommandRequest {
  command?: unknown;
  projectTitle?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CommandRequest;

    const command =
      typeof body.command === "string"
        ? body.command.trim()
        : "";

    const projectTitle =
      typeof body.projectTitle === "string"
        ? body.projectTitle.trim()
        : undefined;

    if (!command) {
      return NextResponse.json(
        { error: "Command is required." },
        { status: 400 }
      );
    }

    const response = createCommandResponse(
      command,
      projectTitle
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Creative command failed:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

function createCommandResponse(
  command: string,
  projectTitle?: string
) {
  return {
    title: createCommandTitle(command),

    subtitle: `MuseOS refined ${
      projectTitle || "this universe"
    } using your command: "${command}".`,

    dnaPatch: createDNAPatch(command),
  };
}

function createCommandTitle(command: string) {
  const trimmed = command.trim();

  if (trimmed.length <= 32) {
    return trimmed;
  }

  return `${trimmed.slice(0, 32)}...`;
}

function createDNAPatch(command: string) {
  const normalized = command.toLowerCase();

  const patch: {
    genre?: string;
    tone?: string;
    audience?: string;
    mood?: string;
    colors?: string[];
  } = {};

  if (
    normalized.includes("dark") ||
    normalized.includes("darker") ||
    normalized.includes("horror")
  ) {
    patch.tone = "Dark, emotionally intense and cinematic";
    patch.mood = "Mysterious, tense and atmospheric";
    patch.colors = [
      "Midnight Violet",
      "Obsidian",
      "Crimson",
      "Cold Silver",
    ];
  }

  if (
    normalized.includes("funny") ||
    normalized.includes("comedy") ||
    normalized.includes("lighter")
  ) {
    patch.tone = "Playful, energetic and humorous";
    patch.mood = "Joyful, warm and optimistic";
    patch.colors = [
      "Sunshine Yellow",
      "Coral",
      "Sky Blue",
      "Mint",
    ];
  }

  if (
    normalized.includes("teen") ||
    normalized.includes("teenager")
  ) {
    patch.audience = "Teen and young adult audiences";
    patch.tone =
      patch.tone ||
      "Contemporary, emotionally honest and energetic";
  }

  if (
    normalized.includes("adult") ||
    normalized.includes("mature")
  ) {
    patch.audience = "Adult and mature audiences";
    patch.tone =
      patch.tone ||
      "Sophisticated, layered and emotionally complex";
  }

  if (
    normalized.includes("child") ||
    normalized.includes("family") ||
    normalized.includes("kids")
  ) {
    patch.audience = "Children and family audiences";
    patch.tone =
      patch.tone ||
      "Warm, accessible and imaginative";
  }

  if (
    normalized.includes("musical") ||
    normalized.includes("music") ||
    normalized.includes("song")
  ) {
    patch.genre = "Musical adventure";
    patch.mood =
      patch.mood ||
      "Rhythmic, uplifting and expressive";
  }

  if (
    normalized.includes("sci-fi") ||
    normalized.includes("science fiction") ||
    normalized.includes("futuristic")
  ) {
    patch.genre = "Science-fiction";
    patch.colors =
      patch.colors || [
        "Electric Blue",
        "Neon Violet",
        "Chrome",
        "Deep Space",
      ];
  }

  if (
    normalized.includes("fantasy") ||
    normalized.includes("magical")
  ) {
    patch.genre = "Fantasy adventure";
    patch.mood =
      patch.mood ||
      "Magical, wondrous and dreamlike";
  }

  return patch;
}