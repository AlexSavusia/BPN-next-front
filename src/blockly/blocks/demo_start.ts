'use client';

import * as Blockly from 'blockly';

export const DEMO_START = 'demo_start';

/**
 * Стартовый блок демо-процесса.
 * Точка входа, без генерации кода.
 */
export function registerDemoStartBlock() {
    Blockly.Blocks[DEMO_START] = {
        init() {
            this.appendDummyInput().appendField('Старт');
            this.setNextStatement(true);
            this.setColour(230);
            this.setTooltip('Начало выполнения логики процесса (визуально)');
        },
    };
}
