/**
 * @class MEPH.audio.graph.node.ChannelMergerNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.ChannelMergerNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('detune', MEPH.audio.graph.node.Node.Number, { path: 'detune.value' }));
        me.nodeInputs.push(me.createInput('frequency', MEPH.audio.graph.node.Node.Number, { path: 'frequency.value' }));
        me.nodeInputs.push(me.createInput('type', MEPH.audio.graph.node.Node.Number, {
            values: ['sine', 'square', 'sawtooth', 'triangle', 'custom']
        }));

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});