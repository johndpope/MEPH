/**
 * @class MEPH.table.SpreadSheet
 * @extends MEPH.control.Control
 * A infinitely scrolling SpreadSheet.
 **/
MEPH.define('MEPH.tween.TweenEditor', {
    alias: 'tweeneditor',
    templates: true,
    requires: ['MEPH.util.Observable', 'MEPH.util.Style', 'MEPH.util.SVG', 'MEPH.util.Dom'],
    extend: 'MEPH.control.Control',
    statics: {
        states: {
            dragging: 'dragging'
        },
        tweenTypes: {
            bezier: 'bezier'
        }
    },
    properties: {
        source: null,
        /**
         * @property {String} mark Marks the tween point with a group id.
         **/
        mark: null,
        target: null,
        paths: null,
        state: null,
        pointradius: 4,
        tweenoverradius: 10,
        linestroke: '#000000',
        linestrokeselected: '#f2f51a',
        linestrokewidth: '4px',
        linestrokeoverwidth: '7px',
        $selectedLine: null,
        tweenrad: 4,
        $tweenpoints: null,
        margin: 2,
        $structureElements: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.source = MEPH.util.Observable.observable([]);
        me.paths = MEPH.util.Observable.observable([]);
        me.source.on('changed', me.update.bind(me));

    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.renderer = new MEPH.util.SVG();
        me.renderer.setCanvas(me.svg);
        me.appendEvents();
        me.render();
    },
    appendEvents: function () {
        var me = this;
        me.don('tweendown', me.svg, me.onTweenDown.bind(me));
        me.don('resize', window, me.update.bind(me));
        me.don('mousemove', me.svg, me.onMouseMove.bind(me));
        me.don('mouseup', me.svg, me.onMouseUp.bind(me));
        me.don('tweenup', me.svg, me.onTweenUp.bind(me));
        me.don('tweenmove', me.svg, me.onTweenMove.bind(me));
    },
    onMouseUp: function (evt) {
        var me = this;
        if (me.state === MEPH.tween.TweenEditor.states.dragging) {
            var pos = MEPH.util.Dom.getEventPositions(evt, me.svg);
            me.svg.dispatchEvent(MEPH.createEvent('tweenup', {
                tweentarget: me.target,
                position: pos
            }));
        }
    },
    onMouseMove: function (evt) {
        var me = this;
        if (me.state === MEPH.tween.TweenEditor.states.dragging) {
            var pos = MEPH.util.Dom.getEventPositions(evt, me.svg);
            me.svg.dispatchEvent(MEPH.createEvent('tweenmove', {
                tweentarget: me.target,
                position: pos
            }));
        }
    },
    onTweenUp: function () {
        var me = this;
        if (me.state === MEPH.tween.TweenEditor.states.dragging) {
            me.state = null;
            me.target = null;
        }
    },
    onTweenMove: function (evt) {
        var me = this,
            point,
            pos;

        if (me.state === MEPH.tween.TweenEditor.states.dragging) {
            pos = me.convertToTweenSpace(evt.position.first());
            point = me.getPoint(evt.tweentarget);
            me.source.removeWhere(function (t) {
                return t === point;
            });
            point.x = pos.x;
            point.y = pos.y;
            me.source.push(point);
        }
    },
    /**
     * Get points position.
     * @param {Object} point
     * @return {Object}
     **/
    getPosition: function (point) {
        var me = this;
        return {
            x: me.getX(point.x),
            y: me.getY(point.y)
        }
    },
    getX: function (t) {
        var me = this, size = Style.size(me.svg);
        return (t * (size.width - me.margin)) + me.margin;
    },
    getY: function (t) {
        var me = this, size = Style.size(me.svg),
            theight = size.height - me.margin;
        return (t * (theight / 2)) + (theight / 2) + me.margin;
    },
    convertToTweenSpace: function (pos) {
        var me = this,
            size = Style.size(me.svg),
            width = size.width - me.margin,
            height = size.height - me.margin;

        return {
            x: (pos.x / width),
            y: ((pos.y / height) * 2) - 1
        }
    },
    getPathPoints: function (mark) {
        var me = this;
        return me.source.where(function (t) { return t.mark === mark; });
    },
    getPoint: function (guid) {
        var me = this,
            point = me.source.first(function (x) {
                return x.guid === guid;
            });
        return point;
    },
    onTweenDown: function (evt) {
        var me = this;
        if (!me.state && evt.tweenpoint) {
            var point = me.getPoint(evt.tweenpoint.options.guid);

            if (!point || point.anchor) {
                return;
            }
            me.target = evt.tweenpoint.options.guid;
            me.state = MEPH.tween.TweenEditor.states.dragging;
            me.startposition = me.getPoint(me.target);
        }
    },
    update: function () {
        var me = this;
        me.render();
    },
    render: function () {
        var me = this;
        me.renderPaths();

        me.renderTweenPoints();
        me.renderStructureElements();
    },
    renderPaths: function () {
        var me = this,
            points,
            unrenderedPaths,
            renderedPaths,
            lines, lineshapes,
            p1,
            p2;

        if (!me.renderedPaths) {
            me.renderedPaths = {};
        }

        unrenderedPaths = me.paths.where(function (x) { return !me.renderedPaths[x]; });
        renderedPaths = me.paths.where(function (x) { return me.renderedPaths[x]; });

        unrenderedPaths.foreach(function (x) {
            lines = me.getLineInstructions(x);
            me.renderedPaths[x] = {
                lines: me.renderer.draw(lines),
                linetypes: []
            };
            me.renderedPaths[x].lines.foreach(function (t, index) {
                me.addEventsToLine(t, index);
                t.path = x;
            });
        });

        renderedPaths.foreach(function (x) {
            lines = me.getLineInstructions(x);
            lineshapes = me.renderedPaths[x].lines;
            if (lineshapes.length > lines.length) {
                //remove
                var toremove = lineshapes.length - lines.length;
                lineshapes.subset(0, toremove).where(function (x) {
                    me.renderer.remove(x);
                });
                lineshapes.removeWhere(function (x, i) {
                    return i < toremove;
                });

                lineshapes.foreach(function (t, index) {
                    me.renderer.drawLine(lines[index], lineshapes[index]);
                    lineshapes[index].path = x;
                    me.addEventsToLine(lineshapes[index], index)
                });
            }
            else if (lineshapes.length < lines.length) {
                //add
                var toadd = lines.length - lineshapes.length;
                var newlines = me.renderer.draw(lines.subset(0, toadd));
                newlines.foreach(function (tg, index) {
                    me.addEventsToLine(tg, index + lineshapes.length);
                    tg.path = x;
                })

                lineshapes.push.apply(lineshapes, newlines);

                lines.subset(toadd).foreach(function (x, index) {
                    me.renderer.drawLine(x, lineshapes[index]);
                    me.addEventsToLine(lineshapes[index], index)
                });
            }
            else {
                lineshapes.foreach(function (x, index) {
                    me.renderer.drawLine(lines[index], lineshapes[index]);
                    me.addEventsToLine(lineshapes[index], index)
                });
            }
        });
    },
    setSelectedLineToBezier: function () {
        var me = this;
        if (me.$selectedLine) {
            var path = me.getPath(me.$selectedLine.path);

            var lineInfo = path.linetypes.first(function (x) { return x.lineIndex === me.$selectedLine.lineIndex; });
            if (lineInfo) {
                lineInfo.type = MEPH.tween.TweenEditor.tweenTypes.bezier;
            }
            else {
                path.linetypes.push({ type: MEPH.tween.TweenEditor.tweenTypes.bezier, lineIndex: me.$selectedLine.lineIndex });
            }
        }
    },
    /**
     * Sets the lines type to type.
     * @param {Object} line
     * @param {String} type
     * @return {Object}
     **/
    setLineType: function (line, type) {
        line.options.type = type;
        return line;
    },
    /**
     * Gets the lines for a path.
     * @param {String} guid
     * @return {Array}
     **/
    getPathLines: function (guid) {
        var me = this, path = me.getPath(guid);
        if (path) {
            return path.lines || [];
        }
        return [];
    },
    getPath: function (guid) {
        var me = this;
        if (me.renderedPaths && me.renderedPaths[guid]) {
            return me.renderedPaths[guid];
        }
        return null;
    },
    /**
     * Adds events to lines.
     **/
    addEventsToLine: function (line, index) {
        var me = this;
        me.dun(line);
        line.lineIndex = index;
        me.don('mouseout', line.shape, function (shape, evt) {
            me.handleLineState(shape, 'mouseout');
        }.bind(me, line), line);
        me.don('mouseover', line.shape, function (shape, evt) {
            me.handleLineState(shape, 'mouseover');
        }.bind(me, line), line);
        me.don('click', line.shape, function (shape, evt) {
            me.handleLineState(shape, 'click');
        }.bind(me, line), line);
        me.handleLineState(line);
    },
    handleLineState: function (shape, evt) {
        var me = this;
        switch (evt) {
            case 'click':
                if (me.$selectedLine) {
                    me.$selectedLine.shape.style.stroke = me.linestroke;
                }
                shape.shape.style.stroke = me.linestrokeselected;
                me.$selectedLine = shape;
                break;
            case 'mouseover':
                //shape.shape.style.stroke = me.linestrokeover;
                shape.shape.style.strokeWidth = me.linestrokeoverwidth;
                break;
            case 'mouseout':
                //shape.shape.style.stroke = me.linestroke;
                shape.shape.style.strokeWidth = me.linestrokewidth;
                break;
            default:
                if (shape && shape.shape) {
                    shape.shape.style.stroke = me.linestroke;
                    shape.shape.style.strokeWidth = me.linestrokewidth;
                }
                me.$selectedLine = null;
                break;
        }
    },
    /**
     * @private
     * Gets instructions for line.
     * @param {String} x
     * @return {Array}
     **/
    getLineInstructions: function (x) {
        var me = this,
            points,
            p1, lines,
            p2;
        points = me.getPathPoints(x).orderBy(function (x, y) { return y.x - x.x; });

        lines = points.select(function (p, index) {
            if (index) {
                p2 = me.getPosition(points[index]);
                p1 = me.getPosition(points[index - 1]);
                var line = {
                    shape: MEPH.util.SVG.shapes.line,
                    start: p1,
                    strokeWidth: me.linestrokewidth,
                    end: p2
                };
                return line;
            }
        }).where(function (t) {
            return t;
        });

        return lines;
    },
    renderTweenPoints: function () {
        var me = this, toshape = function (x) {
            return {
                shape: MEPH.util.SVG.shapes.circle,
                x: me.getX(x.x),
                guid: x.guid,
                y: me.getY(x.y),
                radius: me.pointradius
            }
        };

        if (me.$tweenpoints === null) {
            var select = me.source.select(toshape);
            me.$tweenpoints = me.renderer.draw(select);
        }
        else {
            //me.$tweenpoints.foreach(function (t) {
            //    var shapeObj = structure.first(function (m) { return m.name === t.options.name; });
            //    me.renderer.drawCircle(shapeObj, t);
            //});
            var newshapes = me.source.select(toshape).where(function (x, index) {
                var r = me.$tweenpoints[index];
                if (r) {
                    var t = me.renderer.drawCircle(x, r);
                    me.dun(r);
                    r.options.guid = t.options.guid;
                    me.addEventsToTweenPoints([r]);
                    return false;
                }
                else {
                    return true;
                }
            });
            if (newshapes.length) {
                var p = me.renderer.draw(newshapes);
                me.$tweenpoints.push.apply(me.$tweenpoints, p);
                me.addEventsToTweenPoints(p);
            }
            else if (me.source.length < me.$tweenpoints) {
                var t = me.$tweenpoints.subset(me.source.length).select(function (x) {
                    me.renderer.remove(x);
                    return x;
                })
                me.$tweenpoints.removeWhere(function (y) {
                    return t.some(function (x) { return x === y; })
                }).foreach(function (removed) {
                    me.dun(removed);
                });
            }
        }
    },
    addEventsToTweenPoints: function (array) {
        var me = this;
        array.foreach(function (x) {
            me.don('mousedown', x.shape, function (shape, evt) {
                var pos = MEPH.util.Dom.getEventPositions(evt, me.svg);
                me.svg.dispatchEvent(MEPH.createEvent('tweendown', { tweenpoint: shape, position: pos }));
            }.bind(me, x), x);
            me.don('mouseout', x.shape, function (shape) {
                shape.shape.setAttribute('r', me.tweenrad);
            }.bind(me, x), x);
            me.don('mouseover', x.shape, function (shape, evt) {
                var pos = MEPH.util.Dom.getEventPositions(evt, me.svg);
                if (!me.state) {
                    me.target = shape.options.guid;
                }
                shape.shape.setAttribute('r', me.tweenoverradius)
                me.svg.dispatchEvent(MEPH.createEvent('tweenover', { tweenpoint: shape, position: pos }));
            }.bind(me, x), x);

        });
    },
    renderStructureElements: function () {
        var me = this, size = Style.size(me.svg);
        var structure = [{
            name: 'left',
            shape: MEPH.util.SVG.shapes.line,
            start: {
                x: 0 + me.margin,
                y: 0 + me.margin
            },
            end: {
                x: me.margin,
                y: size.height - me.margin
            }
        }, {
            name: 'right',
            shape: MEPH.util.SVG.shapes.line,
            start: {
                x: size.width - me.margin,
                y: me.margin
            },
            end: {
                x: size.width - me.margin,
                y: size.height - me.margin
            }
        }, {
            name: 'top',
            shape: MEPH.util.SVG.shapes.line,
            start: {
                x: me.margin,
                y: me.margin
            },
            end: {
                x: size.width - me.margin,
                y: me.margin
            }
        }, {
            name: 'bottom',
            shape: MEPH.util.SVG.shapes.line,
            start: {
                x: me.margin,
                y: size.height - me.margin
            },
            end: {
                x: size.width - me.margin,
                y: size.height - me.margin
            }
        }]
        if (me.$structureElements === null) {
            me.$structureElements = me.renderer.draw(structure);
        }
        else {
            me.$structureElements.foreach(function (t) {
                var shapeObj = structure.first(function (m) { return m.name === t.options.name; });
                me.renderer.drawLine(shapeObj, t);
            })
        }
    },
    onAddPointAndPath: function () {
        var me = this;
        me.onAddPath();
        me.onAddPoint();
    },
    onAddPoint: function () {
        var me = this;
        me.addPoint({ x: .5, y: 0 });
    },
    /**
     * Adds a point the the tween editor.
     ***/
    addPoint: function (point) {
        var me = this;

        point.x = Math.max(0, Math.min(point.x, 1));
        point.guid = MEPH.GUID();
        point.y = Math.max(-1, Math.min(point.y, 1));
        point.mark = me.mark;
        me.source.push(point);
    },
    onAddPath: function () {
        var me = this;
        me.addPath({ x: 0, y: 0 }, { x: 1, y: 0 })
    },
    /**
     * Adds a path 
     * @param {Object} p1
     * @param {Object} p2
     ***/
    addPath: function (p1, p2) {
        var me = this, guid = MEPH.GUID();
        me.paths.push(guid);
        me.mark = guid;
        p1.anchor = true;
        p2.anchor = true;
        me.addPoint(p1);
        me.addPoint(p2);
    }
});