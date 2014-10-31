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
        'MEPH.graph.SVGGraph',
        'MEPH.audio.graph.node.Convolver',
        'MEPH.graph.renderer.svg.BlenderNodeRenderer',
    'MEPH.graph.renderer.svg.ConnectionRenderer',
    'MEPH.audio.graph.node.BiquadFilter',
    'MEPH.audio.graph.node.ChannelMergerNode',
    'MEPH.audio.graph.node.ChannelSplitterNode',
    'MEPH.graph.SVGGraphRenderer',
    'MEPH.audio.graph.node.DynamicsCompressorNode',
    'MEPH.audio.graph.node.GainNode',
    'MEPH.audio.graph.node.AudioBufferSourceNode',
    'MEPH.audio.graph.node.InputNode',
    'MEPH.audio.graph.node.OscillatorNode',
    'MEPH.audio.graph.node.PannerNode',
    'MEPH.audio.graph.node.WaveShaperNode'
    ],
    initialize: function () {
        var me = this;
        me.graph = new MEPH.graph.SVGGraph();
        me.super();
    },
    statics: {
        screate: function (graph, size, selector, holder) {;
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
        me.graphviewport = MEPH.audio.graph.AudioGraph.screate(me.graph || new MEPH.graph.SVGGraph(), {
            element: 'svg'
        }, '#' + me.id + ' div.graphBody', '#' + me.id);
    },
    removeSelectedConnections: function () {
        var me = this;
        me.graph.removeConnections(me.graphviewport.getSelectedConnections().select());
        me.graphviewport.removeSelectedConnections();
    },
    saveGraph: function () {
        var me = this;
        var savedgraph = me.graph.save();
        var result = {
            connections: savedgraph.connections.select(),
            nodes: savedgraph.nodes.select(function (x) {
                return {
                    id: x.id,
                    position: x.position,
                    data: {
                        id: x.data.id,
                        type: x.data.____type,
                        nodeInputs: x.data.nodeInputs.select(),
                        nodeOutputs: x.data.nodeOutputs.select(),
                    }
                }
            })
        }
        return result;
    },
    save: function () {
        var me = this;
        return JSON.stringify(me.saveGraph());
    },
    /**
     * Loads a graph.
     **/
    loadGraph: function (graph) {
        var me = this;
        return me.graph.load(graph, me);
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
    addInput: function () {
        var me = this;
        return me.addAudioNode('MEPH.audio.graph.node.InputNode');
    },
    addAudioSource: function () {
        var me = this,
            node;
        return me.addAudioNode('MEPH.audio.graph.node.AudioBufferSourceNode');
    },
    addDelay: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.DelayNode');
    },
    addBiquadFilter: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.BiquadFilter');
    },
    addChannelMerger: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.ChannelMergerNode');
    },
    addChannelSplitter: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.ChannelSplitterNode');

    },
    addDynamicsCompressor: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.DynamicsCompressorNode');
    },
    addGain: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.GainNode');
    },
    addOscillator: function () {
        var me = this;
        return me.addAudioNode('MEPH.audio.graph.node.OscillatorNode');
    },
    addPanner: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.PannerNode');
    },
    addWaveShaper: function () {
        var me = this;

        return me.addAudioNode('MEPH.audio.graph.node.WaveShaperNode');
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