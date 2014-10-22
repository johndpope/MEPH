/**
 * @class MEPH.audio.graph.node.WaveShaperNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.WaveShaperNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Wave Shaper';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('curve', MEPH.audio.graph.node.Node.Number));

        me.nodeInputs.push(me.createInput('oversample', MEPH.audio.graph.node.Node.Float32Array, {
            values: ['none', '2x', '4x']
        }));


        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});