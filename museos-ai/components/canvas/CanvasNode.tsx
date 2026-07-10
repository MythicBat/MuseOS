"use client";

import { motion } from "framer-motion";
import { Brain, Clapperboard, Megaphone, Music, Palette, Sparkles, Wand2 } from "lucide-react";
import { CanvasNode as CanvasNodeType } from "@/types/creative";
import { AnimatePresence } from "framer-motion";
import NodeDetailPanel from "./NodeDetailPanel";

interface CanvasNodeProps {
  node: CanvasNodeType;
  index: number;
  selected?: boolean;
  onClick: () => void; 
}

const iconMap = {
  core: Sparkles,
  story: Clapperboard,
  character: Brain,
  visual: Palette,
  marketing: Megaphone,
  world: Wand2,
  music: Music,
};

export default function CanvasNode({ node, index, selected = false, onClick }: CanvasNodeProps) {
  const Icon = iconMap[node.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 16,
      }}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
      whileHover={{
        scale: 1.05,
        y: -4,
      }}
      whileTap={{
        scale: 0.98,
      }}
      data-canvas-node
      onClick={onClick}
      className={`absolute w-56 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[28px] border p-5 shadow-2xl backdrop-blur-2xl transition
        ${selected ? "border-white/40 bg-white/[0.14] shadow-[0_0_45px_rgba(139,92,246,0.22)]" : "border-white/10 bg-white/[0.08] hover:border-white/25 hover:bg-white/[0.12] hover:shadow-[0_0_35px_rgba(139,92,246,0.16)]"}`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="font-semibold tracking-tight text-white">{node.title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{node.subtitle}</p>
    </motion.div>
  );
}