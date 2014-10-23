/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Node', {
    requires: ['MEPH.util.Observable'],
    alias: 'audionode',
    templates: true,
    extend: 'MEPH.control.Control',
    statics: {
        types: {
            AudioBuffer: 'AudioBuffer',
            Boolean: 'boolean',
            Number: 'Number',
            String: 'String',
            Float32Array: 'Float32Array'
        }
    },
    properties: {
        title: null,
        type: null,
        id: null,
        //x: null,
        y: null,
        sx: null,
        nodeInputs: null,
        nodeOutputs: null,
        bodyy: null,
        inputsy: 0,
        bodyry: 1,
        bodyrx: 1,
        bodystrokewidth: null,
        bodyfill: null,
        footerheight: null,
        nodeheight: null,
        headerfill: null,
        nodewidth: null,
        titlepadding: null,
        inputradius: 0,
        inputstroke: null,
        bodystroke: null,
        headerheight: null,
        titlepaddingtop: null
    },
    initialize: function () {
        var me = this;
        me.nodeInputs = MEPH.util.Observable.observable([]);
        me.nodeOutputs = MEPH.util.Observable.observable([]);
        me.id = MEPH.GUID();
        me.super();

        me.defineNodeDependentProperties();
    },
    onLoaded: function () {
        var me = this;
        me.nodex = 0;
        me.bodyrx = 10;
        me.bodyry = 10;
        me.bodystrokewidth = 2;
        me.bodyy = 0;
        me.nodeheight = 300;
        me.title = me.title || 'Node';
        me.nodewidth = 400;
        me.titlepadding = 10;
        me.footerheight = 15;
        me.headerheight = 24;
        me.titlepaddingtop = 17;
        me.bodyfill = "rgb(90,90,90)";
        me.headerfill = "rgb(79,79,79)";
        me.inputradius = me.inputradius || 8;
        me.inputstroke = 'black';
        me.bodystroke = "rgb(234,168,68)";
        //setTimeout(function () {
        //    me.nodeg.setAttributeNS(null, "id", "node" + (me.id || MEPH.GUID()));
        //}, 1000)
    },
    defineNodeDependentProperties: function () {
        var me = this;
        me.definerHeaderBufferProperties();
        me.defineBodyHeightProperty();
        me.defineBodyWidthProperty();
        me.defineBodyXProperty();
        me.defineTitleProperties();
    },
    defineTitleProperties: function () {
        var me = this;


        MEPH.util.Observable.defineDependentProperty('inputtransform', me, ['inputsx', 'inputsy'], function () {
            var result = 'translate(' + (me.inputsx || 0) + ',' + (me.inputsy || 0) + ')';

            return result;
        });

        MEPH.util.Observable.defineDependentProperty('titlex', me, ['titlepadding', 'titlepaddingtop'], function () {
            var result = (me.titlepadding || 0);

            return result;
        });

        MEPH.util.Observable.defineDependentProperty('titley', me, ['titlepadding', 'titlepaddingtop'], function () {
            var result = (me.titlepaddingtop || 0);

            return result;
        });
    },
    defineBodyXProperty: function () {
        var me = this;
        ///bodyheight
        MEPH.util.Observable.defineDependentProperty('inputsx', me, ['inputradius'], function () {
            var result = (me.inputradius || 0)
            return result;
        });

        MEPH.util.Observable.defineDependentProperty('nodex', me, ['inputradius'], function () {
            var result = (me.inputradius || 0)
            return result;
        });

        MEPH.util.Observable.defineDependentProperty('bodyx', me, ['nodex', 'bodystrokewidth'], function () {
            var result = (parseFloat(me.nodex) || 0) + (me.bodystrokewidth || 0);
            return result;
        });
    },
    defineBodyHeightProperty: function () {
        var me = this;

        MEPH.util.Observable.defineDependentProperty('bodyheight', me, ['nodeheight', 'headerheight', 'footerheight'], function () {
            var result = me.nodeheight - (me.headerheight || 0) - (me.footerheight || 0);
            return result;
        });
    },
    defineBodyWidthProperty: function () {
        var me = this;

        MEPH.util.Observable.defineDependentProperty('bodywidth', me, ['inputradius', 'nodewidth', 'bodystrokewidth'], function () {
            var result = me.nodewidth - (me.bodystrokewidth * 2 || 0);

            return result;
        });
    },
    /**
     * Defines the header buffer property
     */
    definerHeaderBufferProperties: function () {
        var me = this;

        MEPH.util.Observable.defineDependentProperty('headerbuffer', me, ['headerheight'], function () {
            var result = 0;
            ['headerheight'].foreach(function (x) {
                if (me[x]) {
                    result += me[x];
                }
            });
            return result;
        });
    },
    createInput: function (name, type, options) {
        return {
            name: name,
            title: name,
            type: type,
            id: MEPH.GUID(),
            options: options || null,
            output: false
        }
    },
    createOutput: function (name, type) {
        return {
            name: name,
            title: name,
            type: type,
            id: MEPH.GUID(),
            output: true
        }
    }
});