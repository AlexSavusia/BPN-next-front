'use client';

import * as Blockly from 'blockly';

export const DEMO_DICT_PICK = 'demo_dictionary_pick';

// Мок-справочник ролей
const MOCK_DICT = [
    { id: 'manager', label: 'Менеджер' },
    { id: 'developer', label: 'Разработчик' },
    { id: 'designer', label: 'Дизайнер' },
];

/**
 * Блок "Выбрать значение из справочника" — демо для справочников.
 * Пока только визуальный, без генерации кода.
 */
export function registerDemoDictionaryPick() {
    Blockly.Blocks[DEMO_DICT_PICK] = {
        init() {
            this.appendDummyInput().appendField('Выбрать значение из справочника');

            this.appendDummyInput()
                .appendField('Роль')
                .appendField(
                    new Blockly.FieldDropdown(
                        MOCK_DICT.map((item) => [item.label, item.id]),
                    ),
                    'ROLE',
                );

            this.setOutput(true, 'String');
            this.setColour(120);
            this.setTooltip('Возвращает выбранную роль из мок-справочника (визуально)');
        },
    };

    // Генератор кода специально НЕ регистрируем, чтобы не триггерить ошибки
    // от Turbopack/Next по поводу JavaScript-экспортов из blockly.
}
