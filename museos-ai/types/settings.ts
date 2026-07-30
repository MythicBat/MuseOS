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

export interface MuseSettings {
  appearance: {
    theme: MuseTheme;
    accent: MuseAccent;
    glassIntensity: GlassIntensity;
    reduceMotion: boolean;
  };

  ai: {
    provider: "granite";
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