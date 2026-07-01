"use client";

import { motion } from "framer-motion";
import { CanvasEdge, CanvasNode } from "@/types/creative";

interface ConnectionLineProps {
  edge: CanvasEdge;
  nodes: CanvasNode[];
  index: number;
}

export default function ConnectionLine({ edge, nodes, index }: ConnectionLineProps) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) return null;

  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.35 }}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke="white"
      strokeWidth="1"
    />
  );
}