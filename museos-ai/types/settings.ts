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

export type GenerationMode = 
  | "balanced"
  | "fast"
  | "quality";

export type ExportFormat = 
  | "pdf"
  | "pptx"
  | "markdown"
  | "docx";

export type ExportQuality = 
  | "standard"
  | "high";

export type PdfPageSize = 
  | "A4"
  | "Letter";

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
    autoVersioning: boolean;
    autoTitles: boolean;
    saveToHistory: boolean;
    confirmBeforeReplace: boolean;
    defaultMode: GenerationMode;
  };

  export: {
    defaultFormat: ExportFormat;
    pdfPageSize: PdfPageSize;
    quality: ExportQuality;
    includeBranding: boolean;
    includeMetadata: boolean;
    compressImages: boolean;
    openAfterExport: boolean;
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
    autoVersioning: true,
    autoTitles: true,
    saveToHistory: true,
    confirmBeforeReplace: true,
    defaultMode: "balanced",
  },

  export: {
    defaultFormat: "pdf",
    pdfPageSize: "A4",
    quality: "high",
    includeBranding: true,
    includeMetadata: true,
    compressImages: true,
    openAfterExport: true,
  },

  workspace: {
    showParticles: true,
  },
};