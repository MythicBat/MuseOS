"use client";

import { useState } from "react";
import {
  GitBranch,
  History,
  Plus,
  RotateCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  CreativeBranch,
  CreativeVersion,
} from "@/types/creative";

interface TimelineProps {
  versions: CreativeVersion[];
  branches: CreativeBranch[];
  activeVersionId: string;
  activeVersionIndex: number;
  activeBranchId: string;

  onSelectVersion: (versionId: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onCreateBranch: (
    name: string,
    versionId?: string
  ) => void;
  onSwitchBranch: (branchId: string) => void;
}

export default function Timeline({
  versions,
  branches,
  activeVersionId,
  activeVersionIndex,
  activeBranchId,
  onSelectVersion,
  onRestoreVersion,
  onCreateBranch,
  onSwitchBranch,
}: TimelineProps) {
  const [branchName, setBranchName] = useState("");
  const [showBranchCreator, setShowBranchCreator] =
    useState(false);

  const safeActiveIndex = Math.max(
    0,
    activeVersionIndex
  );

  const selectedVersion =
    versions.find(
      (version) => version.id === activeVersionId
    ) ?? versions[safeActiveIndex];

  const handleCreateBranch = () => {
    const trimmedName = branchName.trim();

    if (!trimmedName) return;

    onCreateBranch(trimmedName, activeVersionId);

    setBranchName("");
    setShowBranchCreator(false);
  };

  return (
    <div className="mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-violet-200" />

            <p className="text-sm font-medium text-white/80">
              Creative Time Machine
            </p>
          </div>

          <p className="mt-1 text-xs text-white/40">
            Rewind, restore or branch any creative decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {branches.map((branch) => {
            const active =
              branch.id === activeBranchId;

            return (
              <button
                key={branch.id}
                onClick={() =>
                  onSwitchBranch(branch.id)
                }
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                  active
                    ? "border-violet-300/25 bg-violet-400/15 text-violet-100"
                    : "border-white/10 bg-black/25 text-white/45 hover:bg-white/10"
                }`}
              >
                <GitBranch className="h-3.5 w-3.5" />
                {branch.name}
              </button>
            );
          })}

          <button
            onClick={() =>
              setShowBranchCreator((current) => !current)
            }
            className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/55 transition hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" />
            New branch
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showBranchCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row">
              <input
                value={branchName}
                onChange={(event) =>
                  setBranchName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCreateBranch();
                  }
                }}
                placeholder="Example: Dark Cut"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-300/30"
              />

              <button
                onClick={handleCreateBranch}
                disabled={!branchName.trim()}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create branch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {versions.length > 1 && (
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <input
            type="range"
            min={0}
            max={versions.length - 1}
            value={safeActiveIndex}
            onChange={(event) => {
              const version =
                versions[Number(event.target.value)];

              if (version) {
                onSelectVersion(version.id);
              }
            }}
            className="w-full accent-violet-300"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-white/35">
            <span>Origin</span>
            <span>
              Version {safeActiveIndex + 1} of{" "}
              {versions.length}
            </span>
            <span>Latest</span>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-5 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-violet-300/40 via-white/10 to-transparent md:block" />

        <div className="space-y-3">
          {versions.map((version, index) => {
            const active =
              version.id === activeVersionId;

            return (
              <motion.button
                layout
                key={version.id}
                onClick={() =>
                  onSelectVersion(version.id)
                }
                className={`relative w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-violet-300/30 bg-violet-400/[0.1]"
                    : "border-white/10 bg-black/25 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:pl-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white/85">
                        {version.label}
                      </p>

                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
                        {version.source}
                      </span>

                      {active && (
                        <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-violet-200">
                          active
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {version.description}
                    </p>

                    {version.command && (
                      <p className="mt-2 text-xs text-violet-200/70">
                        Command: “{version.command}”
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/30">
                      {new Date(
                        version.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {!active && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onRestoreVersion(version.id);
                        }}
                        className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-white/50 transition hover:bg-white/10"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`absolute left-[14px] top-[18px] hidden h-3 w-3 rounded-full border md:block ${
                    active
                      ? "border-violet-200 bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.8)]"
                      : "border-white/20 bg-[#16151f]"
                  }`}
                />

                <span className="absolute right-4 top-4 text-[10px] text-white/20">
                  v{index + 1}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedVersion && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <div>
            <p className="text-xs text-white/35">
              Current timeline state
            </p>

            <p className="mt-1 text-sm text-white/70">
              {selectedVersion.label}
            </p>
          </div>

          <GitBranch className="h-4 w-4 text-white/30" />
        </div>
      )}
    </div>
  );
}