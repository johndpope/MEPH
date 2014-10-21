/**
 * @class MEPH.audio.graph.node.PannerNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.PannerNode', {
    extend: 'MEPH.audio.graph.node.Node',
    initialize: function () {
        var me = this;
        me.super();
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('coneInnerAngle', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('coneOuterAngle', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('conOuterGain', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('refDistance', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('rolloffFactor', MEPH.audio.graph.node.Node.Number));
        me.nodeInputs.push(me.createInput('panningModel', MEPH.audio.graph.node.Node.String, {
            values: ['equalpower', 'HRTF']
        }));

        me.nodeInputs.push(me.createInput('distanceModel', MEPH.audio.graph.node.Node.String, {
            values: ['linear', 'inverse', 'exponential']
        }));

        
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
});