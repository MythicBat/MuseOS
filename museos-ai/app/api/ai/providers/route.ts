import { NextResponse } from "next/server";
import { getAIProviderStatuses } from "@/lib/ai/providerStatus";
import type { AIProviderStatusResponse } from "@/types/aiProviderStatus";

export async function GET() {
    try {
        const response: AIProviderStatusResponse = {
            providers: getAIProviderStatuses(),
            checkedAt: Date.now(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Unable to inspect AI providers:", error);

        return NextResponse.json(
            {error: "Unable to inspect AI providers."},
            {status: 500}
        );
    }
}