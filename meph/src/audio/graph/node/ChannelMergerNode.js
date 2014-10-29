﻿/**
 * @class MEPH.audio.graph.node.ChannelMergerNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.ChannelMergerNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'channelmerger',
    templates: true,
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferinput');
        me.nodecontrols.push('buffer2input');
        me.nodecontrols.push('buffer3input');
        me.nodecontrols.push('buffer4input');

        me.super();

        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer, { count: 100 }));
        me.nodeInputs.push(me.createOutput('buffer2', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createOutput('buffer3', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createOutput('buffer4', MEPH.audio.graph.node.Node.AudioBuffer));

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer)); 
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Channel Merger';
    }
});