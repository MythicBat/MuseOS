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