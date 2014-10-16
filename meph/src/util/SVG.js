/**
 * @class MEPH.util.SVG
 * String
 */
MEPH.define('MEPH.util.SVG', {
    requires: ['MEPH.util.Vector'],
    statics: {
        shapes: {
            rectangle: 'rectangle',
            circle: 'circle',
            text: 'text',
            line: 'line',
            canvas: 'canvas'
        },
        defaultShapeOptions: {
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            radius: 100,
            textBaseline: "middle",
            maxWidth: 1000,
            fillStyle: '#000000',
            strokeStyle: '#000000',
            fill: '#000000',
            strokeWidth: '2px',
            font: '22px Verdana',
            stroke: true
        }
    },
    properties: {
        parts: null
    },
    initialize: function () {
        var me = this;
        me.parts = [];
        me.unused = [];
    },
    setCanvas: function (svg) {
        var me = this;
        me.$svg = svg;
    },
    getCanvas: function () {
        var me = this;
        return me.$svg;
    },
    getContext: function () {
        var me = this;
        me.$svg = me.$svg || me.getCanvas();
        return me.$svg;
    },
    draw: function (args) {
        var me = this,
            result = [],
            context = me.getContext();
        if (!Array.isArray(args)) {
            args = [args];
        }
        args.foreach(function (options, index) {
            options = me.applyDefaults(options);
            switch (options.shape) {
                case MEPH.util.SVG.shapes.line:
                    result = result.concat(me.drawLine(options));
                    break;
                case MEPH.util.SVG.shapes.circle:
                    result = result.concat(me.drawCircle(options));
                    break;
            }
        });
        result.foreach(function (t) {
            me.parts.push(t);
        })
        return result;
    },
    remove: function (obj) {
        var me = this;
        var p = me.parts.removeWhere(function (x) { return x === obj; });

        p.foreach(function (t) {

            me.getCanvas().removeChild(t.shape);
        })
    },
    drawLine: function (options, el) {
        var me = this,
            canvas, shape,
            add, line;

        canvas = me.getCanvas();
        var svgns = "http://www.w3.org/2000/svg";
        if (!el) {
            add = true;
        }
        else {
            shape = el.shape;
            options = me.applyDefaults(options);
        }
        shape = shape || document.createElementNS(svgns, "line");
        shape.setAttributeNS(null, "x1", options.start.x);
        shape.setAttributeNS(null, "y1", options.start.y);
        shape.setAttributeNS(null, "x2", options.end.x);
        shape.setAttributeNS(null, "y2", options.end.y);
        shape.setAttributeNS(null, "fill", options.fill);
        shape.setAttributeNS(null, "style", "stroke:" + options.strokeStyle + "; stroke-width:" + options.strokeWidth + ";");
        if (add) {
            canvas.appendChild(shape);
        }
        return { shape: shape, options: options };
    },
    drawCircle: function (options, el) {
        var me = this,
                  canvas, shape,
                  add, line;

        canvas = me.getCanvas();
        var svgns = "http://www.w3.org/2000/svg";
        if (!el) {
            add = true;
        }
        else {
            shape = el.shape;
            options = me.applyDefaults(options);
        }
        shape = shape || document.createElementNS(svgns, "circle");
        // cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"
        shape.setAttributeNS(null, "cx", options.x);
        shape.setAttributeNS(null, "cy", options.y);
        shape.setAttributeNS(null, "r", options.radius);
        shape.setAttributeNS(null, "stroke", options.stroke);
        shape.setAttributeNS(null, "stroke-width", options.strokeWidth);
        shape.setAttributeNS(null, "fill", options.fill);

        if (add) {
            canvas.appendChild(shape);
        }
        return { shape: shape, options: options };
    },
    applyDefaults: function (options) {
        options = options || {};
        for (var i in MEPH.util.SVG.defaultShapeOptions) {
            if (options[i] === undefined) {
                options[i] = MEPH.util.SVG.defaultShapeOptions[i];
            }
        }
        return options;
    }
});