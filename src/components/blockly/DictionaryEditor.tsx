'use client';

import { useEffect, useRef, useState } from 'react';
import { buildToolbox, registerBlocks } from '@/blockly';

interface DictionaryEditorProps {
    dictionaryId: string;
}

export function DictionaryEditor({ dictionaryId }: DictionaryEditorProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let workspace: any;

        async function init() {
            try {
                const Blockly = await import('blockly');

                await registerBlocks('dictionary');

                if (!containerRef.current) return;

                workspace = Blockly.inject(containerRef.current, {
                    toolbox: buildToolbox('dictionary'),
                    trashcan: true,
                    scrollbars: true,
                });
            } catch (e) {
                console.error(e);
                setError('Не удалось инициализировать редактор справочников');
            }
        }

        init();

        return () => {
            if (workspace) {
                workspace.dispose();
            }
        };
    }, [dictionaryId]);

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-50">
            <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">Blockly-редактор справочника</div>
                <div className="text-xs text-slate-400">
                    Справочник ID: <code>{dictionaryId}</code>
                </div>
            </div>

            {error && (
                <div className="mb-2 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {error}
                </div>
            )}

            <div
                ref={containerRef}
                className="mt-2 h-[520px] w-full rounded-lg bg-slate-800"
            />
        </div>
    );
}
