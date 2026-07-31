"use client";

import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import BackgroundGlow from "@/components/BackgroundGlow";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import ProjectDashboard from "@/components/dashboard/ProjectDashboard";
import MuseSpotlight from "@/components/workspace/MuseSpotlight";
import MuseNotificationCenter from "@/components/system/MuseNotificationCenter";
import MuseActivityCenter from "@/components/system/MuseActivityCenter";
import MuseToolbar from "@/components/system/MuseToolbar";
import SystemSettings from "@/components/settings/SystemSettings";
import type { CreativeGraphProductionHandle } from "@/components/canvas/CreativeGraph";

import {
  AmbientParticles,
  MouseGlow,
} from "@/components/ui";

import { useSavedProjects } from "@/hooks/useSavedProjects";
import { useMuseNotifications } from "@/hooks/useMuseNotifications";
import { useMuseActivity } from "@/hooks/useMuseActivity";
import { useMuseSettings } from "@/hooks/useMuseSettings";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { MuseSettings } from "@/types/settings";

type AppView =
  | "hero"
  | "dashboard"
  | "studio";

function getThemeClass(theme: MuseSettings["appearance"]["theme"]): string {
  switch (theme) {
    case "midnight":
      return "bg-[#020208]";
    case "system":
      return "bg-[#050510] dark:bg-[#050510]";
    case "dark":
    default:
      return "bg-[#050510]";
  }
}

function getGlassClass(intensity: MuseSettings["appearance"]["glassIntensity"]): string {
  switch (intensity) {
    case "low":
      return "muse-glass-low";
    case "high":
      return "muse-glass-high";
    case "medium":
    default:
      return "muse-glass-medium";
  }
}

function getAccentVariables(
  accent:
    MuseSettings["appearance"]["accent"]
): React.CSSProperties {
  switch (accent) {
    case "blue":
      return {
        "--muse-accent":
          "96 165 250",
      } as React.CSSProperties;

    case "emerald":
      return {
        "--muse-accent":
          "52 211 153",
      } as React.CSSProperties;

    case "rose":
      return {
        "--muse-accent":
          "251 113 133",
      } as React.CSSProperties;

    case "amber":
      return {
        "--muse-accent":
          "251 191 36",
      } as React.CSSProperties;

    case "violet":
    default:
      return {
        "--muse-accent":
          "167 139 250",
      } as React.CSSProperties;
  }
}

function getProviderLabel(provider: MuseSettings["ai"]["provider"]): string {
  switch (provider) {
    case "openai":
      return "OpenAI";
    case "gemini":
      return "Gemini";
    case "claude":
      return "Claude";
    case "ollama":
      return "Ollama";
    case "granite":
    default:
      return "IBM Granite";
  }
}

