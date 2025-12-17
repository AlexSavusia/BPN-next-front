import Link from 'next/link';
import { DictionaryEditor } from '@/components/blockly/DictionaryEditor';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DictionaryPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-8">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Редактор справочника</h1>
                    <p className="text-sm text-slate-500">
                        ID справочника: <code className="text-xs">{id}</code>
                    </p>
                </div>

                <Link
                    href="/"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                >
                    ← К процессам
                </Link>
            </header>

            <DictionaryEditor dictionaryId={id} />
        </main>
    );
}
