"use client";

import { motion } from "framer-motion";

import {
  CanvasEdge,
  CanvasNode,
  CreativeProject,
} from "@/types/creative";
import { CircleDot } from "lucide-react";

interface UniversePreviewProps {
  project: CreativeProject;
  active?: boolean;
}

export default function UniversePreview({
  project,
  active = false,
}: UniversePreviewProps) {
  const previewNodes = project.nodes.slice(0, 8);

  const previewNodeIds = new Set(
    previewNodes.map((node) => node.id)
  );

  const previewEdges = project.edges
    .filter(
      (edge) =>
        previewNodeIds.has(edge.from) &&
        previewNodeIds.has(edge.to)
    )
    .slice(0, 10);

  return (
    <div className="relative h-44 overflow-hidden rounded-[24px] border border-white/10 bg-black/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.18),transparent_55%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:24px_24px]" />

      <svg className="absolute inset-0 h-full w-full">
        {previewEdges.map(
          (edge, index) => {
            const fromNode =
              previewNodes.find(
                (node) =>
                  node.id === edge.from
              );

            const toNode =
              previewNodes.find(
                (node) =>
                  node.id === edge.to
              );

            if (!fromNode || !toNode) {
              return null;
            }

            const from =
              normalizeNodePosition(
                fromNode
              );

            const to =
              normalizeNodePosition(
                toNode
              );

            return (
              <motion.line
                key={`${edge.from}-${edge.to}-${index}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: 1,
                  opacity: active
                    ? 0.8
                    : 0.45,
                }}
                transition={{
                  duration: 0.75,
                  delay:
                    index * 0.045,
                }}
              />
            );
          }
        )}
      </svg>

      {previewNodes.map(
        (node, index) => {
          const position =
            normalizeNodePosition(node);

          return (
            <motion.div
              key={node.id}
              initial={{
                opacity: 0,
                scale: 0.6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: active
                  ? [0, -2, 0]
                  : 0,
              }}
              transition={{
                opacity: {
                  duration: 0.3,
                  delay: index * 0.05,
                },
                scale: {
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  delay: index * 0.05,
                },
                y: {
                  duration:
                    2.8 + index * 0.2,
                  repeat:
                    active
                      ? Number.POSITIVE_INFINITY
                      : 0,
                  ease: "easeInOut",
                },
              }}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform:
                  "translate(-50%, -50%)",
              }}
            >
              <div
                className={`relative flex items-center justify-center rounded-full border shadow-lg backdrop-blur-xl ${
                  node.type === "core"
                    ? "h-7 w-7 border-violet-200/30 bg-violet-300/25"
                    : "h-4 w-4 border-white/20 bg-white/15"
                }`}
              >
                {node.type === "core" && (
                  <motion.div
                    animate={{
                      scale: active
                        ? [1, 1.5, 1]
                        : 1,
                      opacity: active
                        ? [0.5, 0, 0.5]
                        : 0,
                    }}
                    transition={{
                      duration: 2.2,
                      repeat:
                        Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 rounded-full border border-violet-200/40"
                  />
                )}

                <span
                  className={`rounded-full bg-white ${
                    node.type === "core"
                      ? "h-2 w-2"
                      : "h-1.5 w-1.5"
                  }`}
                />
              </div>
            </motion.div>
          );
        }
      )}

      {previewNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/25">
          Universe preview unavailable
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] text-white/45 backdrop-blur-xl">
        <CircleDot className="h-3 w-3 text-violet-200/70" />

        Live universe
      </div>
    </div>
  );
}

function normalizeNodePosition(
  node: CanvasNode
): {
  x: number;
  y: number;
} {
  return {
    x: clamp(node.x, 12, 88),
    y: clamp(node.y, 14, 82),
  };
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}