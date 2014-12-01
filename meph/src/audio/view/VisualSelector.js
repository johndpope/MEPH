/*global MEPH*/

/**
* @class
*
* This is a convenient way of defining a visual selector.
*/
MEPH.define('MEPH.audio.view.VisualSelector', {
    alias: 'visualselector',
    extend: 'MEPH.audio.view.Visualizer',
    requires: ['MEPH.input.Range', 'MEPH.util.Renderer'],
    templates: true,
    properties: {
        stop: 100,
        position: 0,
        step: .0001,
        markBtnText: 'Mark',
        max: null,
        min: null,
        marks: null,
        offsetbtnheight: 19,
        marktype: 'default',
        markercolor: '#d9534f',
        markscolor: '#f0ad4e',
        markerBtns: null,
        smallestStep: 0.0000001,
        renderer: null,
        injectControls: {
            location: 'buttonpanel'
        },
        markerrenderer: null
    },
    initialize: function () {
        var me = this;
        me.super();
        me.markerBtns = [];
        me.on('altered', function (type, args) {
            if (args.path === 'marks') {
                if (me.marks) {
                    me.marks.on('changed', me.update.bind(me));
                }
                me.update();

            }

            if (args.path === 'vertical' || args.path === 'scrollMutiplier' || args.path === 'scrollleft') {
                me.update();
            }
        });
    },
    addMark: function () {
        var me = this,
            relativePosition = me.getCurrentPosition();
        if (me.marks && !me.marks.some(function (x) { return x.position === relativePosition; })) {
            me.marks.push({ position: relativePosition, type: me.marktype })
        }
    },
    getCurrentPosition: function () {
        var me = this;
        var position = parseFloat(me.position);
        var a = parseFloat(me.container.scrollLeft);
        var canvasWidth = parseFloat(me.canvas.clientWidth);
        var containerWidth = parseFloat(me.container.clientWidth);

        var windowWidth = Math.min(containerWidth, canvasWidth - a);
        var windowStep = windowWidth * position;

        return (windowStep + a) / canvasWidth
    },
    getMarkerPosition: function () {
        var me = this;
        var position = parseFloat(me.position);
        var a = parseFloat(me.container.scrollLeft);
        var canvasWidth = parseFloat(me.canvas.clientWidth);
        var containerWidth = parseFloat(me.container.clientWidth);

        var windowWidth = Math.min(containerWidth, canvasWidth - a);
        var windowStep = windowWidth * position;

        return (windowStep + a);
    },
    updateMarkBtns: function () {
        var me = this;
        if (me.marks) {
            var removed = me.markerBtns.removeWhere(function (btnObject) {
                return !me.marks.some(function (x) { return x === btnObject.marker });
            });
            removed.foreach(function (x) {
                x.dom.parentNode.removeChild(x.dom);
            });
            var newmarks = me.marks.where(function (x) {
                return !me.markerBtns.some(function (t) { return t.marker === x; });
            });

            var newmarksObjects = me.createNewMarkerBtns(newmarks);
            me.markerBtns.push.apply(me.markerBtns, newmarksObjects);

            me.markerBtns.foreach(function (x) {
                x.dom.style.left = (x.marker.position * me.width) + 'px';
                x.dom.style.top = (me.height - me.offsetbtnheight) + 'px';
            })
        }
    },
    createNewMarkerBtns: function (newmarks) {
        var me = this;
        return newmarks.select(function (x, index) {
            var btntemplate = me.createMarkerBtn();
            var btn = btntemplate.querySelector('[removebtn]');
            me.don('click', btn, function (x) {
                me.marks.removeWhere(function (y) { return y === x; });
            }.bind(me, x));

            me.don('click', btntemplate.querySelector('[playbtn]'), function (x) {
                console.log('play snippet')
                me.playSnippet(x);
            }.bind(me, x))

            return {
                marker: x,
                dom: btntemplate
            }
        })
    },
    /**
     * Plays the snippet.
     * @param {Object} percentage
     ***/
    playSnippet: function (mark) {
        var me = this;
        var tmarks = me.marks.orderBy(function (x, y) {
            return x.position - y.position;
        });
        me.marks.length = 0;
        me.marks.push.apply(me.marks, tmarks);
        var index = me.marks.indexWhere(function (x) {
            return x.position === mark.position;
        }).first();
        if (index !== null) {
            me.markCanvas.dispatchEvent(MEPH.createEvent('playsnippet', {
                start: mark.position,
                end: me.marks[index + 1] ? me.marks[index + 1].position : 1
            }))
        }
    },
    createMarkerBtn: function () {
        var me = this;
        var clone = me.markerBtnTemplate.cloneNode(true);
        me.markerCanvas.parentNode.appendChild(clone);
        return clone;
    },
    update: function () {
        var me = this;
        return Promise.resolve().then(function () {
            me.updateMarkBtns();
        }).then(function () {
            return me.updateMarks()
        }).then(function () {
            return me.updateMarker();
        })
    },
    updateMarks: function () {
        var me = this;


        return me.render();
    },
    updateMarker: function () {
        var me = this;
        if (me.markerFrame)
            cancelAnimationFrame(me.markerFrame)
        me.markerFrame = requestAnimationFrame(function () {
            var HEIGHT = me.height;
            var WIDTH = me.width;
            var dataArray = me.source;
            me.markerFrame = null;

            if (!me.markerrenderer) {
                me.markerrenderer = new MEPH.util.Renderer();
                me.markerrenderer.setCanvas(me.markerCanvas);
            }
            me.markerrenderer.clear();
            var xpos = me.getMarkerPosition();
            me.markerrenderer.draw({
                shape: MEPH.util.Renderer.shapes.line,
                end: {
                    x: xpos,
                    y: HEIGHT
                },
                start: {
                    x: xpos,
                    y: 0
                },
                strokeStyle: me.markercolor
            });
            rsolve();
        });
        var rsolve;
        return new Promise(function (r) {
            rsolve = r;
        });
    },
    render: function () {
        var me = this;
        if (me.markframe)
            cancelAnimationFrame(me.markframe)
        me.markframe = requestAnimationFrame(function () {
            var HEIGHT = me.height;
            var WIDTH = me.width;
            var dataArray = me.source;
            me.markframe = null;

            if (!me.renderer) {
                me.renderer = new MEPH.util.Renderer();
                me.renderer.setCanvas(me.markCanvas);
            }


            me.renderer.clear();
            if (me.marks) {
                var lines = me.marks.select(function (x) {
                    return {
                        shape: MEPH.util.Renderer.shapes.line,
                        end: {
                            x: x.position * WIDTH,
                            y: HEIGHT
                        },
                        start: {
                            x: x.position * WIDTH,
                            y: 0
                        },
                        strokeStyle: me.markscolor
                    }
                });
                me.renderer.draw(lines);
            }
            rsolve();
        });
        var rsolve;
        return new Promise(function (r) {
            rsolve = r;
        });
    }
});