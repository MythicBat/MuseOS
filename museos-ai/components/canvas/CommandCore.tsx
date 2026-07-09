"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface CommandCoreProps {
    onCommand: (command: string) => void | Promise<void>;
}

export default function CommandCore({ onCommand }: CommandCoreProps) {
    const [command, setCommand] = useState("");

    const submitCommand = () => {
        if (!command.trim()) return;

        onCommand(command);
        setCommand("");
    };

    return (
        <div className="absolute left-1/2 top-5 z-20 w-[90%] max-w-2xl -translate-x-1/2 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Sparkles className="h-5 w-5" />
                </div>

                <input
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            submitCommand();
                        }
                    }}
                    placeholder="Ask MuseOS to refine this universe..."
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />

                <button
                    onClick={submitCommand}
                    className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.01]"
                >Run</button>
            </div>
        </div>
    );
}