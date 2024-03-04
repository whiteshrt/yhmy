// src/types/interfaces.ts

export interface IUser {
    name: string;
    password: string; // Inclure selon les besoins de sécurité et d'accessibilité
    projects: IProject[];
    tasksCreated: ITask[];
    tasksAssigned: ITaskAssignment[];
    accesses: IAccess[];
}

export interface IProject {
    id: number;
    title: string;
    description: string;
    managerName: string;
    tasks: ITask[];
    accesses: IAccess[];
}

export enum TaskStatus {
    ToDo = 0,
    InProgress = 1,
    Done = 2,
    Unknown = -1
}
export interface ITask {
    id: number;
    title: string;
    description?: string;
    projectId: number;
    effort: number;
    status: TaskStatus;
    authorName: string;
    assignees: ITaskAssignment[];
}

export interface ITaskAssignment {
    taskId: number;
    userName: string;
}

export interface IAccess {
    projectId: number;
    employeeName: string;
    accessType: string;
}
