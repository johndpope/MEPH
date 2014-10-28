﻿/**
 * @class MEPH.audio.graph.node.AudioBufferSourceNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.AudioBufferSourceNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'audiobuffersource',
    templates: true,
    properties: {
        loopTitle: 'Q',
        loopEndTitle: 'loop',
        loopStartTitle: 'detune',
        playbackRateTitle: 'gain',
        sourceTitle: '',
        sourcevalue: null,
        loopvalue: null,
        loopEndvalue: null,
        loopStartvalue: null,
        playbackRatevalue: null,
        audiobuffersources: null
    },
    initialize: function () {
        var me = this;
        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('sourceinput');
        me.nodecontrols.push('loop');
        me.nodecontrols.push('loopEnd');
        me.nodecontrols.push('loopStart');
        me.nodecontrols.push('playbackRate');

        me.super();
        me.nodeInputs.push(me.createInput('source', MEPH.audio.graph.node.Node.String));
        me.nodeInputs.push(me.createInput('loop', MEPH.audio.graph.node.Node.Boolean));
        me.nodeInputs.push(me.createInput('loopEnd', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('loopStart', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('playbackRate', MEPH.audio.graph.node.Node.Number, { path: 'playbackRate.value' }));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Audio Buffer Source';
        me.hideConnector = true;
        me.sourceTitle = 'source';
        me.loopTitle = 'loop';
        me.loopEndTitle = 'loop end';
        me.loopStartTitle = 'loop start';
        me.playbackRateTitle = 'playback rate';
    }
});