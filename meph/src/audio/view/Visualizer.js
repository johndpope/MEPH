/**
 * @class MEPH.field.FormField
 * @extends MEPH.control.Control
 * Standard form for a input field.
 **/
MEPH.define('MEPH.audio.view.Visualizer', {
    alias: 'visualizer',
    templates: true,
    extend: 'MEPH.control.Control',
    requires: [],
    properties: {
        /**
         * @property {String} cls
         * CSS class to apply for this node.
         */
        cls: '',

        baseCls: 'visualizer col-md-3',

        height: 200,

        width: 300,
        maxsize: 20000,
        vertical: 0,
        delta: 1,
        scrollMutiplier: 1,
        scrollleft: 0,

        /**
         * @property {Array} source
         * An audio source.
         ***/
        source: null

    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.addTransferables();
        me.defineDependentProperties();
        me.on('altered', function (type, args) {

            if (args.path === 'source' || args.path === 'vertical' || args.path === 'scrollMutiplier') {
                me.updateWidth(args).then(me.setLeft.bind(me)).then(function () {
                    me.sourceChanged(args);
                });
            }
        })
    },
    sourceChanged: function (args) {
        var me = this;
        me.draw(args.value);
    },
    calculateLeft: function (args) {

        var me = this;
        var width = parseFloat(me.container.scrollWidth);
        var scrollLeft = parseFloat(me.scrollleft) / 100;

        return (width * scrollLeft);
    },
    setLeft: function () {
        var me = this;
        var left = me.calculateLeft();
        me.container.scrollLeft = left;
    },
    draw: function () {
        var me = this;
        if (me.frame)
            cancelAnimationFrame(me.frame)
        me.frame = requestAnimationFrame(function () {
            if (!me.canvas) return;
            var HEIGHT = me.height;
            var WIDTH = me.width;
            var dataArray = me.source;
            var canvasCtx = me.canvas.getContext('2d');

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();
            if (me.source && me.source.max) {
                var max = me.source.max(function (x) { return Math.abs(x); });
                var bufferLength = me.source.length;
                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;

                for (var i = 0; i < bufferLength; i++) {

                    var v = dataArray[i] / (max || 128.0);
                    var y = (v * HEIGHT / 2) + (HEIGHT / 2) + parseFloat(me.vertical || 0) / (max || 128.0);

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
            }
            canvasCtx.lineTo(WIDTH, HEIGHT / 2);
            canvasCtx.stroke();
            me.frame = null;
            rsolve();
        });
        var rsolve;
        return new Promise(function (r) {
            rsolve = r;
        });
    },
    changeWidth: function () {
        var e = MEPH.util.Array.convert(arguments).last().domEvent;
        var me = this;

        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        me.delta = delta;
        me.width += me.delta
        me.draw();
    },
    updateWidth: function () {
        var me = this;
        if (parseFloat(me.scrollMutiplier)) {
            me.width = (me.maxsize * parseFloat(me.scrollMutiplier) / 100);
            return me.draw();
        }
        else {
            me.width = me.container.clientWidth;
        }
        return Promise.resolve();
    },
    /**
     * @private
     * Adds transferable properties.
     **/

    addTransferables: function () {
        var me = this, properties = MEPH.Array(['componentCls', 'source', 'height', 'width', 'scrollMutiplier']);

        properties.foreach(function (prop) {
            me.addTransferableAttribute(prop, {
                object: me,
                path: prop
            });
        });

    },

    defineDependentProperties: function () {
        var me = this;
        me.combineClsIntoDepenendProperty('visualizerCls', ['componentCls', 'cls', 'baseCls']);
    },
});