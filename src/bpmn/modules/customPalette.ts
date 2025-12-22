'use client';

export default {
    __init__: ['customPalette'],
    customPalette: ['type', CustomPalette],
};

function CustomPalette(this: any, palette: any, create: any, elementFactory: any, translate: any) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
}

CustomPalette.$inject = ['palette', 'create', 'elementFactory', 'translate'];

CustomPalette.prototype.getPaletteEntries = function () {
    const createAction = (type: string, group: string, className: string, title: string) => {
        const { create, elementFactory } = this;

        function createListener(event: any) {
            const shape = elementFactory.createShape({ type });
            create.start(event, shape);
        }

        return {
            group,
            className,
            title: this.translate(title),
            action: {
                dragstart: createListener,
                click: createListener,
            },
        };
    };

    return {
        // START
        'create.start-event': createAction(
            'bpmn:StartEvent',
            'event',
            'bpmn-icon-start-event-none',
            'Start'
        ),

        // TASK
        'create.task': createAction(
            'bpmn:Task',
            'activity',
            'bpmn-icon-task',
            'Task'
        ),

        // GATEWAY
        'create.exclusive-gateway': createAction(
            'bpmn:ExclusiveGateway',
            'gateway',
            'bpmn-icon-gateway-xor',
            'Gateway (XOR)'
        ),

        // END
        'create.end-event': createAction(
            'bpmn:EndEvent',
            'event',
            'bpmn-icon-end-event-none',
            'End'
        ),

        // ANNOTATION (опционально)
        'create.text-annotation': createAction(
            'bpmn:TextAnnotation',
            'artifact',
            'bpmn-icon-text-annotation',
            'Text Annotation'
        ),
    };
};
