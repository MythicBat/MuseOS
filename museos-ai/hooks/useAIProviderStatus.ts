"use client";

import {
    useCallback,
    useEffect,
    useState,
    useMemo,
} from "react";

import type { AIProvider } from "@/types/settings";
import type { AIProviderStatus, AIProviderStatusResponse } from "@/types/aiProviderStatus";

interface UseAIProviderStatusResult {
    providers: AIProviderStatus[];
    loading: boolean;
    error: string | null;
    checkedAt: number | null;

    refresh: () => Promise<void>;
    getProviderStatus: (providerId: AIProvider) => AIProviderStatus | null;
}

export function useAIProviderStatus(): UseAIProviderStatusResult {
    const [providers, setProviders] = useState<AIProviderStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkedAt, setCheckedAt] = useState<number | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/ai/providers", {
                method: "GET",
                cache: "no-store",
            });

            const body = (await response.json().catch(() => null)) as 
                | AIProviderStatusResponse
                | {error?: string;}
                | null;
            
            if (!response.ok || !body || !("providers" in body)) {
                throw new Error(
                    body && "error" in body && typeof body.error === "string" ? body.error : "Unable to load AI provider status."
                );
            }

            setProviders(body.providers);
            setCheckedAt(body.checkedAt);
        } catch (statusError) {
            const message = statusError instanceof Error ? statusError.message : "Unable to load AI provider status.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const id = setTimeout(() => {
            void refresh();
        }, 0);

        return () => clearTimeout(id);
    }, [refresh]);

    const providerMap = useMemo(() => new Map(
        providers.map((provider) => [
            provider.id,
            provider,
        ])
    ), [providers]);

    const getProviderStatus = useCallback((providerId: AIProvider) => 
        providerMap.get(providerId) ?? null, [providerMap]);

    return {
        providers,
        loading,
        error,
        checkedAt,
        refresh,
        getProviderStatus,
    };
}