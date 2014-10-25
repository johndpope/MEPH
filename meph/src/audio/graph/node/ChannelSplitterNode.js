/**
 * @class MEPH.audio.graph.node.ChannelSplitterNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.ChannelSplitterNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'channelsplitter',
    templates: true,
    properties: {
    },
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferoutput2');
        me.nodecontrols.push('bufferoutput3');
        me.nodecontrols.push('bufferoutput4');
        me.nodecontrols.push('bufferinput');

        me.super();
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeOutputs.push(me.createOutput('buffers', MEPH.audio.graph.node.Node.AudioBuffer, { count: 100 }));
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.bufferoutput2.left = false;
        me.bufferoutput3.left = false;
        me.bufferoutput4.left = false;
        me.title = 'Channel Splitter';

    }
});