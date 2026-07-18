"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  CreativeBranch,
  CreativeProject,
  CreativeVersion,
  CreativeVersionComparison,
  CreativeVersionSource,
} from "@/types/creative";

import {
  cloneCreativeProject,
  createBranchId,
  createCreativeVersion,
} from "@/lib/creativeVersion";

import { compareCreativeVersions } from "@/lib/compareCreativeVersions";

interface AddVersionOptions {
  project: CreativeProject;
  label: string;
  description: string;
  source: CreativeVersionSource;
  command?: string;
}

interface CreateBranchOptions {
  name: string;
  fromVersionId?: string;
}

interface UseCreativeHistoryOptions {
  initialProject: CreativeProject;
  storageKey?: string;
}

interface CreativeHistoryState {
  versions: CreativeVersion[];
  branches: CreativeBranch[];
  activeBranchId: string;
  activeVersionId: string;
}

function createInitialHistory(
  project: CreativeProject
): CreativeHistoryState {
  const mainBranchId = createBranchId();

  const initialVersion = createCreativeVersion({
    project,
    label: "Original Universe",
    description:
      "The first Granite-generated creative universe.",
    source: "generation",
    branchId: mainBranchId,
  });

  const mainBranch: CreativeBranch = {
    id: mainBranchId,
    name: "Main",
    createdAt: Date.now(),
    originVersionId: initialVersion.id,
    headVersionId: initialVersion.id,
  };

  return {
    versions: [initialVersion],
    branches: [mainBranch],
    activeBranchId: mainBranchId,
    activeVersionId: initialVersion.id,
  };
}

function loadStoredHistory(
  storageKey: string
): CreativeHistoryState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(
      stored
    ) as CreativeHistoryState;

    if (
      !Array.isArray(parsed.versions) ||
      !Array.isArray(parsed.branches) ||
      !parsed.activeBranchId ||
      !parsed.activeVersionId
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to restore MuseOS history:",
      error
    );

    return null;
  }
}

