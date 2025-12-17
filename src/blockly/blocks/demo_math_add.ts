'use client';

import * as Blockly from 'blockly';

export const DEMO_MATH_ADD = 'demo_math_add';

/**
 * Блок "Сложить два числа" — простой демо-блок для "формул".
 * Пока только визуальный (без генерации JS-кода).
 */
export function registerDemoMathAdd() {
    Blockly.Blocks[DEMO_MATH_ADD] = {
        init() {
            this.appendDummyInput().appendField('Сложить два числа');

            this.appendValueInput('A')
                .setCheck('Number')
                .appendField('A');

            this.appendValueInput('B')
                .setCheck('Number')
                .appendField('B');

            this.setOutput(true, 'Number');
            this.setColour(200);
            this.setTooltip('Возвращает сумму A + B (визуально, без генерации кода)');
        },
    };

    // Здесь генератор кода тоже пока НЕ подключаем.
}
