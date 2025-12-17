'use client';

import { useEffect, useRef, useState } from 'react';
import { buildToolbox, registerBlocks } from '@/blockly';

interface FormulaEditorProps {
    formulaId: string;
}

export function FormulaEditor({ formulaId }: FormulaEditorProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let workspace: any;

        async function init() {
            try {
                const Blockly = await import('blockly');

                await registerBlocks('formula');

                if (!containerRef.current) return;

                containerRef.current.innerHTML = ''; // 👈

                workspace = Blockly.inject(containerRef.current, {
                    toolbox: buildToolbox('formula'),
                    trashcan: true,
                    scrollbars: true,
                });
            } catch (e) {
                console.error(e);
                setError('Не удалось инициализировать редактор формул');
            }
        }

        init();

        return () => {
            if (workspace) {
                workspace.dispose();
                workspace = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = ''; // 👈
            }
        };
    }, [formulaId]);


    return (
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-50">
            <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">Blockly-редактор формулы</div>
                <div className="text-xs text-slate-400">
                    Формула ID: <code>{formulaId}</code>
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
