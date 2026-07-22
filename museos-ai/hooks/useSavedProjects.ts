"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CreativeProject, SavedCreativeProject } from "@/types/creative";
import { cloneCreativeProject } from "@/lib/creativeVersion";

const STORAGE_KEY = "museos-saved-projects-v1";

interface StoredProjectState {
    projects: SavedCreativeProject[];
    activeProjectId: string | null;
}

function createEmptyState(): StoredProjectState {
    return {
        projects: [],
        activeProjectId: null,
    };
}

function createProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

function readStoredProjects(): StoredProjectState {
    if (typeof window === "undefined") {
        return createEmptyState();
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return createEmptyState();
        }

        const parsed = JSON.parse(stored) as Partial<StoredProjectState>;

        const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

        const activeProjectId = typeof parsed.activeProjectId === "string" &&
            projects.some((project) => project.id === parsed.activeProjectId)
            ? parsed.activeProjectId : projects[0]?.id ?? null;

        return {
            projects,
            activeProjectId,
        };
    } catch (error) {
        console.error("Unable to load MuseOS projects:", error);

        return createEmptyState();
    }
}

export function useSavedProjects() {
    const [state, setState] = useState<StoredProjectState>(createEmptyState);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        queueMicrotask(() => {
            if (cancelled) return;

            setState(readStoredProjects());
            setHasHydrated(true);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!hasHydrated || typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Unable to save MuseOS projects:", error);
        }
    }, [hasHydrated, state]);

    const activeProject = useMemo(
        () => state.projects.find(
            (project) => project.id === state.activeProjectId
        ) ?? null,
        [
            state.activeProjectId,
            state.projects,
        ]
    );

    const saveProject = useCallback(
        (project: CreativeProject, existingId?: string): string => {
            const now = Date.now();
            const projectId = existingId || createProjectId();

            setState((current) => {
                const existing = current.projects.find(
                    (item) => item.id === projectId
                );

                const savedProject: SavedCreativeProject = 
                    {
                        id: projectId,
                        title: project.title || "Untitled project",
                        project: cloneProjectForStorage(project),
                        createdAt: existing?.createdAt ?? now,
                        updatedAt: now,
                        lastOpenedAt: now,
                    };

                return {
                    projects: [
                        savedProject,
                        ...current.projects.filter(
                            (item) => item.id !== projectId
                        ),
                    ],
                    activeProjectId: projectId,
                };
            });

            return projectId;
        },
        []
    );

    const openProject = useCallback(
        (projectId: string) => {
            const now = Date.now();

            setState((current) => ({
                activeProjectId: projectId,
                projects: current.projects.map((project) => project.id === projectId ? {
                    ...project,
                    lastOpenedAt: now,
                } : project),
            }));
        },
        []
    );

    const closeProject = useCallback(() => {
        setState((current) => ({
            ...current,
            activeProjectId: null,
        }));
    }, []);

    const renameProject = useCallback(
        (projectId: string, title: string) => {
            const normalizedTitle = title.trim();

            if (!normalizedTitle) return;

            setState((current) => ({
                ...current,
                projects: current.projects.map((project) => project.id === projectId ? {
                    ...project,
                    title: normalizedTitle,
                    project: {...project.project, title: normalizedTitle},
                    updatedAt: Date.now(),
                } : project),
            }));
        },
        []
    );

    const duplicateProject = useCallback(
        (projectId: string) => {
            setState((current) => {
                const source = current.projects.find((project) => project.id === projectId);

                if (!source) {
                    return current;
                }

                const now = Date.now();
                const duplicateId = createProjectId();

                const duplicate: SavedCreativeProject = {
                    ...source,
                    id: duplicateId,
                    title: `${source.title} Copy`,
                    project: cloneProjectForStorage(source.project, `${source.title} Copy`),
                    createdAt: now,
                    updatedAt: now,
                    lastOpenedAt: now,
                };

                return {
                    projects: [
                        duplicate,
                        ...current.projects,
                    ],
                    activeProjectId: duplicateId,
                };
            });
        },
        []
    );

    const deleteProject = useCallback(
        (projectId: string) => {
            setState((current) => {
                const nextProjects = current.projects.filter((project) => project.id !== projectId);

                return {
                    projects: nextProjects,
                    activeProjectId: current.activeProjectId === projectId ? nextProjects[0]?.id ?? null : current.activeProjectId,
                };
            });
        },
        []
    );

    const clearProjects = useCallback(() => {
        setState(createEmptyState());
    }, []);

    return {
        projects: state.projects,
        activeProject,
        activeProjectId: state.activeProjectId,
        hasHydrated,
        saveProject,
        openProject,
        closeProject,
        renameProject,
        duplicateProject,
        deleteProject,
        clearProjects
    };
}

function cloneProjectForStorage(
  project: CreativeProject,
  title?: string
): CreativeProject {
  const cloned =
    typeof structuredClone ===
    "function"
      ? structuredClone(project)
      : JSON.parse(
          JSON.stringify(project)
        ) as CreativeProject;

  return {
    ...cloned,
    title: title ?? cloned.title,
  };
}