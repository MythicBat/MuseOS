"use client";

import { motion } from "framer-motion";
import { Agent } from "@/types/creative";

interface AgentDockProps {
  agents: Agent[];
}

const statusLabel = {
  thinking: "Thinking",
  complete: "Complete",
  waiting: "Waiting",
};

export default function AgentDock({ agents }: AgentDockProps) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {agents.map((agent, index) => (
        <motion.div
          key={agent.role}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.12 }}
          className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-white">{agent.role}</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
              {statusLabel[agent.status ?? "complete"]}
            </span>
          </div>

          <p className="text-sm leading-6 text-white/55">{agent.message}</p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: agent.status === "waiting" ? "35%" : "100%" }}
              transition={{ delay: 0.8 + index * 0.12, duration: 0.8 }}
              className="h-full rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}