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
    'MEPH.audio.graph.node.GeneratedNode',
    'MEPH.audio.graph.node.ChannelSplitterNode',
    'MEPH.graph.SVGGraphRenderer',
    'MEPH.audio.graph.node.DynamicsCompressorNode',
    'MEPH.audio.graph.node.GainNode',
    'MEPH.audio.graph.node.AudioBufferSourceNode',
    'MEPH.audio.graph.node.OutputNode',
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
                var res = {
                    id: x.id,
                    position: x.position,
                    data: {
                        id: x.data.id,
                        type: x.data.____type,
                        nodeInputs: x.data.nodeInputs.select(),
                        nodeOutputs: x.data.nodeOutputs.select(),
                    }
                }
                if (x.data.subGraph) {
                    res.data.subGraph = JSON.parse(JSON.stringify(x.data.subGraph))
                }
                return res;
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
    addCustom: function () {

        var me = this;
        var seed = { "connections": [{ "id": "6634500d-dbe9-494a-abde-0231e7351ea9", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferinput-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "0b80fbbe-fd76-4164-bf08-5af3f1cee0d5", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-normalizeinput-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "b799e998-9585-4fa9-a69d-4629ddfe1dda", "nodes": ["6ffc6b32-90ef-445a-9242-72c11fb90c82", "623f508d-97d3-4532-aadf-47b8483bc234"], "zones": ["6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferoutput-connector", "623f508d-97d3-4532-aadf-47b8483bc234-bufferinput-connector"] }, { "id": "588f2211-b68f-4f5a-a272-9ee3f0998407", "nodes": ["623f508d-97d3-4532-aadf-47b8483bc234", "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983"], "zones": ["623f508d-97d3-4532-aadf-47b8483bc234-bufferoutput-connector", "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferinput-connector"] }, { "id": "d9395206-26db-4132-aadf-3cc932bc69e9", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-attack-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "dbf6afd6-ee2f-4d44-829b-648a9fe4eed1", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-knee-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "0ce7919e-6cb4-4f6c-8542-a379d3e52c78", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-ratio-connector", "ee5bda49-d7ea-43a3-83af-6d0c24de1f56-bufferoutput-connector"] }, { "id": "db902eb3-827e-4f9f-a865-aaffa4fb11b4", "nodes": ["623f508d-97d3-4532-aadf-47b8483bc234", "d8a85c16-c09d-4b50-a553-23d493b7633d"], "zones": ["623f508d-97d3-4532-aadf-47b8483bc234-buffer2output-connector", "d8a85c16-c09d-4b50-a553-23d493b7633d-bufferinput-connector"] }, { "id": "db895ac4-c900-4885-862e-94420882b5a6", "nodes": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "39d00021-74f6-4dca-abaa-01f18633c31a"], "zones": ["0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferoutput-connector", "39d00021-74f6-4dca-abaa-01f18633c31a-bufferinput-connector"] }, { "id": "f299e869-5883-464b-96ad-a4718292da60", "nodes": ["d8a85c16-c09d-4b50-a553-23d493b7633d", "39d00021-74f6-4dca-abaa-01f18633c31a"], "zones": ["d8a85c16-c09d-4b50-a553-23d493b7633d-bufferoutput-connector", "39d00021-74f6-4dca-abaa-01f18633c31a-bufferinput-connector"] }], "nodes": [{ "id": "ee5bda49-d7ea-43a3-83af-6d0c24de1f56", "position": { "x": 146, "y": 262, "z": 0 }, "data": { "id": "1d51ee23-3f12-45e4-82a1-01a33d01cbfd", "type": "MEPH.audio.graph.node.InputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": "6ffc6b32-90ef-445a-9242-72c11fb90c82-bufferinput-connector", "id": "2f586a10-52cd-4607-a830-fe265048ff18", "options": null, "output": false }, { "name": "convolver normalize", "title": "convolver normalize", "type": "boolean", "connector": "6ffc6b32-90ef-445a-9242-72c11fb90c82-normalizeinput-connector", "id": "9c04d317-b752-4823-9b6c-03e10a9d7e38", "options": null, "output": false }, { "name": "dyn attack", "title": "dyn attack", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-attack-connector", "id": "62b3289e-95ce-49f5-983f-1cb278946d92", "options": null, "output": false }, { "name": "dyn knee", "title": "dyn knee", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-knee-connector", "id": "de20033b-3c68-4527-8fe9-46ca67d8a96e", "options": null, "output": false }, { "name": "dyn ratio", "title": "dyn ratio", "type": "Number", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-ratio-connector", "id": "c9110427-c987-4935-a66b-53ecf663c847", "options": null, "output": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "4a29096e-971a-44c3-9c9a-72435c990cb5", "output": true, "isOutput": false }] } }, { "id": "39d00021-74f6-4dca-abaa-01f18633c31a", "position": { "x": 1567, "y": 206, "z": 0 }, "data": { "id": "805bea5b-05eb-425d-ab0c-857aec24ad66", "type": "MEPH.audio.graph.node.OutputNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "Anything", "connector": null, "id": "6f624af9-e991-44fd-a238-c0a8322dd133", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "gain output", "title": "gain output", "type": "AudioBuffer", "connector": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983-bufferoutput-connector", "id": "e525d3be-8e54-473c-9542-4f73c9e2849b", "output": true }, { "name": "dynamic out", "title": "dynamic out", "type": "AudioBuffer", "connector": "d8a85c16-c09d-4b50-a553-23d493b7633d-bufferoutput-connector", "id": "c6227500-909e-4760-b41f-0cc186553bdf", "output": true }] } }, { "id": "6ffc6b32-90ef-445a-9242-72c11fb90c82", "position": { "x": 427, "y": 122, "z": 0 }, "data": { "id": "68ac4d71-5acc-4e32-8e8d-6a6cec6fc206", "type": "MEPH.audio.graph.node.Convolver", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "ad868211-358f-44b3-83dd-cc032f2427f7", "options": null, "output": false, "isOutput": false }, { "name": "normalize", "title": "normalize", "type": "boolean", "connector": null, "id": "23e7c23c-01d9-4235-9ce9-474fe3e4c317", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "649bb2c8-ae1f-40d0-8889-d5900b85db72", "output": true, "isOutput": false }] } }, { "id": "623f508d-97d3-4532-aadf-47b8483bc234", "position": { "x": 685, "y": 122, "z": 0 }, "data": { "id": "39301a5e-4f74-4e76-8604-c92304b86108", "type": "MEPH.audio.graph.node.ChannelSplitterNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "007fdfbe-a36e-43d6-931b-a5f8058e0685", "options": null, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "d39b2505-508c-450d-a03b-2ed7e5e3c709", "output": true, "isOutput": false }, { "name": "buffer2", "title": "buffer2", "type": "AudioBuffer", "connector": null, "id": "811cdbfb-ea1e-4d78-8c27-53079387aac7", "output": true, "isOutput": false }, { "name": "buffer3", "title": "buffer3", "type": "AudioBuffer", "connector": null, "id": "f0ce017c-f558-43ed-ab61-9f5acd18b52e", "output": true, "isOutput": false }, { "name": "buffer4", "title": "buffer4", "type": "AudioBuffer", "connector": null, "id": "78a42222-2dea-4f3c-adc1-f7c135b7fbf6", "output": true, "isOutput": false }] } }, { "id": "0a90b8ef-75a1-4df7-ab03-4ef23a0b7983", "position": { "x": 981, "y": 150, "z": 0 }, "data": { "id": "ddeecf54-7b50-49a0-9ac2-a1ba0b1aef57", "type": "MEPH.audio.graph.node.DynamicsCompressorNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "2b2b04d7-eeba-40be-8a31-a3e99bce5ef8", "options": null, "output": false, "isOutput": false }, { "name": "attack", "title": "attack", "type": "Number", "connector": null, "id": "d0adb5da-6185-46b2-b921-4d4c8e9de391", "options": { "path": "attack.value" }, "output": false, "isOutput": false }, { "name": "knee", "title": "knee", "type": "Number", "connector": null, "id": "cc52a4d4-6235-4ba5-bccc-9426ed0889b8", "options": { "path": "knee.value" }, "output": false, "isOutput": false }, { "name": "ratio", "title": "ratio", "type": "Number", "connector": null, "id": "010917da-f370-421c-9d9c-4c01ca7163ef", "options": { "path": "ratio.value" }, "output": false, "isOutput": false }, { "name": "reduction", "title": "reduction", "type": "Number", "connector": null, "id": "dea5195d-e488-4224-8260-9b3ce9e91902", "options": { "path": "reduction.value" }, "output": false, "isOutput": false, "defaultValue": "0.18" }, { "name": "release", "title": "release", "type": "Number", "connector": null, "id": "d944d433-498d-4379-9263-3556f1b39d50", "options": { "path": "release.value" }, "output": false, "isOutput": false }, { "name": "threshold", "title": "threshold", "type": "Number", "connector": null, "id": "927a2ede-783b-48ae-bef2-da2d86fd8ec7", "options": { "path": "threshold.value" }, "output": false, "isOutput": false, "defaultValue": "0.45" }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "080c5c05-a9fd-4d2d-baa9-6d9f55c30faa", "output": true, "isOutput": false }] } }, { "id": "d8a85c16-c09d-4b50-a553-23d493b7633d", "position": { "x": 1202, "y": 48, "z": 0 }, "data": { "id": "866faa00-3713-406e-9a78-ff97c6d0fb48", "type": "MEPH.audio.graph.node.GainNode", "nodeInputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9f27bba3-98e3-42d3-8074-af49e88f0792", "options": null, "output": false, "isOutput": false }, { "name": "gain", "title": "gain", "type": "Number", "connector": null, "id": "c63af8e0-a216-4efb-aa62-aeb6a7e73045", "options": { "path": "gain.value" }, "output": false, "isOutput": false }], "nodeOutputs": [{ "name": "buffer", "title": "buffer", "type": "AudioBuffer", "connector": null, "id": "9d6b1fe4-18cb-46e3-8370-5a101ace1ee2", "output": true, "isOutput": false }] } }] };
        return me.addAudioNode('MEPH.audio.graph.node.GeneratedNode', seed)
    },
    addOutput: function () {
        var me = this;
        return me.addAudioNode('MEPH.audio.graph.node.OutputNode');
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
    addAudioNode: function (nodedata, injections) {
        var me = this,
            svg = me.graphviewport.getGCanvas(),
            node;

        return me.renderControl(nodedata, svg, me, null, injections).then(function (t) {
            var res = t.first();
            node = new MEPH.graph.Node();
            node.setId(MEPH.GUID());
            node.appendData(res.classInstance);
            me.addNode(node);
        })
    }
});