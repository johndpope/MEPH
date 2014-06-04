/**
 * @class MEPH.pad.DrawingSurface
 * Creates a canvas that can be drawn on with a mouse or by touch.
 **/
MEPH.define('MEPH.pad.DrawingSurface', {
    alias: 'drawingsurface',
    templates: true,
    requires: ['MEPH.util.Renderer'],
    extend: 'MEPH.control.Control',
    properties: {
        $renderer: null,
        painting: false,
        drawing: null,
        currentStroke: null,
        strokes: null,
        strokeStyle: null,
        miterLimit: null,
        lineJoin: null,
        fillStyle: null,
        lineWidth: null,
        canvasSelector: 'canvas.drawing-surface-canvas'
    },
    initialize: function () {
        var me = this;
        me.drawing = [];
        me.cache = [];
        me.strokes = [];
        me.callParent.apply(me, arguments);
        me.$renderer = new Renderer();

    },
    getRenderer: function () {
        var me = this;
        return me.$renderer;
    },
    onLoaded: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.getRenderer().setCanvas(me.querySelector(me.canvasSelector));
        me.appendEvents();
    },
    /**
     * Appends events to the canvas.
     */
    appendEvents: function () {
        var me = this,
            canvas;
        canvas = me.querySelector(me.canvasSelector);
        me.canvas = canvas;
        me.canvasPos = me.getPosition(me.canvas);
        canvas.addEventListener('touchstart', me.onCanvasMouseDown.bind(me), false);
        canvas.addEventListener('mousedown', me.onCanvasMouseDown.bind(me), false);
        canvas.addEventListener('mouseup', me.onCanvasMouseUp.bind(me), false);
        canvas.addEventListener('touchend', me.onCanvasMouseUp.bind(me), false);
        canvas.addEventListener('mouseleave', me.onCanvasMouseLeave.bind(me), false);
        canvas.addEventListener('touchleave', me.onCanvasMouseLeave.bind(me), false);
        canvas.addEventListener('mousemove', me.onCanvasMouseMove.bind(me), false);
        canvas.addEventListener('touchmove', me.onCanvasMouseMove.bind(me), false);
        document.addEventListener('touchmove', me.onDocumentMove.bind(me), false);
    },
    onDocumentMove: function (evt) {
        var me = this;
        if (me.painting) {
            return false;
        }
    },
    draw: function () {
        var me = this, instructions;
        requestAnimationFrame(function () {
            instructions = me.getInstructions();
            if (instructions.length > 1) {
                //me.drawing = [me.drawing.last()];
                me.getRenderer().draw(instructions);
            }
        });
    },

    getInstructions: function () {
        var me = this,
            result = [], group,
            instructionGroups;
        instructionGroups = me.drawing.groupBy(function (x) { return x.id; });
        for (group in instructionGroups) {
            result = result.concat(instructionGroups[group].select(function (x, index) {
                if (index > 0) {
                    return {
                        shape: MEPH.util.Renderer.shapes.line,
                        fillStyle: me.fillStyle,
                        lineWidth: me.lineWidth,
                        lineJoin: me.lineJoin,
                        miterLimit: me.miterLimit,
                        strokeStyle: me.strokeStyle,
                        start: {
                            x: instructionGroups[group][index - 1].x,
                            y: instructionGroups[group][index - 1].y
                        },
                        end: {
                            x: x.x,
                            y: x.y
                        }
                    }
                }
                return null;
            }).where(function (x) { return x; }));
        }
        return result;
    },
    onCanvasMouseMove: function (evt) {
        var me = this, pos = me.canvasPos;;
        if (me.painting) {
            if (evt.changedTouches) {
                for (i = evt.changedTouches.length; i--;) {
                    touch = evt.changedTouches[i];
                    me.addDraw(touch.pageX - pos.x, touch.pageY - pos.y, touch.identifier);
                }
            }
            else {
                me.addDraw(evt.offsetX || evt.pageX, evt.offsetY || evt.pageY, -1);

            }
            evt.preventDefault();
        }
    },
    getPosition: function (element) {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    },
    onCanvasMouseLeave: function () {
        var me = this;
        me.strokeOver();
    },
    onCanvasMouseUp: function (evt) {
        var me = this;
        me.strokeOver();
    },
    strokeOver: function () {
        var me = this;
        if (me.currentStroke) {
            me.strokes.push(me.currentStroke);
            me.currentStroke = null;
        }
        me.drawing = [];
        me.painting = false;
    },
    onCanvasMouseDown: function (evt) {
        var i,
            me = this, pos = me.canvasPos,
            touch;
        me.painting = true;
        me.currentStroke = [];
        if (evt.changedTouches) {
            for (i = evt.changedTouches.length; i--;) {
                touch = evt.changedTouches[i];
                me.addDraw(touch.pageX - pos.x, touch.pageY - pos.y, touch.identifier);
            }
        }
        else {
            me.addDraw(evt.offsetX || evt.pageX, evt.offsetY || evt.pageY, -1);

        }
    },
    addDraw: function (x, y, id) {
        var me = this;
        me.drawing.push({ x: x, y: y, id: id });
        me.currentStroke.push({
            x: x,
            y: y,
            id: id
        });
        me.draw();
    }
});