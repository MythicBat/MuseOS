import { NextResponse } from "next/server";
import { title } from "process";

export async function POST(req: Request) {
    try {
        const { command, projectTitle } = await req.json();

        if (!command || typeof command != "string") {
            return NextResponse.json(
                { error: "Command is required" },
                { status: 400 }
            );
        }

        const response = createCommandResponse(command, projectTitle);

        return NextResponse.json(response);
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

function createCommandResponse(command: string, projectTitle?: string) {
    return {
        title: createCommandTitle(command),
        subtitle: `MuseOS refined ${
            projectTitle || "this universe"
        } using your command: "${command}".`,
    };
}

function createCommandTitle(command: string) {
    const trimmed = command.trim();

    if (trimmed.length <= 32) return trimmed;

    return `${trimmed.slice(0, 32)}...`;
}