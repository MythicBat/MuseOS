"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import Logo from "@/components/Logo";
import EmptyCanvas from "@/components/EmptyCanvas";
import LoadingCanvas from "@/components/LoadingCanvas";
import CreativeCanvas from "@/components/CreativeCanvas";
import { generateProject } from "@/lib/api";
import { CreativeProject } from "@/types/creative";
import CreativeGraph, { CreativeGraphProductionHandle } from "@/components/canvas/CreativeGraph";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

interface StudioProps {
  onBack: () => void;
  initialProject?: CreativeProject | null;
  initialProjectId?: string | null;

  onSaveProject: (
    project: CreativeProject,
    existingId?: string
  ) => string;
  onCommandReady?: (
    focusCommandCore: () => void
  ) => void;
  onProjectCreated?: (projectId: string) => void;
  onProductionReady?: (
    api: CreativeGraphProductionHandle
  ) => void;
}

export default function Studio({ onBack, initialProject = null, initialProjectId = null, onSaveProject, onCommandReady, onProjectCreated, onProductionReady }: StudioProps) {
  const [idea, setIdea] = useState("");
  const [project, setProject] = useState<CreativeProject | null>(() => initialProject);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => initialProjectId);
  const currentProjectIdRef = useRef<string | null>(initialProjectId);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"watsonx" | "fallback" | null>(null);
  const [projectGeneration, setProjectGeneration] = useState(0);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setProject(null);

    try {
      const result = await generateProject(idea);

      const savedProjectId = onSaveProject(result.project);

      currentProjectIdRef.current = savedProjectId;

      setProject(result.project);
      setCurrentProjectId(savedProjectId);
      onProjectCreated?.(savedProjectId);
      setProvider(result.provider);

    } catch (error) {
      console.error(error);
      alert("Failed to generate creative universe.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange =
  useCallback(
    (
      nextProject: CreativeProject
    ) => {
      const savedProjectId =
        onSaveProject(
          nextProject,
          currentProjectIdRef.current ??
            undefined
        );

      if (
        !currentProjectIdRef.current
      ) {
        currentProjectIdRef.current =
          savedProjectId;

        setCurrentProjectId(
          savedProjectId
        );
      }
    },
    [onSaveProject]
  );
  
  return (
    <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <nav className="mb-10 flex items-center justify-between">
        <Logo />

        {!project && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/20"
          >
            Back to Projects
          </button>
        )}
      </nav>

      <div className="flex items-start gap-6">
        {project && (
          <WorkspaceSidebar
            projectTitle={project.title}
            onBack={onBack}
          />
        )}

        <div className="min-w-0 flex-1">
          <section className={`grid gap-8 ${
            project ? "xl:grid-cols-[0.72fr_1.6fr]" : "lg:grid-cols-[0.9fr_1.5fr]"
          }`}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-2xl"
        >
          <div className="mb-6">
            <p className="mb-2 text-sm text-white/50">MuseOS Studio</p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Start with one spark.
            </h1>
            <p className="mt-4 leading-7 text-white/60">
              Enter any creative idea. MuseOS will transform it into a story
              world, creative DNA, agent feedback, and production plan.
            </p>
          </div>

          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="Example: A children’s animated film about a lonely robot who discovers music..."
            className="min-h-44 w-full resize-none rounded-3xl border border-white/10 bg-black/30 p-5 text-white outline-none backdrop-blur-xl placeholder:text-white/35 focus:border-white/30"
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Creative Universe"}
            <Sparkles className="h-4 w-4" />
          </button>

          {provider && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
              <span className="text-xs text-white/45">AI provider</span>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  provider === "watsonx"
                    ? "bg-blue-400/15 text-blue-200"
                    : "bg-amber-400/15 text-amber-200"
                }`}
              >
                {provider === "watsonx"
                  ? "IBM Granite · watsonx.ai"
                  : "Reliable fallback mode"}
              </span>
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
            <p className="mb-3 text-sm font-medium text-white/80">
              Built for the IBM AI Builders Challenge
            </p>
            <p className="text-sm leading-6 text-white/50">
              This MVP demonstrates AI-assisted creative planning, multi-agent
              collaboration, creative DNA, and one-click production outputs.
            </p>
          </div>
        </motion.div>

        <section>
          {loading ? (
            <LoadingCanvas />
          ) : project ? (
            <CreativeGraph
              key={`${currentProjectId ?? "new"}-${projectGeneration}`}
              project={project}
              onProjectChange={handleProjectChange}
              onCommandCoreReady={onCommandReady}
              onProductionReady={onProductionReady}
            />
          ) : (
            <EmptyCanvas />
          )}
        </section>
          </section>
        </div>
      </div>
    </div>
  );
}