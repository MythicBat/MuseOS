import { CreativeProject } from "@/types/creative";

export async function generateProject(
  idea: string
): Promise<CreativeProject> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate project");
  }

  return response.json();
}

export async function runCreativeCommand({
  command,
  projectTitle,
}: {
  command: string;
  projectTitle: string;
}) : Promise<{ title: string; subtitle: string }> {
  const response = await fetch("/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command, projectTitle }),
  });

  if (!response.ok) {
    throw new Error("Failed to run creative command.");
  }

  return response.json();
}