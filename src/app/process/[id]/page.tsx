import { notFound } from 'next/navigation';
import { mockProcesses } from '@/lib/bpm/mockData';
import type { BpmProcess, BpmStep } from '@/lib/bpm/types';
import Link from 'next/link';
import { formatDateTime } from '@/lib/formatDate';
import { BpmnLikeDiagram } from '@/components/bpm/BpmnLikeDiagram';

interface PageProps {
    params: Promise<{ id: string }>;
}

function getStatusLabel(status: BpmProcess['status']): string {
    switch (status) {
        case 'draft':
            return 'Черновик';
        case 'active':
            return 'Активен';
        case 'completed':
            return 'Завершён';
        case 'suspended':
            return 'Приостановлен';
        default:
            return status;
    }
}

function getStepStatusLabel(status: BpmStep['status']): string {
    switch (status) {
        case 'pending':
            return 'Ожидает';
        case 'in_progress':
            return 'Выполняется';
        case 'done':
            return 'Готово';
        case 'error':
            return 'Ошибка';
        default:
            return status;
    }
}

function getStepStatusClasses(status: BpmStep['status']): string {
    switch (status) {
        case 'done':
            return 'bg-emerald-100 text-emerald-700';
        case 'in_progress':
            return 'bg-blue-100 text-blue-700';
        case 'error':
            return 'bg-rose-100 text-rose-700';
        case 'pending':
        default:
            return 'bg-slate-100 text-slate-600';
    }
}


export default async function ProcessPage({ params }: PageProps) {
    // ⬇️ вот главное отличие для Next 16
    const { id } = await params;

    const process = mockProcesses.find((p) => p.id === id);

    if (!process) {
        notFound();
    }

    const orderedSteps = [...process.steps].sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-8">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{process.name}</h1>
                    <p className="text-sm text-slate-500">
                        ID процесса: <code className="text-xs">{process.id}</code>
                    </p>
                </div>

                <Link
                    href="/"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                >
                    ← Ко всем процессам
                </Link>
            </header>

            {/* Общая информация */}
            <section className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                        Владелец
                    </div>
                    <div className="mt-2 text-sm text-slate-800">{process.owner}</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                        Статус
                    </div>
                    <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {getStatusLabel(process.status)}
            </span>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                        Обновлён
                    </div>
                    <div className="mt-2 text-sm text-slate-800">
                        {formatDateTime(process.updatedAt)}

                    </div>
                </div>
            </section>

            {/* Описание */}
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-medium">Описание процесса</h2>
                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    {process.description}
                </p>
            </section>

            {/* Диаграмма */}
            {/*<section className="mb-10">*/}
            {/*    <h2 className="mb-3 text-lg font-medium">Диаграмма (упрощённо)</h2>*/}

            {/*    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">*/}
            {/*        <div className="flex min-w-max items-center gap-4">*/}
            {/*            {orderedSteps.map((step, index) => (*/}
            {/*                <div key={step.id} className="flex items-center gap-4">*/}
            {/*                    <div className="flex min-w-[180px] flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm">*/}
            {/*                        <div className="text-xs uppercase tracking-wide text-slate-400">*/}
            {/*                            Шаг {step.order}*/}
            {/*                        </div>*/}
            {/*                        <div className="mt-1 text-sm font-medium text-slate-800">*/}
            {/*                            {step.name}*/}
            {/*                        </div>*/}
            {/*                        <div className="mt-1 text-xs text-slate-500">*/}
            {/*                            Исполнитель: {step.assignee}*/}
            {/*                        </div>*/}
            {/*                        <div className="mt-2">*/}
            {/*        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">*/}
            {/*          {getStepStatusLabel(step.status)}*/}
            {/*        </span>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    {index < orderedSteps.length - 1 && (*/}
            {/*                        <div className="flex items-center">*/}
            {/*                            <div className="h-[2px] w-10 bg-slate-300" />*/}
            {/*                            <div className="ml-[-4px] h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-slate-300" />*/}
            {/*                        </div>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            <section className="mb-10">
                <h2 className="mb-3 text-lg font-medium">Диаграмма процесса</h2>
                <BpmnLikeDiagram process={process} />
            </section>
            {/* Таблица шагов */}
            <section className="mb-10">
                <h2 className="mb-3 text-lg font-medium">Шаги процесса</h2>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                                Название шага
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                                Исполнитель
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                                Статус
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderedSteps.map((step) => (
                            <tr key={step.id} className="border-t border-slate-100">
                                <td className="px-4 py-3 text-xs text-slate-500">
                                    {step.order}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-800">
                                    {step.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">
                                    {step.assignee}
                                </td>
                                <td className="px-4 py-3 text-sm">
                   <span
                       className={[
                           'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                           getStepStatusClasses(step.status),
                       ].join(' ')}
                   >
  {getStepStatusLabel(step.status)}
</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
