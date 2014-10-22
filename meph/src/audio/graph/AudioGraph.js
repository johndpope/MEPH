/**
 * @class MEPH.audio.graph.node.PannerNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.AudioGraph', {
    templates: true,
    alias: 'audiograph',
    extend: 'MEPH.graph.GraphControl',
    requires: ['MEPH.button.Button',
        'MEPH.audio.graph.node.DelayNode',
        'MEPH.audio.graph.node.Convolver',
    'MEPH.audio.graph.node.BiquadFilter',
    'MEPH.audio.graph.node.ChannelMergerNode',
    'MEPH.audio.graph.node.ChannelSplitterNode',
    'MEPH.audio.graph.node.DynamicsCompressorNode',
    'MEPH.audio.graph.node.GainNode',
    'MEPH.audio.graph.node.OscillatorNode',
    'MEPH.audio.graph.node.PannerNode',
    'MEPH.audio.graph.node.WaveShaperNode'
    ],
    initialize: function () {
        var me = this;
        me.super();
    },
    addConvolver: function () {
        var me = this,
            node,
            convolver = new Convolver();

        me.addAudioNode(convolver);
    },
    addDelay: function () {
        var me = this,
            node,
            nodedata = new DelayNode();

        me.addAudioNode(nodedata);
    },
    addBiquadFilter: function () {
        var me = this,
            node,
            nodedata = new BiquadFilter();

        me.addAudioNode(nodedata);
    },
    addChannelMerger: function () {
        var me = this,
            node,
            nodedata = new ChannelMergerNode();

        me.addAudioNode(nodedata);
    },
    addChannelSplitter: function () {
        var me = this,
            node,
            nodedata = new ChannelSplitterNode();

        me.addAudioNode(nodedata);

    },
    addDynamicsCompressor: function () {
        var me = this,
            node,
            nodedata = new DynamicsCompressorNode();

        me.addAudioNode(nodedata);
    },
    addGain: function () {
        var me = this,
            node,
            nodedata = new GainNode();

        me.addAudioNode(nodedata);
    },
    addOscillator: function () {
        var me = this,
            node,
            nodedata = new OscillatorNode();

        me.addAudioNode(nodedata);
    },
    addPanner: function () {
        var me = this,
            node,
            nodedata = new PannerNode();

        me.addAudioNode(nodedata);
    },
    addWaveShaper: function () {
        var me = this,
            node,
            nodedata = new WaveShaperNode();

        me.addAudioNode(nodedata);
    },
    addAudioNode: function (nodedata) {
        var me = this,
            node;

        node = new MEPH.graph.Node();
        node.setId(MEPH.GUID());
        node.appendData(nodedata);
        me.addNode(node);
    }
});