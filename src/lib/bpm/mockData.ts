import type { BpmProcess } from './types';

export const mockProcesses: BpmProcess[] = [
    {
        id: 'onboarding',
        name: 'Онбординг нового сотрудника',
        description: 'Процесс адаптации нового сотрудника в компании.',
        owner: 'HR Отдел',
        status: 'active',
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-10T09:00:00Z',
        steps: [
            {
                id: 'step-1',
                name: 'Старт процесса',
                assignee: 'Система',
                status: 'done',
                order: 1,
                type: 'start',
            },
            {
                id: 'step-2',
                name: 'Оформление документов',
                assignee: 'HR менеджер',
                status: 'done',
                order: 2,
                type: 'task',
            },
            {
                id: 'step-3',
                name: 'Выдача оборудования',
                assignee: 'IT отдел',
                status: 'in_progress',
                order: 3,
                type: 'task',
            },
            {
                id: 'step-4',
                name: 'Обучение продукту',
                assignee: 'Team lead',
                status: 'pending',
                order: 4,
                type: 'end',
            },
        ],
    },
];
