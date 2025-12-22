import Link from "next/link";
import { BpmnEditor } from "@/components/bpm/BpmnEditor";
import '@/bpmn/styles.css';

export default function BpmnEditorPage() {
  return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">BPMN Editor</h1>
            <p className="text-sm text-slate-500">
              Редактор диаграммы бизнес-процесса (BPMN 2.0)
            </p>
          </div>

          <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100"
          >
            ← К процессам
          </Link>
        </header>

        <BpmnEditor />
      </main>
  );
}
