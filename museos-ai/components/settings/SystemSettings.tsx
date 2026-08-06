"use client";

import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type {
  MuseSettings,
  SettingsSection,
} from "@/types/settings";
import type { AIProviderStatus } from "@/types/aiProviderStatus";


import AppearancePanel from "@/components/settings/panels/AppearancePanel";
import AISettingsPanel from "@/components/settings/panels/AISettingsPanel";
import GenerationPanel from "@/components/settings/panels/GenerationPanel";
import WorkspacePanel from "@/components/settings/panels/WorkspacePanel";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ExportPanel from "@/components/settings/panels/ExportPanel";
import AboutPanel from "@/components/settings/panels/AboutPanel";

interface SystemSettingsProps {
  open: boolean;
  settings: MuseSettings;

  onClose: () => void;

  onUpdateSettings: <
    Section extends keyof MuseSettings
  >(
    section: Section,
    updates: Partial<
      MuseSettings[Section]
    >
  ) => void;

  onResetSettings: () => void;
  aiProviderStatuses: AIProviderStatus[];
  aiProviderStatusLoading: boolean;
  aiProviderStatusError: string | null;
  aiProviderCheckedAt: number | null;
  onRefreshAIProviderStatus: () => Promise<void>;
}

export default function SystemSettings({
  open,
  settings,
  aiProviderStatuses,
  aiProviderCheckedAt,
  aiProviderStatusError,
  aiProviderStatusLoading,
  onClose,
  onUpdateSettings,
  onResetSettings,
  onRefreshAIProviderStatus,
}: SystemSettingsProps) {
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<SettingsSection>(
      "appearance"
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[180] cursor-default bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 14,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed left-1/2 top-1/2 z-[190] flex h-[min(780px,calc(100vh-2rem))] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#16141f] shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
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
                  onClick={
                    onResetSettings
                  }
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/45 transition hover:bg-white/10 hover:text-white/70 sm:px-4 sm:text-xs"
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
            </header>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <SettingsSidebar
                activeSection={activeSection}
                settings={settings}
                onSectionChange={setActiveSection}
              />

              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
                {activeSection ===
                  "appearance" && (
                  <AppearancePanel
                    settings={
                      settings.appearance
                    }
                    onChange={(
                      updates
                    ) =>
                      onUpdateSettings(
                        "appearance",
                        updates
                      )
                    }
                  />
                )}

                {activeSection ===
                  "ai" && (
                  <AISettingsPanel
                    settings={
                      settings.ai
                    }
                    providerStatuses={aiProviderStatuses}
                    statusLoading={aiProviderStatusLoading}
                    statusError={aiProviderStatusError}
                    checkedAt={aiProviderCheckedAt}
                    onRefreshStatus={onRefreshAIProviderStatus}
                    onChange={(
                      updates
                    ) =>
                      onUpdateSettings(
                        "ai",
                        updates
                      )
                    }
                  />
                )}

                {activeSection ===
                  "generation" && (
                  <GenerationPanel
                    settings={settings.generation}
                    onChange={(updates) => onUpdateSettings("generation", updates)}
                  />
                )}

                {activeSection ===
                  "export" && (
                  <ExportPanel
                    settings={settings.export}
                    onChange={(updates) => onUpdateSettings("export", updates)}
                  />
                )}

                {activeSection ===
                  "workspace" && (
                  <WorkspacePanel
                    settings={settings.workspace}
                    onChange={(updates) => onUpdateSettings("workspace", updates)}
                  />
                )}

                {activeSection ===
                  "about" && (
                  <AboutPanel
                    settings={settings}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}