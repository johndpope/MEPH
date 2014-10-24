﻿/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.Control', {
    alias: 'nodecontrol',
    templates: true,
    extend: 'MEPH.control.Control',
    properties: {
        fill: null,
        radius: null,
        title: null,
        x: 0,
        y: 0,
        connectorxmargin: 3,
        fontsize: null,
        stroke: null,
        bufferx: null,
        left: true,
        width: 200,
        margin: 4
    },
    initialize: function () {
        var me = this;
        me.super();
    },
    onLoaded: function () {
        var me = this;
        me.fontsize = me.fontsize || '12px';
        me.super();
        me.defineTextX();
    },
    /**
     * Defines the header buffer property
     */
    defineTextX: function () {
        var me = this;

        MEPH.util.Observable.defineDependentProperty('height', me, ['fontsize', 'radius'], function () {
            var result = parseFloat(me.fontsize) || 0;
            var radius = parseFloat(me.radius) || 0

            return Math.max(radius * 2, result) + me.margin + me.margin;
        });


        MEPH.util.Observable.defineDependentProperty('textx', me, ['left', 'width', 'connectorxmargin', 'radius', 'bufferx'], function () {
            var result;
            if (me.left) {
                result = me.connectorxmargin + (me.radius || 0) + (me.bufferx || 0);
            }
            else {
                result = me.width - me.connectorxmargin - me.radius - (me.bufferx || 0);
            }
            return result;
        });
        MEPH.util.Observable.defineDependentProperty('texttransform', me, ['left', 'width', 'connectorxmargin', 'radius', 'bufferx'], function () {
            var result;
            if (me.left) {
                result = me.connectorxmargin + (me.radius || 0) + (me.bufferx || 0);
            }
            else {
                result = me.width - me.connectorxmargin - me.radius - (me.bufferx || 0);
            }
            var x = result;
            var y = parseFloat(me.radius || 0);
            result = 'translate(' + (x || 0) + ',' + (y || 0) + ')';
            return result;
        });



        MEPH.util.Observable.defineDependentProperty('connectortransform', me, ['radius', 'left', 'width', 'connectorxmargin', 'radius', 'bufferx'], function () {
            var result;
            if (me.left) {
                result = 0;
            }
            else {
                result = me.width + (me.radius || 0) / 2;
            }
            var x = result;
            var y = parseFloat(me.radius || 0);
            var result = 'translate(' + (x || 0) + ',' + (y || 0) + ')';

            return result;
        });

        MEPH.util.Observable.defineDependentProperty('anchor', me, ['left'], function () {
            var result;
            if (!me.left) {
                result = 'end';
            }
            else {
                result = 'start';
            }
            return result;
        });


    }
});