/**
 * @class MEPH.audio.graph.node.ChannelMergerNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.ChannelMergerNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();

        me.title = 'Channel Merger';
        me.nodeInputs.push(me.createInput('buffers', MEPH.audio.graph.node.Node.AudioBuffer, { count: 100 }));

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});