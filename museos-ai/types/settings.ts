export type SettingsSection = 
  | "appearance"
  | "ai"
  | "generation"
  | "export"
  | "workspace"
  | "about";

export type MuseTheme =
  | "dark"
  | "midnight"
  | "system";

export type MuseAccent =
  | "violet"
  | "blue"
  | "emerald"
  | "rose"
  | "amber";

export type GlassIntensity =
  | "low"
  | "medium"
  | "high";

export type AIProvider = 
  | "granite"
  | "openai"
  | "ollama"
  | "gemini"
  | "claude";

export interface MuseSettings {
  appearance: {
    theme: MuseTheme;
    accent: MuseAccent;
    glassIntensity: GlassIntensity;
    reduceMotion: boolean;
  };

  ai: {
    provider: AIProvider;
    creativity: number;
    temperature: number;
    maxTokens: number;
    streaming: boolean;
  };

  generation: {
    autoSave: boolean;
  };

  export: {
    defaultFormat: "pdf";
  };

  workspace: {
    showParticles: boolean;
  };
}

export const DEFAULT_SETTINGS: MuseSettings = {
  appearance: {
    theme: "dark",
    accent: "violet",
    glassIntensity: "medium",
    reduceMotion: false,
  },

  ai: {
    provider: "granite",
    creativity: 70,
    temperature: 0.7,
    maxTokens: 4096,
    streaming: true,
  },

  generation: {
    autoSave: true,
  },

  export: {
    defaultFormat: "pdf",
  },

  workspace: {
    showParticles: true,
  },
};