"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CornerDownLeft, Sparkles } from "lucide-react";

export interface CommandCoreHandle {
  focus: () => void;
}

interface CommandCoreProps {
  onCommand: (command: string) => void | Promise<void>;
}

const CommandCore = forwardRef<CommandCoreHandle, CommandCoreProps>(
  function CommandCore({ onCommand }, ref) {
    const [command, setCommand] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const submitCommand = async () => {
      const trimmedCommand = command.trim();

      if (!trimmedCommand || submitting) return;

      setSubmitting(true);

      try {
        await onCommand(trimmedCommand);
        setCommand("");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="absolute left-1/2 top-5 z-40 w-[92%] max-w-2xl -translate-x-1/2 rounded-full border border-white/10 bg-black/50 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <input
            ref={inputRef}
            value={command}
            disabled={submitting}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submitCommand();
              }
            }}
            placeholder="Ask MuseOS to refine this universe..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-60"
          />

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/35 sm:flex">
            <span>⌘</span>
            <span>K</span>
          </div>

          <button
            type="button"
            onClick={() => void submitCommand()}
            disabled={!command.trim() || submitting}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Thinking" : "Run"}
            <CornerDownLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
);

export default CommandCore;