import { cookies } from "next/headers";

import { DEFAULT_SETTINGS, type MuseSettings } from "@/types/settings";

const SETTINGS_COOKIE = "muse-settings";

export async function getServerSettings(): Promise<MuseSettings> {
    try {
        const cookieStore = await cookies();

        const raw = cookieStore.get(SETTINGS_COOKIE)?.value;

        if (!raw) { return DEFAULT_SETTINGS; }

        const parsed = JSON.parse(raw);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,

            appearance: {
                ...DEFAULT_SETTINGS.appearance,
                ...parsed.appearance,
            },
            ai: {
                ...DEFAULT_SETTINGS.ai,
                ...parsed.ai,
            },
            generation: {
                ...DEFAULT_SETTINGS.generation,
                ...parsed.generation,
            },
            export: {
                ...DEFAULT_SETTINGS.export,
                ...parsed.export,
            },
            workspace: {
                ...DEFAULT_SETTINGS.workspace,
                ...parsed.workspace,
            },
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}