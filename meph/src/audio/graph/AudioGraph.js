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
        'MEPH.graph.SVGGraphViewPort',
        'MEPH.audio.graph.node.Convolver',
        'MEPH.graph.renderer.svg.BlenderNodeRenderer',
    'MEPH.graph.renderer.svg.ConnectionRenderer',
    'MEPH.audio.graph.node.BiquadFilter',
    'MEPH.audio.graph.node.ChannelMergerNode',
    'MEPH.audio.graph.node.ChannelSplitterNode',
    'MEPH.graph.SVGGraphRenderer',
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
    statics: {
        create: function (graph, size, selector, holder) {;
            selector = selector || 'body';
            var graphviewport = new MEPH.graph.SVGGraphViewPort();
            var graphrenderer = new MEPH.graph.SVGGraphRenderer();
            var connectionrenderer = new MEPH.graph.renderer.svg.ConnectionRenderer();
            var blenderNode = new MEPH.graph.renderer.svg.BlenderNodeRenderer(graphviewport);

            var connectionHandler = new MEPH.graph.ConnectionHandler();
            connectionHandler.setGraph(graph);
            graphviewport.setConnectionHandler(connectionHandler);

            graphviewport.setup(selector, size);
            graphrenderer.setNodeRenderer(blenderNode);
            graphrenderer.setConnectionRenderer(connectionrenderer);
            graphrenderer.setGraph(graph);
            graphrenderer.setViewPort(graphviewport);
            graphrenderer.use('viewport');
            graphviewport.setGraph(graph);
            graphrenderer.render();
            if (holder && document.querySelector(holder)) {
                graphviewport.setHolder(holder);
                graphviewport.resize();
                window.addEventListener('resize', function () {
                    graphviewport.resize();
                });
            }
            graphviewport.selectConnectionOnClick = true;
            return graphviewport;
        }
    },
    onLoaded: function () {
        var me = this;
        me.id = 'graph' + MEPH.GUID();
        me.querySelectorAll('div.graphBody').first().parentNode.setAttribute('id', me.id);
        //setTimeout(function () {
        me.graphviewport = MEPH.audio.graph.AudioGraph.create(me.graph || new MEPH.graph.Graph(), { element: 'svg' }, '#' + me.id + ' div.graphBody', '#' + me.id);
        //}, 10);
    },

    /**
     * Add convolver audio node.
     * @return {Promise}
     **/
    addConvolver: function () {
        var me = this,
            node;
        return me.addAudioNode('MEPH.audio.graph.node.Convolver');
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

        me.addAudioNode('MEPH.audio.graph.node.BiquadFilter');
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
    /**
     * Add audio node.
     * @param {String} nodedata
     * @return {Promise}
     **/
    addAudioNode: function (nodedata) {
        var me = this,
            svg = me.graphviewport.getGCanvas(),
            node;

        return me.renderControl(nodedata, svg, me).then(function (t) {
            var res = t.first();
            node = new MEPH.graph.Node();
            node.setId(MEPH.GUID());
            node.appendData(res.classInstance);
            me.addNode(node);
        })
    }
});