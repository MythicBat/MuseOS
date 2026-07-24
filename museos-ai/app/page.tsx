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
import type { CreativeGraphProductionHandle } from "@/components/canvas/CreativeGraph";

import {
  AmbientParticles,
  MouseGlow,
} from "@/components/ui";

import { useSavedProjects } from "@/hooks/useSavedProjects";

type AppView =
  | "hero"
  | "dashboard"
  | "studio";

export default function Home() {
  const [view, setView] =
    useState<AppView>("hero");

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState<string | null>(null);

  const [spotlightOpen, setSpotlightOpen] = useState(false);

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
    <main className="relative min-h-screen overflow-x-hidden bg-[#050510] text-white">
      <BackgroundGlow />
      <MouseGlow />
      <AmbientParticles />

      <div className="relative z-10">
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
        onGenerateStoryboard={() => { void productionApiRef.current?.generateStoryboard();}}
        onGeneratePitchDeck={() => { void productionApiRef.current?.generatePitchDeck();}}
        onGenerateCreativeBible={() => { void productionApiRef.current?.generateCreativeBible(); }}
        onGenerateProductionPlan={() => { void productionApiRef.current?.generateProductionPlan(); }}
        onGenerateMarketingPlan={() => { void productionApiRef.current?.generateMarketingPlan(); }}
        onGenerateInvestorBrief={() => { void productionApiRef.current?.generateInvestorBrief(); }}
        onGenerateSocialCampaign={() => { void productionApiRef.current?.generateSocialCampaign(); }}
        onGenerateProjectBrief={() => { void productionApiRef.current?.generateProjectBrief(); }}
        onFocusProduction={() => { void productionApiRef.current?.focusProduction(); }}
      />
    </main>
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