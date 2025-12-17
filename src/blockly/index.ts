// src/blockly/index.ts
'use client';

import * as Blockly from 'blockly';

import { registerDemoStartBlock, DEMO_START } from './blocks/demo_start';
import { registerDemoMathAdd, DEMO_MATH_ADD } from './blocks/demo_math_add';
import {
    registerDemoDictionaryPick,
    DEMO_DICT_PICK,
} from './blocks/demo_dictionary_pick';
import {
    registerDemoOutputBlock,
    DEMO_OUTPUT,
} from './blocks/demo_output';

export type BlocklyMode = 'formula' | 'dictionary';

/** Регистрируем блоки в зависимости от режима. */
export async function registerBlocks(mode: BlocklyMode): Promise<void> {
    // Общие демо-блоки
    registerDemoStartBlock();
    registerDemoOutputBlock();

    if (mode === 'formula') {
        registerDemoMathAdd();
        // сюда потом добавишь все формульные блоки
    }

    if (mode === 'dictionary') {
        registerDemoDictionaryPick();
        // сюда потом добавишь все "справочные" блоки
    }
}

/** Строим тулбокс под конкретный режим. */
export function buildToolbox(mode: BlocklyMode): Blockly.utils.toolbox.ToolboxDefinition {
    const contents: Blockly.utils.toolbox.FlyoutItemInfoArray = [];

    contents.push({ kind: 'label', text: 'ДЕМО' }, { kind: 'sep', gap: 16 });

    // Общие
    contents.push({ kind: 'block', type: DEMO_START });

    if (mode === 'dictionary') {
        contents.push(
            { kind: 'block', type: DEMO_DICT_PICK },
            { kind: 'block', type: DEMO_OUTPUT },
        );
    }

    if (mode === 'formula') {
        contents.push(
            { kind: 'block', type: DEMO_MATH_ADD },
            { kind: 'block', type: DEMO_OUTPUT },
        );
    }

    return { kind: 'flyoutToolbox', contents };
}
