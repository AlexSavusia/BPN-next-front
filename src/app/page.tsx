import Link from 'next/link';
import { mockProcesses } from '@/lib/bpm/mockData';
import type { BpmProcess } from '@/lib/bpm/types';
import { formatDateTime } from '@/lib/formatDate';


function statusLabel(status: BpmProcess['status']): string {
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

export default function HomePage() {
  return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">BPM Demo</h1>
            <p className="text-sm text-slate-500">
             Витрина
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Список процессов</h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Название
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Владелец
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Статус
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Обновлён
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody>
              {mockProcesses.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-slate-500">
                        {p.description}
                      </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{p.owner}</td>
                    <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {statusLabel(p.status)}
                    </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDateTime(p.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                          href={`/process/${p.id}`}
                          className="text-sm font-medium underline decoration-slate-400 underline-offset-4 hover:text-slate-900"
                      >
                        Открыть
                      </Link>
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
