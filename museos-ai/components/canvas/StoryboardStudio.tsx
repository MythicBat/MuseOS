"use client";

import {
  Camera,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  MapPin,
  Sparkles,
  Volume2,
} from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  StoryboardOutputData,
  StoryboardScene,
} from "@/types/creative";

interface StoryboardStudioProps {
  storyboard: StoryboardOutputData;
}

export default function StoryboardStudio({
  storyboard,
}: StoryboardStudioProps) {
  const [
    expandedSceneId,
    setExpandedSceneId,
  ] = useState<string | null>(
    storyboard.scenes[0]?.id ?? null
  );

  const copyImagePrompt = async (
    scene: StoryboardScene
  ) => {
    await navigator.clipboard.writeText(
      scene.imagePrompt
    );
  };

  return (
    <div>
      <div className="mb-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-400/[0.12] to-transparent p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-violet-200/60">
          Story direction
        </p>

        <p className="mt-2 text-lg font-medium leading-7 text-white/85">
          {storyboard.logline}
        </p>

        <p className="mt-3 text-sm leading-6 text-white/45">
          {storyboard.visualApproach}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {storyboard.scenes.map(
          (scene) => {
            const expanded =
              expandedSceneId === scene.id;

            return (
              <motion.article
                layout
                key={scene.id}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSceneId(
                      expanded
                        ? null
                        : scene.id
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="relative min-h-56 overflow-hidden border-b border-white/10 bg-black/35 p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_45%)]" />

                    <div className="relative flex h-full min-h-44 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                          Scene {scene.sceneNumber}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/45">
                          {scene.shotType}
                        </span>
                      </div>

                      <div>
                        <h5 className="text-2xl font-semibold text-white/90">
                          {scene.title}
                        </h5>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/45">
                          {
                            scene.visualComposition
                          }
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3 text-[11px] text-white/35">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          {scene.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-3 w-3" />
                          {scene.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <p className="text-sm text-white/65">
                      {scene.action}
                    </p>

                    {expanded ? (
                      <ChevronUp className="ml-4 h-4 w-4 shrink-0 text-white/30" />
                    ) : (
                      <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-white/30" />
                    )}
                  </div>
                </button>

                {expanded && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    className="border-t border-white/10 p-5"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DetailCard
                        icon={
                          <Camera className="h-4 w-4" />
                        }
                        label="Camera"
                        value={
                          scene.cameraDirection
                        }
                      />

                      <DetailCard
                        icon={
                          <Volume2 className="h-4 w-4" />
                        }
                        label="Dialogue & sound"
                        value={
                          scene.dialogueOrSound
                        }
                      />

                      <DetailCard
                        icon={
                          <Sparkles className="h-4 w-4" />
                        }
                        label="Emotional purpose"
                        value={
                          scene.emotionalPurpose
                        }
                      />
                    </div>

                    <div className="mt-4 rounded-2xl border border-violet-300/10 bg-violet-400/[0.06] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-violet-200/55">
                          Image prompt
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            copyImagePrompt(
                              scene
                            )
                          }
                          className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/45 hover:bg-white/10"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </button>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-white/50">
                        {scene.imagePrompt}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.article>
            );
          }
        )}
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-white/45">
        {icon}

        <p className="text-xs uppercase tracking-[0.14em]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-xs leading-6 text-white/55">
        {value}
      </p>
    </div>
  );
}