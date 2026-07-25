export type MuseNotificationType = 
    | "success"
    | "error"
    | "warning"
    | "info"
    | "loading";

export interface MuseNotification {
    id: string;
    type: MuseNotificationType;
    title: string;
    message?: string;
    createdAt: number;
    duration?: number;
    persistent?: boolean;
}

export interface CreateMuseNotification {
    id?: string;
    type?: MuseNotificationType;
    title: string;
    message?: string;
    duration?: number;
    persistent?: boolean;
}