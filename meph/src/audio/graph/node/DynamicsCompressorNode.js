/**
 * @class MEPH.audio.graph.node.DynamicsCompressorNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.DynamicsCompressorNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Dynamic Compressor';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('attack', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'attack.value' }));
        me.nodeInputs.push(me.createInput('knee', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'knee.value' }));
        me.nodeInputs.push(me.createInput('ratio', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'ratio.value' }));
        me.nodeInputs.push(me.createInput('reduction', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'reduction.value' }));
        me.nodeInputs.push(me.createInput('release', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'release.value' }));
        me.nodeInputs.push(me.createInput('threshold', MEPH.audio.graph.node.Node.AudioBuffer, { path: 'threshold.value' }));

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});