export default function Home() {
  const [view, setView] =
    useState<AppView>("hero");

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState<string | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [activityCenterOpen, setActivityCenterOpen] = useState(false);

  const [spotlightOpen, setSpotlightOpen] = useState(false);  

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameProjectValue, setRenameProjectValue] = useState("");

  const {
    activities,
    unreadCount,
    addActivity,
    deleteActivity,
    clearActivities,
    markActivityRead,
    markAllActivitiesRead,
  } = useMuseActivity();

  const {
    notifications,
    notify,
    updateNotification,
    dismissNotification,
  } = useMuseNotifications();

  const {
    settings,
    updateSettings,
    resetSettings,
  } = useMuseSettings();

  const {
    projects,
    hasHydrated,
    saveProject,
    openProject,
    closeProject,
    renameProject,
    duplicateProject,
    deleteProject,
  } = useSavedProjects();

  const selectedProject = useMemo(
    () =>
      projects.find(
        (project) =>
          project.id ===
          selectedProjectId
      ) ?? null,
    [
      projects,
      selectedProjectId,
    ]
  );

  const handleOpenSpotlight = useCallback(() => {
    setSpotlightOpen(true);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);

    notify({
      type: "info",
      title: "System Settings",
      message: "MuseOS settings will be available.",
    });
  }, [notify]);

  const handleCloseSettings = useCallback(() => {
    setSettingsOpen(false);
  },[]);

  const handleOpenActivityCenter = useCallback(() => {
    setActivityCenterOpen(true);

    window.setTimeout(() => {
      markAllActivitiesRead();
    }, 300);
  }, [markAllActivitiesRead]);

  const handleRenameCurrentProject = useCallback(() => {
    if (!selectedProject) { return; }

    setRenameProjectValue(selectedProject.project.title);
    setRenameDialogOpen(true);
  }, [selectedProject]);

  const confirmRenameProject = useCallback(() => {
    if (!selectedProject) { return; }

    const nextTitle = renameProjectValue.trim();
    
    if (!nextTitle) {
      notify({
        type: "warning",
        title: "Title required",
        message: "Enter a name for this creative universe",
      });

      return;
    }

    const previousTitle = selectedProject.project.title;
    renameProject(selectedProject.id, nextTitle);

    setRenameDialogOpen(false);
    setRenameProjectValue("");

    notify({
      type: "success",
      title: "Universe renamed",
      message: `${previousTitle} is now ${nextTitle}.`,
    });

    addActivity({
      type: "project",
      status: "success",
      title: "Universe renamed",
      message: `${previousTitle} was renamed to ${nextTitle}.`,
      projectId: selectedProject.id,
      projectTitle: nextTitle,
    });
  }, [addActivity, notify, renameProjectValue, selectedProject, renameProject]); 

  const handleDuplicateCurrentProject =
  useCallback(() => {
    if (!selectedProject) {
      return;
    }

    const duplicateProjectData = structuredClone(selectedProject.project);

    duplicateProjectData.title = `${duplicateProjectData.title} Copy`;

    const duplicateId =
      saveProject(duplicateProjectData);

    setSelectedProjectId(
      duplicateId
    );

    setView("studio");

    notify({
      type: "success",
      title: "Universe duplicated",
      message: `${duplicateProjectData.title} is ready to edit.`,
    });

    addActivity({
      type: "project",
      status: "success",
      title: "Universe duplicated.",
      message: `${selectedProject.project.title} was copied as ${duplicateProjectData.title}.`,
      projectId: duplicateId,
      projectTitle: duplicateProjectData.title,
    });
  }, [
    addActivity,
    notify,
    saveProject,
    selectedProject,
  ]);

  const handleEnterWorkspace = () => {
    setView("dashboard");
  };

  const handleCreateProject = () => {
    closeProject();
    setSelectedProjectId(null);
    setView("studio");
  };

  const handleOpenProject = (
    projectId: string
  ) => {
    openProject(projectId);
    setSelectedProjectId(projectId);
    setView("studio");
  };

  const handleBackToProjects = () => {
    focusCommandCoreRef.current = null;
    productionApiRef.current = null;
    setSelectedProjectId(null);
    setView("dashboard");
  };

  const handleDuplicateProject = (
    projectId: string
  ) => {
    duplicateProject(projectId);
  };

  const handleDeleteProject = (
    projectId: string
  ) => {
    deleteProject(projectId);

    if (
      selectedProjectId === projectId
    ) {
      setSelectedProjectId(null);
    }
  };

  const runProductionCommand = useCallback(
    async (
      label: string,
      command: | (() => Promise<void>) | undefined
    ) => {
      if (!command) {
        notify({
          type: "error",
          title: "Production unavailable.",
          message: "Open a creative universe before generating assets.",
        });

        return;
      }

      const notificationId = 
        notify({
          type: "loading",
          title: `Generating ${label}`,
          message: "IBM Granite is building the production asset.",
          persistent: true,
        });

      try {
        await command();

        addActivity({
          type: "generation",
          status: "success",
          title: `${label} generated`,
          message: "The asset was added to Procution Studio.",
          projectId: selectedProject?.id,
          projectTitle: selectedProject?.project.title,
        });

        updateNotification(
          notificationId,
          {
            type: "success",
            title: `${label} ready`,
            message: "The generated asset has been added to Production Studio.",
            duration: 4200,
          }
        );
      } catch (error) {
        const message = error instanceof Error
          ? error.message : `Unable to generate ${label.toLowerCase()}.`;

        addActivity({
          type: "generation",
          status: "error",
          title: `${label} generation failed`,
          message,
          projectId: selectedProject?.id,
          projectTitle: selectedProject?.project.title,
        });

        updateNotification(
          notificationId,
          {
            type: "error",
            title: `${label} generation failed`,
            message,
            duration: 6000,
          }
        );
      }
    },
    [addActivity, selectedProject, notify, updateNotification]
  );

  const runExportCommand =
  useCallback(
    async (
      label: string,
      command:
        | (() => Promise<void>)
        | undefined
    ) => {
      if (!command) {
        notify({
          type: "warning",
          title: "Nothing to export",
          message:
            "Open a generated production asset first.",
        });

        return;
      }

      const notificationId =
        notify({
          type: "loading",
          title: `Preparing ${label}`,
          message:
            "MuseOS is packaging the active asset.",
          persistent: true,
        });

      try {
        await command();

        updateNotification(
          notificationId,
          {
            type: "success",
            title: `${label} exported`,
            message:
              "Your file is ready.",
            duration: 4000,
          }
        );

        addActivity({
          type: "export",
          status: "success",
          title: `${label} exported`,
          message: "The active production asset was downloaded.",
          projectId: selectedProject?.id,
          projectTitle: selectedProject?.project.title,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to export this asset.";

        updateNotification(
          notificationId,
          {
            type: "error",
            title: "Export failed",
            message,
            duration: 6000,
          }
        );

        addActivity({
          type: "export",
          status: "error",
          title: `${label} export failed`,
          message,
          projectId: selectedProject?.id,
          projectTitle: selectedProject?.project.title,
        });
      }
    },
    [
      addActivity,
      selectedProject,
      notify,
      updateNotification,
    ]
  );

  const focusCommandCoreRef = useRef<(() => void) | null>(null);
  const productionApiRef = useRef<CreativeGraphProductionHandle | null>(null);

  const handleCommandCoreReady = useCallback((focusCommandCore: () => void) => {
    focusCommandCoreRef.current = focusCommandCore;
  }, []);

  const handleProductionReady = useCallback((api: CreativeGraphProductionHandle) => {
    productionApiRef.current = api;
  },[]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping = 
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        Boolean(target?.isContentEditable);

        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "k" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          setSpotlightOpen((current) => !current);

          return;
        }

        if (event.key === "Escape" && spotlightOpen) {
          event.preventDefault();
          setSpotlightOpen(false);
          return;
        }

        if (isTyping) { return; }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [spotlightOpen]);

  return (
    <MotionConfig
      reducedMotion={settings.appearance.reduceMotion ? "always" : "never"}
    >
    <main
      style={getAccentVariables(settings.appearance.accent)}
      className={`relative min-h-screen overflow-x-hidden text-white ${
      getThemeClass(settings.appearance.theme)
    } ${getGlassClass(settings.appearance.glassIntensity)}`}
    >
      <BackgroundGlow />
      <MouseGlow />
      {settings.workspace.showParticles && (
        <AmbientParticles />
      )}

      {view !== "hero" && (
        <MuseToolbar
          unreadActivityCount={unreadCount}
          hasNotifications={notifications.length > 0}
          providerLabel={getProviderLabel(settings.ai.provider)}
          providerOnline={settings.ai.provider === "granite"}
          onOpenSpotlight={handleOpenSpotlight}
          onOpenActivity={handleOpenActivityCenter}
          onOpenAlerts={handleOpenActivityCenter}
          onOpenSettings={handleOpenSettings}
        />
      )}

      <div className={`relative z-10 ${view !== "hero" ? "pt-24 sm:pt-28" : ""}`}>
        {view === "hero" ? (
          <Hero
            onStart={
              handleEnterWorkspace
            }
          />
        ) : view === "dashboard" ? (
          hasHydrated ? (
            <ProjectDashboard
              projects={projects}
              onCreateProject={
                handleCreateProject
              }
              onOpenProject={
                handleOpenProject
              }
              onRenameProject={
                renameProject
              }
              onDuplicateProject={
                handleDuplicateProject
              }
              onDeleteProject={
                handleDeleteProject
              }
            />
          ) : (
            <WorkspaceLoader />
          )
        ) : (
          <Studio
            key={
              selectedProject?.id ??
              "new-project"
            }
            initialProject={
              selectedProject?.project ??
              null
            }
            initialProjectId={
              selectedProject?.id ??
              null
            }
            onSaveProject={
              saveProject
            }
            onBack={
              handleBackToProjects
            }
            onCommandReady={handleCommandCoreReady}
            onProductionReady={handleProductionReady}
            onProjectCreated={setSelectedProjectId}
          />
        )}
      </div>

      <MuseSpotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        currentProject={selectedProject?.project ?? null}
        savedProjects={projects}
        onOpenDashboard={() => {setView("dashboard");}}
        onOpenProject={handleOpenProject}
        onFocusCommandCore={() => {focusCommandCoreRef.current?.();}}
        onGenerateStoryboard={() => { void runProductionCommand("Storyboard", productionApiRef.current ? () => productionApiRef.current!.generateStoryboard() : undefined); }}
        onGeneratePitchDeck={() => { void runProductionCommand("Pitch Deck", productionApiRef.current ? () => productionApiRef.current!.generatePitchDeck() : undefined); }}
        onGenerateCreativeBible={() => { void runProductionCommand("Creative Bible", productionApiRef.current ? () => productionApiRef.current!.generateCreativeBible() : undefined); }}
        onGenerateProductionPlan={() => { void runProductionCommand("Production Plan", productionApiRef.current ? () => productionApiRef.current!.generateProductionPlan() : undefined); }}
        onGenerateMarketingPlan={() => { void runProductionCommand("Marketing Plan", productionApiRef.current ? () => productionApiRef.current!.generateMarketingPlan() : undefined); }}
        onGenerateInvestorBrief={() => { void runProductionCommand("Investor Brief", productionApiRef.current ? () => productionApiRef.current!.generateInvestorBrief() : undefined); }}
        onGenerateSocialCampaign={() => { void runProductionCommand("Social Campaign", productionApiRef.current ? () => productionApiRef.current!.generateSocialCampaign() : undefined); }}
        onGenerateProjectBrief={() => { void runProductionCommand("Project Brief", productionApiRef.current ? () => productionApiRef.current!.generateProjectBrief() : undefined); }}
        onExportPDF={() => { void runExportCommand("PDF", productionApiRef.current ? () => productionApiRef.current!.exportActivePDF() : undefined); }}
        onExportPowerPoint={() => { void runExportCommand("PowerPoint", productionApiRef.current ? () => productionApiRef.current!.exportActivePowerPoint() : undefined); }}
        onFocusExports={() => { void productionApiRef.current?.focusExports(); }}
        onFocusProduction={() => { void productionApiRef.current?.focusProduction(); }}
        onRenameProject={handleRenameCurrentProject}
        onDuplicateProject={handleDuplicateCurrentProject}
        onReturnToDashboard={handleBackToProjects}
        onOpenActivityCenter={handleOpenActivityCenter}
      />

      <MuseNotificationCenter
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <MuseActivityCenter
        open={activityCenterOpen}
        activities={activities}
        unreadCount={unreadCount}
        onClose={() => setActivityCenterOpen(false)}
        onDelete={deleteActivity}
        onClear={clearActivities}
        onMarkRead={markActivityRead}
        onMarkAllRead={markAllActivitiesRead}
      />

      <SystemSettings
        open={settingsOpen}
        settings={settings}
        onClose={handleCloseSettings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />

      <AnimatePresence>
        {renameDialogOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close rename dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setRenameDialogOpen(false);
                setRenameProjectValue("");
              }}
              className="fixed inset-0 z-[180] cursor-default bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed left-1/2 top-1/2 z-[190] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[#16141f] p-6 shadow-2xl"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">Universe Settings</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Rename Universe</h2>
              <p className="mt-1 text-sm leading-6 text-white/40">Give this creative universe a new title</p>

              <input
                autoFocus
                value={renameProjectValue}
                onChange={(event) => setRenameProjectValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") { confirmRenameProject(); }
                  if (event.key === "Escape") { setRenameDialogOpen(false); setRenameProjectValue(""); }
                }}
                className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/30"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {setRenameDialogOpen(false); setRenameProjectValue(""); }}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmRenameProject}
                  disabled={!renameProjectValue.trim()}
                  className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSettings}
              className="fixed inset-0 z-[180] cursor-default bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed left-1/2 top-1/2 z-[190] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[#16141f] p-6 shadow-2xl"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">MuseOS</p>

              <h2 className="mt-2 text-xl font-semibold text-white">System Settings</h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
              Theme, AI provider, generation preferences and export defaults will
              be configured here in Phase 11.
              </p>

              <div className="mt-5 rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.05] p-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110, 231, 183, 0.8)]" />

                  <div>
                    <p className="text-sm font-medium text-emerald-100/80">IBM Granite</p>
                    <p className="mt-0.5 text-xs text-white/30">Connected through watsonx.ai</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseSettings}
                  className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
    </MotionConfig>
  );
}

function WorkspaceLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-8 py-6 text-center backdrop-blur-2xl">
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />

        <p className="mt-4 text-sm text-white/45">
          Opening MuseOS workspace...
        </p>
      </div>
    </div>
  );
}