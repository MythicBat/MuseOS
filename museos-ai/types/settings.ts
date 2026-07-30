export type SettingsSection = 
    | "appearance"
    | "ai"
    | "generation"
    | "export"
    | "workspace"
    | "about";

export interface MuseSettings {
    appearance: { theme: "dark"; };
    ai: { provider: "granite"; };
    generation: { autoSave: true; };
    export: { defaultFormat: "pdf"; }
    workspace: { showParticles: true; };
}

export const DEFAULT_SETTINGS: MuseSettings = {
    appearance: { theme: "dark", },
    ai: { provider: "granite", },
    generation: { autoSave: true, },
    export: { defaultFormat: "pdf", },
    workspace: { showParticles: true, },
};