/**
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

        me.super();

        me.nodeInputs.push(me.createInput('buffers', MEPH.audio.graph.node.Node.AudioBuffer, { count: 100 }));

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Channel Merger';
    }
});