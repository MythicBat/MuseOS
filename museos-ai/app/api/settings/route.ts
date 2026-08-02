import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { DEFAULT_SETTINGS, type MuseSettings } from "@/types/settings";

const SETTINGS_COOKIE = "muse-settings";

const MAX_COOKIE_AGE = 60 * 60 * 24 * 365;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get(SETTINGS_COOKIE)?.value;

        if (!raw) {
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        const parsed: unknown = JSON.parse(decodeURIComponent(raw));
        const settings = mergeSettings(parsed);

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Unable to read MuseOS settings.", error);

        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const settings = mergeSettings(body);

        const response = NextResponse.json({
            success: true,
            settings,
        });

        response.cookies.set({
            name: SETTINGS_COOKIE,
            value: encodeURIComponent(JSON.stringify(settings)),
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: MAX_COOKIE_AGE,
        });

        return response;
    } catch (error) {
        console.error("Unable to save MuseOS settings.", error);

        return NextResponse.json(
            {error: "Unable to save settings."},
            {status: 400},
        );
    }
}

function mergeSettings(value: unknown): MuseSettings {
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