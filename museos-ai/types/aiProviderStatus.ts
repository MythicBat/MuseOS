import type { AIProvider } from "@/types/settings";

export type AIProviderConnectionStatus = 
    | "connected"
    | "not-configured"
    | "unavailable";

export interface AIProviderStatus {
    id: AIProvider;
    label: string;
    model: string;
    status: AIProviderConnectionStatus;
    configured: boolean;
    supportsStreaming: boolean;
    message?: string;
}

export interface AIProviderStatusResponse {
    providers: AIProviderStatus[];
    checkedAt: number;
}