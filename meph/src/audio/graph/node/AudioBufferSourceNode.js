/**
 * @class MEPH.audio.graph.node.AudioBufferSourceNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.AudioBufferSourceNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Audio Buffer Source';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('loop', MEPH.audio.graph.node.Node.Boolean));
        me.nodeInputs.push(me.createInput('loopEnd', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('loopStart', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('playbackRate', MEPH.audio.graph.node.Node.Number, { path: 'playbackRate.value' }));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});