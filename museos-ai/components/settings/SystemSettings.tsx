"use client";

import type { MuseSettings } from "@/types/settings";
import { X } from "lucide-react";

interface SystemSettingsProps {
  open: boolean;
  settings: MuseSettings;

  onClose: () => void;

  onUpdateSettings: <
    Section extends keyof MuseSettings
  >(
    section: Section,
    updates: Partial<MuseSettings[Section]>
  ) => void;

  onResetSettings: () => void;
}

export default function SystemSettings({
  open,
  settings,
  onClose,
  onUpdateSettings,
  onResetSettings,
}: SystemSettingsProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-[#16141f] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
              MuseOS
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white/90">
              System Settings
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetSettings}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/45 transition hover:bg-white/10 hover:text-white/70"
            >
              Reset defaults
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-white/40">
            Settings interface goes here.
          </p>
        </div>
      </div>
    </div>
  );
}