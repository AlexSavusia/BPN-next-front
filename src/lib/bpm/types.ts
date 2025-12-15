export type BpmStepStatus = 'pending' | 'in_progress' | 'done' | 'error';
export type BpmStepType = 'start' | 'task' | 'end' | 'gateway';

export interface BpmStep {
    id: string;
    name: string;
    assignee: string;
    status: BpmStepStatus;
    order: number;
    type?: BpmStepType; // <- опционально
}

export type BpmProcessStatus = 'draft' | 'active' | 'completed' | 'suspended';

export interface BpmProcess {
    id: string;
    name: string;
    description: string;
    owner: string;
    status: BpmProcessStatus;
    createdAt: string;
    updatedAt: string;
    steps: BpmStep[];
}
