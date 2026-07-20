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

  approved?: boolean;
  note?: string;
}

export interface CreativeBranch {
  id: string;
  name: string;
  createdAt: number;
  parentBranchId?: string;
  originVersionId: string;
  headVersionId: string;
}

export interface DNADifference {
  field: keyof DNA;
  before: string | string[];
  after: string | string[];
}

export interface CreativeVersionComparison {
  fromVersion: CreativeVersion;
  toVersion: CreativeVersion;
  dnaDifferences: DNADifference[];
  addedNodes: CanvasNode[];
  removedNodes: CanvasNode[];
  changedNodes: Array<{
    before: CanvasNode;
    after:CanvasNode;
  }>;
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

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  title: string;
  location: string;
  time: string;
  shotType: string;
  visualComposition: string;
  action: string;
  dialogueOrSound: string;
  emotionalPurpose: string;
  cameraDirection: string;
  imagePrompt: string;
}

export interface StoryboardOutputData {
  format: "storyboard";
  logline: string;
  visualApproach: string;
  scenes: StoryboardScene[];
}

export interface PitchDeckSlide {
  id: string;
  slideNumber: number;
  title: string;
  headline: string;
  supportingPoints: string[];
  visualDirection: string;
  speakerNotes: string;
}

export interface PitchDeckOutputData {
  format: "pitch-deck";
  deckTitle: string;
  deckSubtitle: string;
  slides: PitchDeckSlide[];
}

export type StructuredProductionOutput = 
  | StoryboardOutputData
  | PitchDeckOutputData;

export type ProductionOutputType =
  | "pitch-deck"
  | "storyboard"
  | "creative-bible"
  | "production-plan"
  | "marketing-plan"
  | "investor-brief"
  | "social-campaign"
  | "project-brief";

export interface GeneratedProductionOutput {
  id: string;
  type: ProductionOutputType;
  title: string;
  content: string;
  structuredData?: StructuredProductionOutput;
  generatedAt: number;
  provider: "watsonx" | "fallback";
  projectTitle: string;
  versionId?: string;
  versionLabel?: string;
  branchName?: string;
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