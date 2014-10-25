﻿/**
 * @class MEPH.audio.graph.node.WaveShaperNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.WaveShaperNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'waveshaper',
    templates: true,
    properties: {
        curveTitle: '',
        oversampleTitle: ''
    },
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferinput');
        me.nodecontrols.push('curve');
        me.nodecontrols.push('oversample');

        me.super();


        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('curve', MEPH.audio.graph.node.Node.Number));

        me.nodeInputs.push(me.createInput('oversample', MEPH.audio.graph.node.Node.String, {
            values: ['none', '2x', '4x']
        }));


        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    onLoaded: function () {
        var me = this;
        me.super();

        me.title = 'Wave Shaper';
        me.curveTitle = 'curve';
        me.oversampleTitle = 'oversample';
    }
});