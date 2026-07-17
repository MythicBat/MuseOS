export type AgentRole = 
  | "writer"
  | "art-director"
  | "producer"
  | "marketing-strategist";

export type AgentActivityStatus = 
  | "waiting"
  | "thinking"
  | "speaking"
  | "complete"
  | "error"

export type OrchestraStageType = 
  | "initializing"
  | "narrative"
  | "visual-direction"
  | "production"
  | "marketing"
  | "debate"
  | "synthesis"
  | "complete"

export interface AgentActivity {
  id: string;
  agentId: AgentRole;
  status: AgentActivityStatus;
  message: string;
  timestamp: number;
  relatedNodeIds?: string[];
}

export interface AgentDebateMessage {
  id: string;
  agentId: AgentRole;
  content: string;
  replyToId?: string;
  stance?: "proposal" | "support" | "challenge" | "resolution";
  timestamp: number;
}

export interface OrchestraStage {
  id: string;
  type: OrchestraStageType;
  label: string;
  description: string;
  agentId?: AgentRole;
  nodeIds: string[];
  duration: number;
}

export interface CreativeOrchestra {
  status: "idle" | "running" | "complete" | "error";
  currentStageIndex: number;
  stages: OrchestraStage[];
  activities: AgentActivity[];
  debate: AgentDebateMessage[];
}

export type CreativeVersionSource = 
  | "generation"
  | "command"
  | "node-expansion"
  | "restore";

export interface CreativeVersion {
  id: string;
  label: string;
  description: string;
  createdAt: number;
  source: CreativeVersionSource;
  command?: string;
  parentVersionId?: string;
  branchId: string;
  project: CreativeProject;
}

export interface CreativeBranch {
  id: string;
  name: string;
  createdAt: number;
  parentBranchId?: string;
  originVersionId: string;
  headVersionId: string;
}

export interface DNA {
  genre: string;
  tone: string;
  audience: string;
  mood: string;
  colors: string[];
}

export interface Section {
  title: string;
  text: string;
}

export interface Agent {
  role: string;
  message: string;
  status?: "thinking" | "complete" | "waiting";
}

export interface Outputs {
  pitchSummary: string;
  storyboard: string;
  socialCampaign: string;
  projectBrief: string;
}

export interface CanvasNode {
  id: string;
  title: string;
  subtitle: string;
  type: "core" | "story" | "character" | "visual" | "marketing" | "world" | "music";
  x: number;
  y: number;
}

export interface CanvasEdge {
  from: string;
  to: string;
}

export interface CreativeProject {
  title: string;
  idea: string;
  dna: DNA;
  sections: Section[];
  agents: Agent[];
  outputs: Outputs;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}