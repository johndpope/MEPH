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
            if (args.path === 'source') {
                me.sourceChanged(args);
            }
        })
    },
    sourceChanged: function (args) {
        var me = this;
        me.draw(args.value);
    },
    draw: function () {
        var me = this;
        var HEIGHT = me.height;
        var WIDTH = me.width;
        var dataArray = me.source;
        var bufferLength = me.source.length;
        var canvasCtx = me.canvas.getContext('2d');

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();

    },
    /**
     * @private
     * Adds transferable properties.
     **/

    addTransferables: function () {
        var me = this, properties = MEPH.Array(['componentCls', 'source', 'height', 'width']);

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