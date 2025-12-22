'use client';

export default {
    __init__: ['restrictedPalette'],
    restrictedPalette: ['type', RestrictedPalette],
};

function RestrictedPalette(this: any, palette: any) {
    this.palette = palette;

    palette.registerProvider(this);
}

RestrictedPalette.$inject = ['palette'];

RestrictedPalette.prototype.getPaletteEntries = function () {
    // ВАЖНО: возвращаем только нужные кнопки.
    // bpmn-js использует factories, но проще всего — отдать свои actions,
    // которые создают элементы через create + elementFactory.

    return {}; // мы добавим реальные кнопки в следующем модуле (customPalette)
};
