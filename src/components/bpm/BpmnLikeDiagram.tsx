'use client';

import type { BpmProcess, BpmStep } from '@/lib/bpm/types';

interface Props {
    process: BpmProcess;
}

const COLUMN_WIDTH = 220;
const ROW_HEIGHT = 120;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;

type LaneName = string;

interface LayoutNode {
    step: BpmStep;
    laneIndex: number;
    colIndex: number;
    x: number;
    y: number;
}

function getNodeShapeClasses(step: BpmStep): string {
    switch (step.type) {
        case 'start':
            return 'px-6 py-2 rounded-full border-emerald-400 bg-emerald-50';
        case 'end':
            return 'px-6 py-2 rounded-full border-rose-400 bg-rose-50';
        case 'gateway':
            return 'px-3 py-2 rounded-lg border-amber-400 bg-amber-50';
        case 'task':
        default:
            return 'px-3 py-2 rounded-lg border-slate-300 bg-white';
    }
}

function getStepStatusColor(step: BpmStep): string {
    switch (step.status) {
        case 'done':
            return 'bg-emerald-100 text-emerald-700';
        case 'in_progress':
            return 'bg-sky-100 text-sky-700';
        case 'error':
            return 'bg-rose-100 text-rose-700';
        case 'pending':
        default:
            return 'bg-slate-100 text-slate-600';
    }
}

export function BpmnLikeDiagram({ process }: Props) {
    // Глобальный порядок шагов — это “sequence flow”
    const orderedSteps = [...process.steps].sort((a, b) => a.order - b.order);

    // Lane — это assignee
    const laneNames: LaneName[] = Array.from(
        new Set(orderedSteps.map((s) => s.assignee || '—')),
    );

    const laneIndexByName = new Map<LaneName, number>();
    laneNames.forEach((name, idx) => laneIndexByName.set(name, idx));

    // Размещаем каждый шаг в сетке: колонка = order-1, строка = laneIndex
    const layoutNodes: LayoutNode[] = orderedSteps.map((step) => {
        const laneIndex = laneIndexByName.get(step.assignee || '—') ?? 0;
        const colIndex = step.order - 1; // 1..N -> 0..N-1

        const x = colIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2;
        const y = laneIndex * ROW_HEIGHT + ROW_HEIGHT / 2;

        return { step, laneIndex, colIndex, x, y };
    });

    // Для стрелок нужно быстро находить узел по id
    const nodeById = new Map<string, LayoutNode>();
    layoutNodes.forEach((node) => nodeById.set(node.step.id, node));

    // Рёбра: просто “следующий шаг по порядку”
    const edges = orderedSteps.slice(0, -1).map((fromStep, index) => {
        const toStep = orderedSteps[index + 1];
        const fromNode = nodeById.get(fromStep.id)!;
        const toNode = nodeById.get(toStep.id)!;

        return {
            from: fromNode,
            to: toNode,
        };
    });

    const width = Math.max(orderedSteps.length * COLUMN_WIDTH, NODE_WIDTH + 40);
    const height = Math.max(laneNames.length * ROW_HEIGHT, NODE_HEIGHT + 40);

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
            <div
                className="relative"
                style={{
                    width,
                    height,
                    minWidth: '100%',
                }}
            >
                {/* SVG со стрелками поверх */}
                <svg
                    className="pointer-events-none absolute inset-0"
                    width={width}
                    height={height}
                >
                    <defs>
                        <marker
                            id="arrow-head"
                            markerWidth="10"
                            markerHeight="10"
                            refX="8"
                            refY="3"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path d="M0,0 L0,6 L9,3 z" fill="#cbd5f5" />
                        </marker>
                    </defs>

                    {edges.map(({ from, to }) => {
                        const isSameLane = from.laneIndex === to.laneIndex;

                        // Немного поднимаем/опускаем линию, если cross-lane,
                        // чтобы визуально было аккуратнее
                        const yOffset = isSameLane ? 0 : (to.laneIndex > from.laneIndex ? 8 : -8);

                        const startX = from.x + NODE_WIDTH / 2;
                        const startY = from.y + yOffset;
                        const endX = to.x - NODE_WIDTH / 2;
                        const endY = to.y + yOffset;

                        // Небольшая кривизна, чтобы стрелки чуть изгибались
                        const midX = (startX + endX) / 2;

                        const d = `M ${startX} ${startY}
                       C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

                        return (
                            <path
                                key={`${from.step.id}->${to.step.id}`}
                                d={d}
                                fill="none"
                                stroke="#cbd5f5"
                                strokeWidth={2}
                                markerEnd="url(#arrow-head)"
                            />
                        );
                    })}
                </svg>

                {/* Lane’ы (фоновая сетка) */}
                {laneNames.map((laneName, laneIdx) => {
                    const y = laneIdx * ROW_HEIGHT;

                    return (
                        <div
                            key={laneName}
                            className="absolute left-0 flex items-center"
                            style={{
                                top: y,
                                height: ROW_HEIGHT,
                                width: '100%',
                            }}
                        >
                            {/* Подпись lane слева */}
                            <div className="flex h-full w-40 items-center justify-end pr-2 border-r border-slate-200 bg-slate-50/60">
                                <div className="text-xs font-medium text-slate-600 text-right">
                                    {laneName}
                                </div>
                            </div>

                            {/* Фоновая линия lane */}
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                    );
                })}

                {/* Ноды (блоки процессов) */}
                {layoutNodes.map((node) => {
                    const { step, x, y } = node;

                    return (
                        <div
                            key={step.id}
                            className={[
                                'absolute flex flex-col gap-1 border shadow-sm ',
                                getNodeShapeClasses(step),
                            ].join(' ')}
                            style={{
                                left: x - NODE_WIDTH / 2,
                                top: y - NODE_HEIGHT / 2,
                                width: NODE_WIDTH,
                                height: NODE_HEIGHT,
                            }}
                        >
                            <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  #{step.order}
                </span>
                                {step.type && (
                                    <span className="text-[10px] uppercase text-slate-400">
                    {step.type}
                  </span>
                                )}
                            </div>
                            <div className="text-sm font-medium text-slate-800 truncate">
                                {step.name}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-400 truncate">
                  {step.assignee}
                </span>
                                <span
                                    className={[
                                        'inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-medium',
                                        getStepStatusColor(step),
                                    ].join(' ')}
                                >
                  {step.status}
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
