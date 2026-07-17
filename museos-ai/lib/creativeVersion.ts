import {
    CreativeProject,
    CreativeVersion,
    CreativeVersionSource,
} from "@/types/creative";

interface CreateCreativeVersionOptions {
    project: CreativeProject;
    label: string;
    description: string;
    source: CreativeVersionSource;
    branchId: string;
    command?: string;
    parentVersionId?: string;
}

export function cloneCreativeProject(
    project: CreativeProject
) : CreativeProject {
    return {
        ...project,
        dna: {
            ...project.dna,
            colors: [...project.dna.colors],
        },
        sections: project.sections.map((section) => ({
            ...section,
        })),
        agents: project.agents.map((agent) => ({
            ...agent,
        })),
        outputs: {
            ...project.outputs,
        },
        nodes: project.nodes.map((node) => ({
            ...node,
        })),
        edges: project.edges.map((edge) => ({
            ...edge,
        })),
    };
}

export function createCreativeVersion({
    project,
    label,
    description,
    source,
    branchId,
    command,
    parentVersionId,
}: CreateCreativeVersionOptions): CreativeVersion {
    return {
        id: createVersionId(),
        label,
        description,
        createdAt: Date.now(),
        source,
        command,
        parentVersionId,
        branchId,
        project: cloneCreativeProject(project),
    };
}

export function createVersionId(): string {
    return `version-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createBranchId(): string {
    return `branch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}