'use client';

export default {
    __init__: ['restrictedContextPad'],
    restrictedContextPad: ['type', RestrictedContextPad],
};

function RestrictedContextPad(this: any, contextPad: any) {
    this.contextPad = contextPad;
    contextPad.registerProvider(this);
}

RestrictedContextPad.$inject = ['contextPad'];

RestrictedContextPad.prototype.getContextPadEntries = function () {
    // Возвращаем пусто -> скрываем стандартные действия (замены, append-и и т.п.)
    // Соединение стрелкой останется через “протянуть” (connect tool) + палитра,
    // либо можно вручную добавить connect кнопку (если захочешь).
    return {};
};
