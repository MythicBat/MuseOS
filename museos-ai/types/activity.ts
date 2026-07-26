export type MuseActivityType = 
    | "generation"
    | "export"
    | "project"
    | "error"
    | "system";

export type MuseActivityStatus = 
    | "success"
    | "error"
    | "info";

export interface MuseActivity {
    id: string;
    type: MuseActivityType;
    status: MuseActivityStatus;
    title: string;
    message?: string;
    projectId?: string;
    projectTitle?: string;
    createdAt: number;
    readAt?: number;
}

export interface CreateMuseActivity {
    id?: string;
    type: MuseActivityType;
    status?: MuseActivityStatus;
    title: string;
    message?: string;
    projectId?: string;
    projectTitle?: string;
}