import { CreativeProject } from "@/types/creative";

export interface GeneratedProjectResult {
  project: CreativeProject;
  provider: "watsonx" | "fallback";
}

export interface CreativeCommandResult {
  title: string;
  subtitle: string;
}

export async function generateProject(
  idea: string
): Promise<GeneratedProjectResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(body?.error || "Failed to generate project.");
  }

  const project = (await response.json()) as CreativeProject;

  const provider =
    response.headers.get("X-MuseOS-Provider") === "fallback"
      ? "fallback"
      : "watsonx";

  return {
    project,
    provider,
  };
}

export async function runCreativeCommand({
  command,
  projectTitle,
} : {
  command: string;
  projectTitle: string;
}) : Promise<CreativeCommandResult> {
  const response = await fetch("/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command,
      projectTitle,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      |null;

    throw new Error(body?.error || "Failed to run creative command.");
  }

  return (await response.json()) as CreativeCommandResult;
}