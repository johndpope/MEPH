﻿/**
 * @class MEPH.util.Renderer
 * String
 */
MEPH.define('MEPH.util.Renderer', {
    requires: ['MEPH.util.Vector'],
    properties: {
    },
    setCanvas: function (canvas) {
        var me = this;
        me.$context = null;
        me.$canvas = canvas;
    },
    getCanvas: function () {
        var me = this;
        return me.$canvas;
    },
    getContext: function () {
        var me = this;
        me.$context = me.$context || me.getCanvas().getContext('2d');
        return me.$context;
    },
    draw: function (args) {
        var me = this,
            context = me.getContext();
        if (!Array.isArray(args)) {
            args = [args];
        }
        args.foreach(function (options, index) {
            context.save();
            options = me.applyDefaults(options);
            switch (options.shape) {
                case MEPH.util.Renderer.shapes.rectangle:
                    me.drawRectangle(options);
                    break;
                case MEPH.util.Renderer.shapes.circle:
                    me.drawCircle(options);
                    break;
                case MEPH.util.Renderer.shapes.text:
                    me.drawText(options);
                    break;
                case MEPH.util.Renderer.shapes.line:
                    me.drawLine(options);
                    break;
                case MEPH.util.Renderer.shapes.canvas:
                    me.drawCanvas(options);
                    break;
                default:
                    throw 'undefined shape type';

            }
            context.restore();
        });

        return true;
    },
    clear: function () {
        try {
            var me = this,
                canvas = me.getCanvas(),
                context = me.getContext();
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
        catch (e) {
            return false;
        }
        return true;
    },
    setFillStyle: function (options, context) {
        context.fillStyle = options.fillStyle || "rbg(0,0,0)";
        if (options.gradientFillStyle) {
            var gfs = options.gradientFillStyle;
            var gradient = context.createLinearGradient(gfs.x0, gfs.y0, gfs.x1, gfs.y1);
            gfs.colorStops.foreach(function (x, index) {
                gradient.addColorStop(x.stop, x.color);
            });
            context.fillStyle = gradient;
        }
    },
    drawRectangle: function (options) {
        var me = this,
            context = me.getContext();
        me.setFillStyle(options, context);
        context.lineWidth = options.lineWidth !== undefined ? options.lineWidth : 1;
        context.strokeStyle = options.strokeStyle !== undefined ? options.strokeStyle : "rbg(0,0,0)";
        context.roundRect(options.x, options.y, options.width, options.height, options.radius || 0, options.fill || false, options.stroke || false);

    },
    drawLine: function (options) {
        var me = this,
            context = me.getContext();
        var point2 = new MEPH.util.Vector(options.end.x, options.end.y);
        var point = new MEPH.util.Vector(options.start.x, options.start.y);
        //var f = MEPH.util.Vector.Lerp2D(point, point2, .25).rotate(.13);
        //var g = MEPH.util.Vector.Lerp2D(point, point2, .75).rotate(-.13);
        context.beginPath();
        context.strokeStyle = options.strokeStyle;
        //context.fillStyle = options.fillStyle;
        me.setFillStyle(options, context);
        context.moveTo(options.start.x, options.start.y);
        context.lineWidth = options.lineWidth;
        context.lineTo(options.end.x, options.end.y);
        context.stroke();
    },
    drawBezier: function (options) {
        var me = this,
            context = me.getContext();
        var point2 = new MEPH.util.Vector(options.end.x, options.end.y);
        var point = new MEPH.util.Vector(options.start.x, options.start.y);
        var f = MEPH.util.Vector.Lerp2D(point, point2, .25).rotate(.13);
        var g = MEPH.util.Vector.Lerp2D(point, point2, .75).rotate(-.13);
        context.beginPath();
        context.strokeStyle = options.strokeStyle;
        //context.fillStyle = options.fillStyle;
        me.setFillStyle(options, context);
        context.moveTo(options.start.x, options.start.y);
        context.lineWidth = options.lineWidth;
        context.bezierCurveTo(f._x, f._y, g._x, g._y, options.end.x, options.end.y);
        context.stroke();
    },
    drawCircle: function (options) {
        var me = this,
            context = me.getContext();
        context.strokeStyle = options.strokeStyle;
        me.setFillStyle(options, context);
        context.beginPath();
        context.arc(options.x, options.y, options.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
    },
    drawCanvas: function (options) {
        var me = this,
            context = me.getContext();
        if (options.center) {
            context.drawImage(options.canvas,
                                     0,
                                     0,
                                     options.canvas.width,
                                     options.canvas.height,
                                    -options.canvas.width / 2,
                                    -options.canvas.height / 2,
                                     options.canvas.width,
                                     options.canvas.height);
        }
        else if (options.positioned) {
            context.drawImage(options.canvas,
                                   options.x,
                                   options.y);
        }
        else {
            context.drawImage(options.canvas,
                                     0,
                                     0,
                                     options.canvas.width,
                                     options.canvas.height,
                                        0,
                                        0,
                                     options.canvas.width,
                                     options.canvas.height);
        }
    },
    drawText: function (options) {
        var me = this,
            context = me.getContext();
        context.font = options.font;
        me.setFillStyle(options, context);
        context.textAlign = options.textAlign;
        context.textBaseline = options.textBaseline;
        context.fillText(options.text, options.x, options.y, options.maxWidth);
    },
    applyDefaults: function (options) {
        options = options || {};
        for (var i in MEPH.util.Renderer.defaultShapeOptions) {
            if (options[i] === undefined) {
                options[i] = MEPH.util.Renderer.defaultShapeOptions[i];
            }
        }
        return options;
    },
    destroy: function (removeCanvas) {
        var me = this;
        if (removeCanvas) {
            var canvas = me.getCanvas();
            if (canvas) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    },
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
            fillStyle: '#ff0000',
            strokeStyle: '#0000ff',
            fill: '#ff0000',
            font: '22px Verdana',
            stroke: true
        }
    }
});


/** 
* Draws a rounded rectangle using the current state of the canvas.  
* If you omit the last three params, it will draw a rectangle  
* outline with a 5 pixel border radius  
* @param {Number} x The top left x coordinate 
* @param {Number} y The top left y coordinate  
* @param {Number} width The width of the rectangle  
* @param {Number} height The height of the rectangle 
* @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
* @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
* @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
*/
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    // var x = _x - (width / 2);
    // var y = _y - (height / 2);
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }
    else if (typeof (radius) === "number") {
        for (var side in cornerRadius) {
            cornerRadius[side] = radius;
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}