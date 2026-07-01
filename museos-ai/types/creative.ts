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
}

export interface Outputs {
  pitchSummary: string;
  storyboard: string;
  socialCampaign: string;
  projectBrief: string;
}

export interface CreativeProject {
  title: string;
  idea: string;
  dna: DNA;
  sections: Section[];
  agents: Agent[];
  outputs: Outputs;
}