export function useCreativeHistory({
  initialProject,
  storageKey = "museos-creative-history",
}: UseCreativeHistoryOptions) {
  const [history, setHistory] =
    useState<CreativeHistoryState>(() => {
      return (
        loadStoredHistory(storageKey) ??
        createInitialHistory(initialProject)
      );
    });

  const {
    versions,
    branches,
    activeBranchId,
    activeVersionId,
  } = history;

  const updateHistory = useCallback(
    (
      updater:
        | CreativeHistoryState
        | ((
            current: CreativeHistoryState
          ) => CreativeHistoryState)
    ) => {
      setHistory((current) => {
        const next =
          typeof updater === "function"
            ? updater(current)
            : updater;

        try {
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(next)
          );
        } catch (error) {
          console.error(
            "Failed to persist MuseOS history:",
            error
          );
        }

        return next;
      });
    },
    [storageKey]
  );

  const activeVersion = useMemo(
    () =>
      versions.find(
        (version) =>
          version.id === activeVersionId
      ) ?? versions[versions.length - 1],
    [activeVersionId, versions]
  );

  const activeBranch = useMemo(
    () =>
      branches.find(
        (branch) =>
          branch.id === activeBranchId
      ) ?? branches[0],
    [activeBranchId, branches]
  );

  const branchVersions = useMemo(
    () =>
      versions
        .filter(
          (version) =>
            version.branchId === activeBranchId
        )
        .sort(
          (first, second) =>
            first.createdAt - second.createdAt
        ),
    [activeBranchId, versions]
  );

  const activeVersionIndex =
    branchVersions.findIndex(
      (version) =>
        version.id === activeVersionId
    );

  const addVersion = useCallback(
    ({
      project,
      label,
      description,
      source,
      command,
    }: AddVersionOptions) => {
      let createdVersion:
        | CreativeVersion
        | null = null;

      updateHistory((current) => {
        const parentVersion =
          current.versions.find(
            (version) =>
              version.id ===
              current.activeVersionId
          ) ??
          current.versions[
            current.versions.length - 1
          ];

        createdVersion =
          createCreativeVersion({
            project,
            label,
            description,
            source,
            command,
            branchId:
              current.activeBranchId,
            parentVersionId:
              parentVersion?.id,
          });

        return {
          ...current,

          versions: [
            ...current.versions,
            createdVersion,
          ],

          branches:
            current.branches.map((branch) =>
              branch.id ===
              current.activeBranchId
                ? {
                    ...branch,
                    headVersionId:
                      createdVersion!.id,
                  }
                : branch
            ),

          activeVersionId:
            createdVersion.id,
        };
      });

      return createdVersion;
    },
    [updateHistory]
  );

  const selectVersion = useCallback(
    (versionId: string) => {
      const version = versions.find(
        (item) => item.id === versionId
      );

      if (!version) {
        return null;
      }

      updateHistory((current) => ({
        ...current,
        activeVersionId: version.id,
        activeBranchId: version.branchId,
      }));

      return cloneCreativeProject(
        version.project
      );
    },
    [updateHistory, versions]
  );

  const restoreVersion = useCallback(
    (versionId: string) => {
      const version = versions.find(
        (item) => item.id === versionId
      );

      if (!version) {
        return null;
      }

      const restoredProject =
        cloneCreativeProject(version.project);

      updateHistory((current) => {
        const restoredVersion =
          createCreativeVersion({
            project: restoredProject,

            label: `Restored: ${version.label}`,

            description: `Restored from ${new Date(
              version.createdAt
            ).toLocaleString()}.`,

            source: "restore",

            branchId:
              current.activeBranchId,

            parentVersionId:
              current.activeVersionId,
          });

        return {
          ...current,

          versions: [
            ...current.versions,
            restoredVersion,
          ],

          branches:
            current.branches.map((branch) =>
              branch.id ===
              current.activeBranchId
                ? {
                    ...branch,
                    headVersionId:
                      restoredVersion.id,
                  }
                : branch
            ),

          activeVersionId:
            restoredVersion.id,
        };
      });

      return restoredProject;
    },
    [updateHistory, versions]
  );

  const createBranch = useCallback(
    ({
      name,
      fromVersionId = activeVersionId,
    }: CreateBranchOptions) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return null;
      }

      const originVersion =
        versions.find(
          (version) =>
            version.id === fromVersionId
        );

      if (!originVersion) {
        return null;
      }

      const branchId = createBranchId();

      const branchOriginVersion =
        createCreativeVersion({
          project: originVersion.project,
          label: `${trimmedName} Origin`,
          description: `Branched from ${originVersion.label}.`,
          source: "restore",
          branchId,
          parentVersionId:
            originVersion.id,
        });

      const branch: CreativeBranch = {
        id: branchId,
        name: trimmedName,
        createdAt: Date.now(),
        parentBranchId:
          originVersion.branchId,
        originVersionId:
          branchOriginVersion.id,
        headVersionId:
          branchOriginVersion.id,
      };

      updateHistory((current) => ({
        versions: [
          ...current.versions,
          branchOriginVersion,
        ],

        branches: [
          ...current.branches,
          branch,
        ],

        activeBranchId: branch.id,
        activeVersionId:
          branchOriginVersion.id,
      }));

      return {
        branch,
        project: cloneCreativeProject(
          branchOriginVersion.project
        ),
      };
    },
    [
      activeVersionId,
      updateHistory,
      versions,
    ]
  );

  const switchBranch = useCallback(
    (branchId: string) => {
      const branch = branches.find(
        (item) => item.id === branchId
      );

      if (!branch) {
        return null;
      }

      const headVersion = versions.find(
        (version) =>
          version.id ===
          branch.headVersionId
      );

      if (!headVersion) {
        return null;
      }

      updateHistory((current) => ({
        ...current,
        activeBranchId: branch.id,
        activeVersionId: headVersion.id,
      }));

      return cloneCreativeProject(
        headVersion.project
      );
    },
    [
      branches,
      updateHistory,
      versions,
    ]
  );

  const renameBranch = useCallback(
    (
      branchId: string,
      name: string
    ) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return false;
      }

      updateHistory((current) => ({
        ...current,

        branches:
          current.branches.map((branch) =>
            branch.id === branchId
              ? {
                  ...branch,
                  name: trimmedName,
                }
              : branch
          ),
      }));

      return true;
    },
    [updateHistory]
  );

  const deleteBranch = useCallback(
    (branchId: string) => {
      const branch =
        branches.find(
          (item) => item.id === branchId
        );

      if (!branch || branch.name === "Main") {
        return null;
      }

      const mainBranch =
        branches.find(
          (item) => item.name === "Main"
        ) ?? branches[0];

      const mainHead =
        versions.find(
          (version) =>
            version.id ===
            mainBranch.headVersionId
        );

      if (!mainHead) {
        return null;
      }

      updateHistory((current) => ({
        versions:
          current.versions.filter(
            (version) =>
              version.branchId !== branchId
          ),

        branches:
          current.branches.filter(
            (item) => item.id !== branchId
          ),

        activeBranchId:
          current.activeBranchId === branchId
            ? mainBranch.id
            : current.activeBranchId,

        activeVersionId:
          current.activeBranchId === branchId
            ? mainHead.id
            : current.activeVersionId,
      }));

      return cloneCreativeProject(
        mainHead.project
      );
    },
    [
      branches,
      updateHistory,
      versions,
    ]
  );

  const toggleVersionApproval =
    useCallback(
      (versionId: string) => {
        updateHistory((current) => ({
          ...current,

          versions:
            current.versions.map(
              (version) =>
                version.id === versionId
                  ? {
                      ...version,
                      approved:
                        !version.approved,
                    }
                  : version
            ),
        }));
      },
      [updateHistory]
    );

  const updateVersionNote = useCallback(
    (
      versionId: string,
      note: string
    ) => {
      updateHistory((current) => ({
        ...current,

        versions:
          current.versions.map(
            (version) =>
              version.id === versionId
                ? {
                    ...version,
                    note,
                  }
                : version
          ),
      }));
    },
    [updateHistory]
  );

  const compareVersions = useCallback(
    (
      fromVersionId: string,
      toVersionId: string
    ): CreativeVersionComparison | null => {
      const fromVersion =
        versions.find(
          (version) =>
            version.id === fromVersionId
        );

      const toVersion =
        versions.find(
          (version) =>
            version.id === toVersionId
        );

      if (!fromVersion || !toVersion) {
        return null;
      }

      return compareCreativeVersions(
        fromVersion,
        toVersion
      );
    },
    [versions]
  );

  const clearStoredHistory = useCallback(
    () => {
      const next =
        createInitialHistory(initialProject);

      try {
        window.localStorage.removeItem(
          storageKey
        );
      } catch (error) {
        console.error(
          "Failed to clear history:",
          error
        );
      }

      setHistory(next);

      return cloneCreativeProject(
        next.versions[0].project
      );
    },
    [initialProject, storageKey]
  );

  return {
    versions,
    branches,

    activeVersion,
    activeVersionId,
    activeVersionIndex,

    activeBranch,
    activeBranchId,
    branchVersions,

    addVersion,
    selectVersion,
    restoreVersion,

    createBranch,
    switchBranch,
    renameBranch,
    deleteBranch,

    toggleVersionApproval,
    updateVersionNote,

    compareVersions,
    clearStoredHistory,
  };
}