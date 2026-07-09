"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Agent } from "@/types/creative";

interface AgentDockProps {
  agents: Agent[]; 
}

const agentEmoji: Record<string, string> = {
  Writer: "✍️",
  "Art Director": "🎨",
  Producer: "🎬",
  "Marketing Strategist": "📢",
};

export default function AgentDock({ agents }: AgentDockProps) {
  const [visibleAgents, setVisibleAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    // setVisibleAgents([]);

    agents.forEach((agent, index) => {
      const timer = setTimeout(() => {
        setVisibleAgents((current) => current.some((item) => item.role === agent.role) ? current : [...current, agent]);
      }, 900 + index * 700);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [agents]);

  return (
    <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/40">Live Creative Room</p>
          <h3 className="text-xl font-semibold tracking-light">AI agents are reviewing your universe</h3>
        </div>

        <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
          Live
        </div>
      </div>

      <div className="space-y-3">
        {visibleAgents.map((agent, index) => (
          <motion.div
            key={agent.role}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              delay: index * 0.05,
            }}
            className="rounded-[24px] border border-white/10 bg-black/25 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                  {agentEmoji[agent.role] ?? "✨"}
                </div>
                <p className="font-medium">{agent.role}</p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/45">
                {agent.status ?? "complete"}
              </span>
            </div>

            <p className="pl-12 text-sm leading-6 text-white/60">{agent.message}</p>
          </motion.div>
        ))}

        {visibleAgents.length < agents.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/40"
          >
            Another agent is thinking...
          </motion.div>
        )}
      </div>
    </div>
  );
}