"use client";

import { useState } from "react";

import {
  Check,
  GitBranch,
  GitCompare,
  History,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CreativeBranch,
  CreativeVersion,
} from "@/types/creative";

interface TimelineProps {
  versions: CreativeVersion[];
  allVersions: CreativeVersion[];
  branches: CreativeBranch[];

  activeVersionId: string;
  activeVersionIndex: number;
  activeBranchId: string;

  onSelectVersion: (
    versionId: string
  ) => void;

  onRestoreVersion: (
    versionId: string
  ) => void;

  onCreateBranch: (
    name: string,
    versionId?: string
  ) => void;

  onSwitchBranch: (
    branchId: string
  ) => void;

  onRenameBranch: (
    branchId: string,
    name: string
  ) => void;

  onDeleteBranch: (
    branchId: string
  ) => void;

  onToggleApproval: (
    versionId: string
  ) => void;

  onUpdateNote: (
    versionId: string,
    note: string
  ) => void;

  onCompare: (
    firstVersionId: string,
    secondVersionId: string
  ) => void;

  onClearHistory: () => void;
}

export default function Timeline({
  versions,
  allVersions,
  branches,
  activeVersionId,
  activeVersionIndex,
  activeBranchId,
  onSelectVersion,
  onRestoreVersion,
  onCreateBranch,
  onSwitchBranch,
  onRenameBranch,
  onDeleteBranch,
  onToggleApproval,
  onUpdateNote,
  onCompare,
  onClearHistory,
}: TimelineProps) {
  const [branchName, setBranchName] =
    useState("");

  const [
    showBranchCreator,
    setShowBranchCreator,
  ] = useState(false);

  const [
    editingBranchId,
    setEditingBranchId,
  ] = useState<string | null>(null);

  const [
    editingBranchName,
    setEditingBranchName,
  ] = useState("");

  const [
    editingNoteVersionId,
    setEditingNoteVersionId,
  ] = useState<string | null>(null);

  const [noteDraft, setNoteDraft] =
    useState("");

  const [
    compareFromId,
    setCompareFromId,
  ] = useState("");

  const [
    compareToId,
    setCompareToId,
  ] = useState("");

  const safeActiveIndex = Math.max(
    0,
    activeVersionIndex
  );

  const selectedVersion =
    versions.find(
      (version) =>
        version.id === activeVersionId
    ) ?? versions[safeActiveIndex];

  const handleCreateBranch = () => {
    const trimmedName =
      branchName.trim();

    if (!trimmedName) {
      return;
    }

    onCreateBranch(
      trimmedName,
      activeVersionId
    );

    setBranchName("");
    setShowBranchCreator(false);
  };

  const startBranchRename = (
    branch: CreativeBranch
  ) => {
    setEditingBranchId(branch.id);
    setEditingBranchName(branch.name);
  };

  const saveBranchRename = () => {
    if (!editingBranchId) {
      return;
    }

    onRenameBranch(
      editingBranchId,
      editingBranchName
    );

    setEditingBranchId(null);
    setEditingBranchName("");
  };

  const startNoteEditing = (
    version: CreativeVersion
  ) => {
    setEditingNoteVersionId(version.id);
    setNoteDraft(version.note ?? "");
  };

  const saveNote = () => {
    if (!editingNoteVersionId) {
      return;
    }

    onUpdateNote(
      editingNoteVersionId,
      noteDraft
    );

    setEditingNoteVersionId(null);
    setNoteDraft("");
  };

  const handleCompare = () => {
    if (
      !compareFromId ||
      !compareToId ||
      compareFromId === compareToId
    ) {
      return;
    }

    onCompare(
      compareFromId,
      compareToId
    );
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
            Rewind, compare, approve or branch any creative decision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {branches.map((branch) => {
            const active =
              branch.id === activeBranchId;

            const isMain =
              branch.name === "Main";

            return (
              <div
                key={branch.id}
                className="flex items-center"
              >
                {editingBranchId ===
                branch.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={
                        editingBranchName
                      }
                      onChange={(event) =>
                        setEditingBranchName(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter"
                        ) {
                          saveBranchRename();
                        }
                      }}
                      className="w-28 rounded-full border border-violet-300/25 bg-black/40 px-3 py-2 text-xs text-white outline-none"
                    />

                    <button
                      type="button"
                      onClick={
                        saveBranchRename
                      }
                      className="rounded-full border border-white/10 p-2 text-white/50 hover:bg-white/10"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        onSwitchBranch(
                          branch.id
                        )
                      }
                      className={`flex items-center gap-2 rounded-l-full border px-3 py-2 text-xs transition ${
                        active
                          ? "border-violet-300/25 bg-violet-400/15 text-violet-100"
                          : "border-white/10 bg-black/25 text-white/45 hover:bg-white/10"
                      }`}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      {branch.name}
                    </button>

                    <div className="group relative">
                      <button
                        type="button"
                        className="rounded-r-full border border-l-0 border-white/10 bg-black/25 px-2 py-2 text-white/35 hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>

                      <div className="invisible absolute right-0 top-full z-40 mt-2 w-36 rounded-xl border border-white/10 bg-[#181620] p-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() =>
                            startBranchRename(
                              branch
                            )
                          }
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/10"
                        >
                          <Pencil className="h-3 w-3" />
                          Rename
                        </button>

                        {!isMain && (
                          <button
                            type="button"
                            onClick={() =>
                              onDeleteBranch(
                                branch.id
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-300/70 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setShowBranchCreator(
                (current) => !current
              )
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
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden"
          >
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row">
              <input
                value={branchName}
                onChange={(event) =>
                  setBranchName(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    handleCreateBranch();
                  }
                }}
                placeholder="Example: Dark Cut"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-300/30"
              />

              <button
                type="button"
                onClick={
                  handleCreateBranch
                }
                disabled={
                  !branchName.trim()
                }
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create branch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-white/50" />

          <p className="text-sm text-white/70">
            Compare versions
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto]">
          <select
            value={compareFromId}
            onChange={(event) =>
              setCompareFromId(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-sm text-white/65 outline-none"
          >
            <option value="">
              Select first version
            </option>

            {allVersions.map(
              (version) => (
                <option
                  key={version.id}
                  value={version.id}
                >
                  {version.label}
                </option>
              )
            )}
          </select>

          <span className="hidden self-center text-white/25 md:block">
            →
          </span>

          <select
            value={compareToId}
            onChange={(event) =>
              setCompareToId(
                event.target.value
              )
            }
            className="rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-sm text-white/65 outline-none"
          >
            <option value="">
              Select second version
            </option>

            {allVersions.map(
              (version) => (
                <option
                  key={version.id}
                  value={version.id}
                >
                  {version.label}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={handleCompare}
            disabled={
              !compareFromId ||
              !compareToId ||
              compareFromId ===
                compareToId
            }
            className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compare
          </button>
        </div>
      </div>

      {versions.length > 1 && (
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <input
            type="range"
            min={0}
            max={versions.length - 1}
            value={safeActiveIndex}
            onChange={(event) => {
              const version =
                versions[
                  Number(
                    event.target.value
                  )
                ];

              if (version) {
                onSelectVersion(
                  version.id
                );
              }
            }}
            className="w-full accent-violet-300"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-white/35">
            <span>Origin</span>

            <span>
              Version{" "}
              {safeActiveIndex + 1} of{" "}
              {versions.length}
            </span>

            <span>Latest</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {versions.map(
          (version, index) => {
            const active =
              version.id ===
              activeVersionId;

            return (
              <motion.div
                layout
                key={version.id}
                className={`relative rounded-2xl border p-4 transition ${
                  active
                    ? "border-violet-300/30 bg-violet-400/[0.1]"
                    : "border-white/10 bg-black/25 hover:bg-white/[0.07]"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelectVersion(
                      version.id
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white/85">
                          {version.label}
                        </p>

                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
                          {version.source}
                        </span>

                        {version.approved && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-200">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            approved
                          </span>
                        )}

                        {active && (
                          <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-violet-200">
                            active
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-white/40">
                        {
                          version.description
                        }
                      </p>

                      {version.command && (
                        <p className="mt-2 text-xs text-violet-200/70">
                          Command: “
                          {version.command}”
                        </p>
                      )}

                      {version.note && (
                        <p className="mt-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs italic text-white/45">
                          {version.note}
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-white/30">
                      {new Date(
                        version.createdAt
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </button>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleApproval(
                        version.id
                      )
                    }
                    className="flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-white/50 hover:bg-white/10"
                  >
                    <Star
                      className={`h-3 w-3 ${
                        version.approved
                          ? "fill-emerald-200 text-emerald-200"
                          : ""
                      }`}
                    />

                    {version.approved
                      ? "Unapprove"
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startNoteEditing(
                        version
                      )
                    }
                    className="flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-white/50 hover:bg-white/10"
                  >
                    <Pencil className="h-3 w-3" />
                    Note
                  </button>

                  {!active && (
                    <button
                      type="button"
                      onClick={() =>
                        onRestoreVersion(
                          version.id
                        )
                      }
                      className="flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-white/50 hover:bg-white/10"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </button>
                  )}

                  <span className="ml-auto text-[10px] text-white/20">
                    v{index + 1}
                  </span>
                </div>

                <AnimatePresence>
                  {editingNoteVersionId ===
                    version.id && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 flex gap-2">
                        <input
                          value={noteDraft}
                          onChange={(event) =>
                            setNoteDraft(
                              event.target
                                .value
                            )
                          }
                          placeholder="Add a creative note..."
                          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none placeholder:text-white/25"
                        />

                        <button
                          type="button"
                          onClick={saveNote}
                          className="rounded-xl border border-white/10 bg-white/10 px-3 text-white/60 hover:bg-white/15"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }
        )}
      </div>

      {selectedVersion && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-white/35">
              Current timeline state
            </p>

            <p className="mt-1 text-sm text-white/70">
              {selectedVersion.label}
            </p>
          </div>

          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-2 rounded-full border border-red-300/10 bg-red-400/5 px-3 py-2 text-xs text-red-200/55 transition hover:bg-red-400/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset timeline
          </button>
        </div>
      )}
    </div>
  );
}