"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_SETTINGS, type MuseSettings, } from "@/types/settings";

const STORAGE_KEY = "museos-settings-v1";

function loadSettings(): MuseSettings {
    if (typeof window === "undefined") { return DEFAULT_SETTINGS; }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (!stored) { return DEFAULT_SETTINGS; }

        const parsed = JSON.parse(stored) as Partial<MuseSettings>;

        return {
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
    } catch { return DEFAULT_SETTINGS; }
}

export function useMuseSettings() {
    const [settings, setSettings] = useState<MuseSettings>(loadSettings);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSettings = useCallback(
        <Section extends keyof MuseSettings>(section: Section, updates: Partial<MuseSettings[Section]>) => {
            setSettings((current) => ({
                ...current,

                [section]: {
                    ...current[section],
                    ...updates,
                },
            }));
        },
        []
    );

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
    }, []);

    return {
        settings,
        updateSettings,
        resetSettings,
    };
}