import {
  Agent,
  CanvasEdge,
  CanvasNode,
  CreativeProject,
  DNA,
  Outputs,
  Section,
} from "@/types/creative";

const VALID_NODE_TYPES = new Set<CanvasNode["type"]>([
  "core",
  "story",
  "character",
  "visual",
  "marketing",
  "world",
  "music",
]);

const VALID_AGENT_STATUSES = new Set<NonNullable<Agent["status"]>>([
  "thinking",
  "complete",
  "waiting",
]);

export function parseCreativeProject(
  modelOutput: string,
  originalIdea: string
): CreativeProject {
  const parsed: unknown = JSON.parse(extractJson(modelOutput));

  if (!isRecord(parsed)) {
    throw new Error("Granite response is not a JSON object.");
  }

  const title = requireString(parsed.title, "title");
  const dna = parseDNA(parsed.dna);
  const sections = parseSections(parsed.sections);
  const agents = parseAgents(parsed.agents);
  const outputs = parseOutputs(parsed.outputs);
  const nodes = parseNodes(parsed.nodes);
  const edges = parseEdges(parsed.edges, nodes);

  return {
    title,
    idea: originalIdea,
    dna,
    sections,
    agents,
    outputs,
    nodes,
    edges,
  };
}

function extractJson(value: string): string {
  const cleaned = value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object was found in the Granite response.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function parseDNA(value: unknown): DNA {
  if (!isRecord(value)) {
    throw new Error("Invalid Creative DNA.");
  }

  return {
    genre: requireString(value.genre, "dna.genre"),
    tone: requireString(value.tone, "dna.tone"),
    audience: requireString(value.audience, "dna.audience"),
    mood: requireString(value.mood, "dna.mood"),
    colors: requireStringArray(value.colors, "dna.colors", 3),
  };
}

function parseSections(value: unknown): Section[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Invalid sections.");
  }

  return value.map((section, index) => {
    if (!isRecord(section)) {
      throw new Error(`Invalid section at index ${index}.`);
    }

    return {
      title: requireString(section.title, `sections[${index}].title`),
      text: requireString(section.text, `sections[${index}].text`),
    };
  });
}

function parseAgents(value: unknown): Agent[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Invalid agents.");
  }

  return value.map((agent, index) => {
    if (!isRecord(agent)) {
      throw new Error(`Invalid agent at index ${index}.`);
    }

    const rawStatus = agent.status;
    const status =
      typeof rawStatus === "string" &&
      VALID_AGENT_STATUSES.has(rawStatus as NonNullable<Agent["status"]>)
        ? (rawStatus as NonNullable<Agent["status"]>)
        : "complete";

    return {
      role: requireString(agent.role, `agents[${index}].role`),
      message: requireString(agent.message, `agents[${index}].message`),
      status,
    };
  });
}

function parseOutputs(value: unknown): Outputs {
  if (!isRecord(value)) {
    throw new Error("Invalid outputs.");
  }

  return {
    pitchSummary: requireString(
      value.pitchSummary,
      "outputs.pitchSummary"
    ),
    storyboard: requireString(value.storyboard, "outputs.storyboard"),
    socialCampaign: requireString(
      value.socialCampaign,
      "outputs.socialCampaign"
    ),
    projectBrief: requireString(
      value.projectBrief,
      "outputs.projectBrief"
    ),
  };
}

function parseNodes(value: unknown): CanvasNode[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Invalid canvas nodes.");
  }

  const nodes = value.map((node, index): CanvasNode => {
    if (!isRecord(node)) {
      throw new Error(`Invalid node at index ${index}.`);
    }

    const type = requireString(node.type, `nodes[${index}].type`);

    if (!VALID_NODE_TYPES.has(type as CanvasNode["type"])) {
      throw new Error(`Unsupported node type: ${type}`);
    }

    return {
      id: requireString(node.id, `nodes[${index}].id`),
      title: requireString(node.title, `nodes[${index}].title`),
      subtitle: requireString(node.subtitle, `nodes[${index}].subtitle`),
      type: type as CanvasNode["type"],
      x: clamp(requireNumber(node.x, `nodes[${index}].x`), 10, 90),
      y: clamp(requireNumber(node.y, `nodes[${index}].y`), 14, 88),
    };
  });

  const ids = new Set<string>();

  for (const node of nodes) {
    if (ids.has(node.id)) {
      throw new Error(`Duplicate node ID: ${node.id}`);
    }

    ids.add(node.id);
  }

  if (!ids.has("core")) {
    throw new Error('Canvas must contain a node with ID "core".');
  }

  return nodes;
}

function parseEdges(value: unknown, nodes: CanvasNode[]): CanvasEdge[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid canvas edges.");
  }

  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeKeys = new Set<string>();

  return value.map((edge, index) => {
    if (!isRecord(edge)) {
      throw new Error(`Invalid edge at index ${index}.`);
    }

    const from = requireString(edge.from, `edges[${index}].from`);
    const to = requireString(edge.to, `edges[${index}].to`);

    if (!nodeIds.has(from) || !nodeIds.has(to)) {
      throw new Error(`Edge references an unknown node: ${from} → ${to}`);
    }

    const key = `${from}-${to}`;

    if (edgeKeys.has(key)) {
      throw new Error(`Duplicate edge: ${key}`);
    }

    edgeKeys.add(key);

    return { from, to };
  });
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Expected a non-empty string for ${field}.`);
  }

  return value.trim();
}

function requireStringArray(
  value: unknown,
  field: string,
  minimumLength = 1
): string[] {
  if (
    !Array.isArray(value) ||
    value.length < minimumLength ||
    !value.every((item) => typeof item === "string" && item.trim())
  ) {
    throw new Error(`Expected a string array for ${field}.`);
  }

  return value.map((item) => item.trim());
}

function requireNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected a number for ${field}.`);
  }

  return value;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}