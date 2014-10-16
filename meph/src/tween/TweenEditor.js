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
        }
    },
    properties: {
        source: null,
        /**
         * @property {String} mark Marks the tween point with a group id.
         **/
        mark: null,
        pointradius: 4,
        $tweenpoints: null,
        margin: 2,
        $structureElements: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.source = MEPH.util.Observable.observable([]);
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
    },
    onTweenDown: function (evt) {
        var me = this;
        if (!me.state && evt.tweenpoint) {
            me.target = evt.tweenpoint.options.guid;
            me.state = MEPH.tween.TweenEditor.states.dragging;
        }
    },
    update: function () {
        var me = this;
        me.render();
    },
    render: function () {
        var me = this;
        me.renderStructureElements();
        me.renderTweenPoints();
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
                    r.guid = t.guid;
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
            me.don('mousedown', x.shape, function (shape) {
                me.svg.dispatchEvent(MEPH.createEvent('tweendown', { tweenpoint: shape }))
            }.bind(me, x), x)
        });
    },
    getX: function (t) {

        var me = this, size = Style.size(me.svg);
        return (t * (size.width - me.margin)) + me.margin;
    },
    getY: function (t) {
        var me = this, size = Style.size(me.svg), theight = size.height - me.margin;
        return (t * (theight)) + (theight / 2) + me.margin;
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
    onAddPoint: function () {
        var me = this;
        me.addPoint({ x: .5, y: 0 });
    },
    addPoint: function (point) {
        var me = this;

        point.x = Math.max(0, Math.min(point.x, 1));
        point.guid = MEPH.GUID();
        point.y = Math.max(-1, Math.min(point.y, 1));
        point.mark = me.mark;
        me.source.push(point);
    }
});