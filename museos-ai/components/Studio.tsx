"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import Logo from "@/components/Logo";
import EmptyCanvas from "@/components/EmptyCanvas";
import LoadingCanvas from "@/components/LoadingCanvas";
import CreativeCanvas from "@/components/CreativeCanvas";
import { generateProject } from "@/lib/api";
import { CreativeProject } from "@/types/creative";
import CreativeGraph from "@/components/canvas/CreativeGraph";

interface StudioProps {
  onBack: () => void;
}

export default function Studio({ onBack }: StudioProps) {
  const [idea, setIdea] = useState("");
  const [project, setProject] = useState<CreativeProject | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setProject(null);

    try {
      const generatedProject = await generateProject(idea);
      setProject(generatedProject);
    } catch (error) {
      console.error(error);
      alert("Failed to generate creative universe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-10 flex items-center justify-between">
        <Logo />

        <button
          onClick={onBack}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/20"
        >
          Back Home
        </button>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr]">
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
            <CreativeGraph project={project} />
          ) : (
            <EmptyCanvas />
          )}
        </section>
      </section>
    </div>
  );
}