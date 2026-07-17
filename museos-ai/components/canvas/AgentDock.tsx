"use client";

import { AnimatePresence, motion } from "framer-motion";

import {
  Agent,
  AgentActivity,
  AgentDebateMessage,
  AgentRole,
  OrchestraStage,
} from "@/types/creative";

interface AgentDockProps {
  agents: Agent[];
  activities: AgentActivity[];
  debate: AgentDebateMessage[];
  currentStage: OrchestraStage;
  isComplete: boolean;
}

const agentDetails: Record<
  AgentRole,
  {
    label: string;
    emoji: string;
  }
> = {
  writer: {
    label: "Writer",
    emoji: "✍️",
  },
  "art-director": {
    label: "Art Director",
    emoji: "🎨",
  },
  producer: {
    label: "Producer",
    emoji: "🎬",
  },
  "marketing-strategist": {
    label: "Marketing Strategist",
    emoji: "📢",
  },
};

const agentOrder: AgentRole[] = [
  "writer",
  "art-director",
  "producer",
  "marketing-strategist",
];

function getLatestActivity(
  activities: AgentActivity[],
  role: AgentRole
) {
  return [...activities]
    .reverse()
    .find((activity) => activity.agentId === role);
}

function getGeneratedAgent(
  agents: Agent[],
  role: AgentRole
) {
  const expectedRole = agentDetails[role].label.toLowerCase();

  return agents.find(
    (agent) => agent.role.toLowerCase() === expectedRole
  );
}

function getStatusLabel(
  activity: AgentActivity | undefined,
  isComplete: boolean
) {
  if (activity?.status === "thinking") return "thinking";
  if (activity?.status === "speaking") return "speaking";
  if (activity?.status === "error") return "error";
  if (activity?.status === "complete") return "complete";
  if (isComplete) return "complete";

  return "waiting";
}

function getStatusClasses(status: string) {
  if (status === "thinking" || status === "speaking") {
    return "bg-violet-400/15 text-violet-200";
  }

  if (status === "complete") {
    return "bg-emerald-400/15 text-emerald-200";
  }

  if (status === "error") {
    return "bg-red-400/15 text-red-200";
  }

  return "bg-white/10 text-white/40";
}

export default function AgentDock({
  agents,
  activities,
  debate,
  currentStage,
  isComplete,
}: AgentDockProps) {
  return (
    <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/40">
            Live Creative Room
          </p>

          <h3 className="text-xl font-semibold tracking-tight">
            {isComplete
              ? "The creative orchestra has reached consensus"
              : currentStage.label}
          </h3>

          <p className="mt-1 text-sm text-white/45">
            {currentStage.description}
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-3 py-1 text-xs ${
            isComplete
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-violet-400/15 text-violet-200"
          }`}
        >
          {isComplete ? "Complete" : "Live"}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {agentOrder.map((role) => {
          const details = agentDetails[role];
          const activity = getLatestActivity(activities, role);
          const generatedAgent = getGeneratedAgent(agents, role);
          const status = getStatusLabel(activity, isComplete);

          return (
            <motion.div
              key={role}
              layout
              className={`rounded-[24px] border p-4 transition ${
                status === "thinking"
                  ? "border-violet-300/25 bg-violet-400/[0.08]"
                  : "border-white/10 bg-black/25"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={
                      status === "thinking"
                        ? {
                            scale: [1, 1.08, 1],
                            opacity: [0.75, 1, 0.75],
                          }
                        : undefined
                    }
                    transition={{
                      duration: 1.4,
                      repeat:
                        status === "thinking"
                          ? Number.POSITIVE_INFINITY
                          : 0,
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"
                  >
                    {details.emoji}
                  </motion.div>

                  <div>
                    <p className="font-medium">{details.label}</p>
                    <p className="text-xs text-white/35">
                      Creative specialist
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${getStatusClasses(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>

              <p className="pl-[52px] text-sm leading-6 text-white/60">
                {activity?.status === "thinking"
                  ? activity.message
                  : generatedAgent?.message ??
                    `${details.label} is waiting to join the room.`}
              </p>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {debate.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-[26px] border border-white/10 bg-black/30 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/85">
                  Agent Debate
                </p>
                <p className="text-xs text-white/40">
                  Granite-powered creative negotiation
                </p>
              </div>

              <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200">
                resolving
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {debate.map((message) => {
                  const details = agentDetails[message.agentId];

                  return (
                    <motion.div
                      key={message.id}
                      initial={{
                        opacity: 0,
                        x:
                          message.stance === "challenge"
                            ? 18
                            : -18,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span>{details.emoji}</span>
                        <span className="text-sm font-medium">
                          {details.label}
                        </span>

                        {message.stance && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
                            {message.stance}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-6 text-white/60">
                        {message.content}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}