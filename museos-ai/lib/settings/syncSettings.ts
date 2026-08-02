import type { MuseSettings } from "@/types/settings";

export async function syncSettingsToServer(settings: MuseSettings): Promise<void> {
    const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as | {
            error?: string;
        } | null;

        throw new Error(body?.error ?? "Unable to synchronize settings.");
    }
}