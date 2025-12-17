'use client';

import * as Blockly from 'blockly';

export const DEMO_OUTPUT = 'demo_output';

/**
 * Блок "Вывести" — просто финальный блок для визуальной демонстрации.
 */
export function registerDemoOutputBlock() {
    Blockly.Blocks[DEMO_OUTPUT] = {
        init() {
            this.appendValueInput('VALUE').appendField('Вывести');
            this.setPreviousStatement(true);
            this.setColour(300);
            this.setTooltip('Финальный блок вывода (визуально)');
        },
    };

    // Здесь тоже генерации кода нет.
}
