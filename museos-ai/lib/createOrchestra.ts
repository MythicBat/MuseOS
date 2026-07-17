import {
  AgentDebateMessage,
  CreativeOrchestra,
  CreativeProject,
  OrchestraStage,
} from "@/types/creative";

function findNodeIds(
  project: CreativeProject,
  keywords: string[]
): string[] {
  return project.nodes
    .filter((node) => {
      const searchable = `${node.title} ${node.subtitle ?? ""}`.toLowerCase();

      return keywords.some((keyword) =>
        searchable.includes(keyword.toLowerCase())
      );
    })
    .map((node) => node.id);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function createOrchestra(
  project: CreativeProject
): CreativeOrchestra {
  const narrativeNodeIds = unique(
    findNodeIds(project, [
      "story",
      "character",
      "narrative",
      "plot",
      "conflict",
      "theme",
    ])
  );

  const visualNodeIds = unique(
    findNodeIds(project, [
      "world",
      "visual",
      "style",
      "design",
      "environment",
      "colour",
      "color",
    ])
  );

  const productionNodeIds = unique(
    findNodeIds(project, [
      "production",
      "budget",
      "timeline",
      "direction",
      "format",
      "execution",
    ])
  );

  const marketingNodeIds = unique(
    findNodeIds(project, [
      "marketing",
      "audience",
      "campaign",
      "launch",
      "signature",
      "moment",
    ])
  );

  const assignedNodeIds = new Set([
    ...narrativeNodeIds,
    ...visualNodeIds,
    ...productionNodeIds,
    ...marketingNodeIds,
  ]);

  const remainingNodeIds = project.nodes
    .map((node) => node.id)
    .filter((id) => !assignedNodeIds.has(id));

  const stages: OrchestraStage[] = [
    {
      id: "initialising",
      type: "initializing",
      label: "MuseOS is waking up",
      description: "Connecting the creative intelligence layer.",
      nodeIds: [],
      duration: 900,
    },
    {
      id: "narrative",
      type: "narrative",
      label: "Writer is shaping the narrative",
      description: "Discovering the emotional arc, characters and conflict.",
      agentId: "writer",
      nodeIds: narrativeNodeIds,
      duration: 1800,
    },
    {
      id: "visual-direction",
      type: "visual-direction",
      label: "Art Director is designing the world",
      description: "Defining visual language, atmosphere and identity.",
      agentId: "art-director",
      nodeIds: visualNodeIds,
      duration: 1800,
    },
    {
      id: "production",
      type: "production",
      label: "Producer is testing feasibility",
      description: "Balancing ambition, resources and execution.",
      agentId: "producer",
      nodeIds: productionNodeIds,
      duration: 1700,
    },
    {
      id: "marketing",
      type: "marketing",
      label: "Marketing is finding the audience",
      description: "Creating positioning, campaign hooks and launch moments.",
      agentId: "marketing-strategist",
      nodeIds: marketingNodeIds,
      duration: 1700,
    },
    {
      id: "debate",
      type: "debate",
      label: "The agents are challenging each other",
      description: "Resolving creative tension across story, design and scale.",
      nodeIds: [],
      duration: 2400,
    },
    {
      id: "synthesis",
      type: "synthesis",
      label: "MuseOS is synthesising the universe",
      description: "Connecting every creative decision into one system.",
      nodeIds: remainingNodeIds,
      duration: 1600,
    },
    {
      id: "complete",
      type: "complete",
      label: "Creative universe complete",
      description: "The project is ready to explore and refine.",
      nodeIds: [],
      duration: 500,
    },
  ];

  const debate: AgentDebateMessage[] = createDebate(project);

  return {
    status: "idle",
    currentStageIndex: 0,
    stages,
    activities: [],
    debate,
  };
}

function createDebate(
  project: CreativeProject
): AgentDebateMessage[] {
  const title = project.title || "this universe";
  const now = Date.now();

  return [
    {
      id: "debate-writer-1",
      agentId: "writer",
      content: `The emotional transformation in ${title} should remain the centre of every creative decision.`,
      stance: "proposal",
      timestamp: now,
    },
    {
      id: "debate-art-1",
      agentId: "art-director",
      content:
        "I support the emotional direction, but the visual contrast needs to communicate that transformation before dialogue does.",
      replyToId: "debate-writer-1",
      stance: "support",
      timestamp: now + 1,
    },
    {
      id: "debate-producer-1",
      agentId: "producer",
      content:
        "The concept is strong, but the visual scope should focus on a few signature environments rather than too many locations.",
      replyToId: "debate-art-1",
      stance: "challenge",
      timestamp: now + 2,
    },
    {
      id: "debate-marketing-1",
      agentId: "marketing-strategist",
      content:
        "A concentrated visual identity also creates a clearer campaign. We need one moment audiences can recognise instantly.",
      replyToId: "debate-producer-1",
      stance: "support",
      timestamp: now + 3,
    },
    {
      id: "debate-resolution-1",
      agentId: "writer",
      content:
        "Resolved: preserve the emotional ambition, focus production on signature environments, and build the campaign around one unforgettable transformation.",
      replyToId: "debate-marketing-1",
      stance: "resolution",
      timestamp: now + 4,
    },
  ];
}