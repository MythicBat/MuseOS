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
  CreativeVersionSource,
} from "@/types/creative";

import {
  cloneCreativeProject,
  createBranchId,
  createCreativeVersion,
} from "@/lib/creativeVersion";

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
    description: "The first Granite-generated creative universe.",
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

export function useCreativeHistory({
  initialProject,
}: UseCreativeHistoryOptions) {
  const [history, setHistory] = useState<CreativeHistoryState>(
    () => createInitialHistory(initialProject)
  );

  const {
    versions,
    branches,
    activeBranchId,
    activeVersionId,
  } = history;

  const activeVersion = useMemo(
    () =>
      versions.find(
        (version) => version.id === activeVersionId
      ) ?? versions[versions.length - 1],
    [activeVersionId, versions]
  );

  const activeBranch = useMemo(
    () =>
      branches.find(
        (branch) => branch.id === activeBranchId
      ) ?? branches[0],
    [activeBranchId, branches]
  );

  const branchVersions = useMemo(
    () =>
      versions
        .filter(
          (version) => version.branchId === activeBranchId
        )
        .sort((a, b) => a.createdAt - b.createdAt),
    [activeBranchId, versions]
  );

  const activeVersionIndex = branchVersions.findIndex(
    (version) => version.id === activeVersionId
  );

  const addVersion = useCallback(
    ({
      project,
      label,
      description,
      source,
      command,
    }: AddVersionOptions) => {
      let createdVersion: CreativeVersion | null = null;

      setHistory((current) => {
        const parentVersion =
          current.versions.find(
            (version) =>
              version.id === current.activeVersionId
          ) ??
          current.versions[current.versions.length - 1];

        createdVersion = createCreativeVersion({
          project,
          label,
          description,
          source,
          command,
          branchId: current.activeBranchId,
          parentVersionId: parentVersion?.id,
        });

        return {
          ...current,
          versions: [
            ...current.versions,
            createdVersion,
          ],
          branches: current.branches.map((branch) =>
            branch.id === current.activeBranchId
              ? {
                  ...branch,
                  headVersionId: createdVersion!.id,
                }
              : branch
          ),
          activeVersionId: createdVersion.id,
        };
      });

      return createdVersion;
    },
    []
  );

  const selectVersion = useCallback(
    (versionId: string) => {
      const version = versions.find(
        (item) => item.id === versionId
      );

      if (!version) return null;

      setHistory((current) => ({
        ...current,
        activeVersionId: version.id,
        activeBranchId: version.branchId,
      }));

      return cloneCreativeProject(version.project);
    },
    [versions]
  );

  const restoreVersion = useCallback(
    (versionId: string) => {
      const version = versions.find(
        (item) => item.id === versionId
      );

      if (!version) return null;

      const restoredProject = cloneCreativeProject(
        version.project
      );

      setHistory((current) => {
        const restoredVersion =
          createCreativeVersion({
            project: restoredProject,
            label: `Restored: ${version.label}`,
            description: `Restored from ${new Date(
              version.createdAt
            ).toLocaleString()}.`,
            source: "restore",
            branchId: current.activeBranchId,
            parentVersionId: current.activeVersionId,
          });

        return {
          ...current,
          versions: [
            ...current.versions,
            restoredVersion,
          ],
          branches: current.branches.map((branch) =>
            branch.id === current.activeBranchId
              ? {
                  ...branch,
                  headVersionId: restoredVersion.id,
                }
              : branch
          ),
          activeVersionId: restoredVersion.id,
        };
      });

      return restoredProject;
    },
    [versions]
  );

  const createBranch = useCallback(
    ({
      name,
      fromVersionId = activeVersionId,
    }: CreateBranchOptions) => {
      const originVersion = versions.find(
        (version) => version.id === fromVersionId
      );

      if (!originVersion) return null;

      const branchId = createBranchId();

      const branchOriginVersion =
        createCreativeVersion({
          project: originVersion.project,
          label: `${name} Origin`,
          description: `Branched from ${originVersion.label}.`,
          source: "restore",
          branchId,
          parentVersionId: originVersion.id,
        });

      const branch: CreativeBranch = {
        id: branchId,
        name,
        createdAt: Date.now(),
        parentBranchId: originVersion.branchId,
        originVersionId: branchOriginVersion.id,
        headVersionId: branchOriginVersion.id,
      };

      setHistory((current) => ({
        versions: [
          ...current.versions,
          branchOriginVersion,
        ],
        branches: [...current.branches, branch],
        activeBranchId: branch.id,
        activeVersionId: branchOriginVersion.id,
      }));

      return {
        branch,
        project: cloneCreativeProject(
          branchOriginVersion.project
        ),
      };
    },
    [activeVersionId, versions]
  );

  const switchBranch = useCallback(
    (branchId: string) => {
      const branch = branches.find(
        (item) => item.id === branchId
      );

      if (!branch) return null;

      const headVersion = versions.find(
        (version) =>
          version.id === branch.headVersionId
      );

      if (!headVersion) return null;

      setHistory((current) => ({
        ...current,
        activeBranchId: branch.id,
        activeVersionId: headVersion.id,
      }));

      return cloneCreativeProject(headVersion.project);
    },
    [branches, versions]
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
  };
}