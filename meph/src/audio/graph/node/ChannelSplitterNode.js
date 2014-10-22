/**
 * @class MEPH.audio.graph.node.ChannelSplitterNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.ChannelSplitterNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Channel Splitter';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeOutputs.push(me.createOutput('buffers', MEPH.audio.graph.node.Node.AudioBuffer, { count: 100 }));
    }
});