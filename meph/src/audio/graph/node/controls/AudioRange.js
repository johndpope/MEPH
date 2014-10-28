﻿/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.AudioRange', {
    alias: 'audiorange',
    templates: true,
    requires: ['MEPH.util.Dom'],
    extend: 'MEPH.audio.graph.node.controls.AudioControl',
    enterValue: function () {
        //var me = this;
        var me = this;
        var element = Dom.createSimpleDataEntry(me, me.dragarea, 'range', function (val) {
            me.value = val;
        }, me.value);

        element.min = me.minvalue || 0;
        element.max = me.maxvalue || 10;
        element.step = me.increment || .01;
    }
})