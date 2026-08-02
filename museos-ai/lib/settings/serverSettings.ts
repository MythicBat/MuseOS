import { cookies } from "next/headers";

import { DEFAULT_SETTINGS, type MuseSettings } from "@/types/settings";

const SETTINGS_COOKIE = "muse-settings";

export async function getServerSettings(): Promise<MuseSettings> {
    try {
        const cookieStore = await cookies();

        const raw = cookieStore.get(SETTINGS_COOKIE)?.value;

        if (!raw) { return DEFAULT_SETTINGS; }

        const parsed: unknown = JSON.parse(decodeURIComponent(raw));
        
        return mergeServerSettings(parsed);
    } catch (error) {
        console.error("Unable to load server settings.", error);

        return DEFAULT_SETTINGS;
    }
}

function mergeServerSettings(value: unknown): MuseSettings {
    if (!value || typeof value !== "object") { return DEFAULT_SETTINGS; }

    const candidate = value as Partial<MuseSettings>;

    return {
        appearance: {
            ...DEFAULT_SETTINGS.appearance,
            ...candidate.appearance,
        },
        ai: {
            ...DEFAULT_SETTINGS.ai,
            ...candidate.ai,
        },
        generation: {
            ...DEFAULT_SETTINGS.generation,
            ...candidate.generation,
        },
        export: {
            ...DEFAULT_SETTINGS.export,
            ...candidate.export,
        },
        workspace: {
            ...DEFAULT_SETTINGS.workspace,
            ...candidate.workspace,
        },
    };
}