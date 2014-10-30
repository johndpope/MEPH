/**
 * @class MEPH.audio.Audio
 * Defines a base class for Audio.
 **/
MEPH.define('MEPH.audio.graph.AudioGraphReader', {
    requires: ['MEPH.audio.Audio'],
    properties: {
        $graph: null
    },
    setGraph: function (graph) {
        var me = this;
        me.$graph = graph;
    },
    getGraph: function () {
        var me = this;
        return me.$graph;
    },
    getNodes: function () {
        var me = this;

        var graph = me.getGraph();

        return graph.nodes;
    },
    /**
     * Constructs an audio object from the graph.
     * @return {MEPH.audio.Audio}
     **/
    constructAudioNodeList: function () {
        var me = this;
        if (me.hasSingleRoot()) {
            var root = me.getRoot();
            var res = me.fillListWithOrderedTree(root);
            return res;
        }
    },
    createAudio: function () {
        var me = this, audio = new MEPH.audio.Audio();
        var list = me.constructAudioNodeList();
        list.foreach(function (t) {
            switch (t.node.data.type) {
                case 'MEPH.audio.graph.node.WaveShaperNode':
                    audio.waveShaper(t);
                    break;
                case 'MEPH.audio.graph.node.PannerNode':
                    audio.panner(t);
                    break;
                case 'MEPH.audio.graph.node.OscillatorNode':
                    audio.oscillator(t);
                    break;
                case 'MEPH.audio.graph.node.GainNode':
                    audio.gain(t);
                    break;
                case 'MEPH.audio.graph.node.DynamicsCompressorNode':
                    audio.dynamicsCompressor(t);
                    break;
                case 'MEPH.audio.graph.node.ChannelMergerNode':
                    audio.merger(t);
                    break;
                case 'MEPH.audio.graph.node.ChannelSplitterNode':
                    audio.splitter(t);
                    break;
                case 'MEPH.audio.graph.node.BiquadFilter':
                    audio.biquadFilter(t);
                    break;
                case 'MEPH.audio.graph.node.DelayNode':
                    audio.delay(t);
                    break;
                case 'MEPH.audio.graph.node.Convolver':
                    audio.convolver(t);
                    break;
                case 'MEPH.audio.graph.node.AudioBufferSourceNode':
                    audio.buffer(null, t);
                    break;
                default:
                    throw new Error('unhandled type : ' + t.data.type);
            }
        });
        return audio;
    },
    /**
     * Fills the list with the nodes ordered.
     * @param {Object} root
     * @param {Array} list
     * @return {Array}
     **/
    fillListWithOrderedTree: function (root, list) {
        var me = this;
        var inputs = me.getInputs(root);
        var audionode = me.constructAudioNode(root, inputs);
        list = list || [];

        list.removeWhere(function (x) { return x.node.id === audionode.node.id; });

        list.unshift(audionode);
        inputs.foreach(function (x) {
            me.fillListWithOrderedTree(x.node, list);
        });
        return list;
    },
    /**
     * Can get the root.
     **/
    getRoots: function () {
        var me = this;
        return me.getNodes().where(function (x) { return me.getInpendentNodes(x).length === 0; });
    },
    /**
     * Returns true if the graph has a single root.
     *
     **/
    hasSingleRoot: function () {
        return this.getRoots().length === 1;
    },
    /**
     * Gets the root of the graph.
     * @returns {Object}
     **/
    getRoot: function () {
        return this.getRoots().first();
    },
    /**
     * Gets the nodes of the graph which are inputs of the node.
     * @param {Object} node
     * @return {Array}
     **/
    getInpendentNodes: function (node) {
        var me = this;
        var result = me.getGraph().connections.where(function (x) {
            var cn = x.nodes.first(function (t) { return t === node.id; });
            if (cn) {
                var cz = x.zones.first(function (t) {
                    return t.indexOf(node.id) !== -1;
                });
                if (cz) {
                    var res = me.getNodeConnectorById(cz);
                    return res.output;
                }
            }
            return false;
        }).select(function (x) {
            var cn = x.nodes.first(function (t) { return t !== node.id; });

            return me.getNodeById(cn);
        });

        return result;
    },
    /**
     * Gets the node's input connections.
     * @param {Object} node
     * @returns {Array}
     **/
    getInputs: function (node) {
        var me = this;
        var inpedentnodes = me.getGraph().connections.where(function (x) {
            var cn = x.nodes.first(function (t) { return t === node.id; });
            if (cn) {
                var cz = x.zones.first(function (t) {
                    return t.indexOf(node.id) !== -1;
                });
                if (cz) {
                    var res = me.getNodeConnectorById(cz);
                    return !res.output;
                }
            }
            return false;
        }).select(function (x) {
            var cn = x.nodes.first(function (t) { return t === node.id; });
            if (cn) {
                var cz = x.zones.first(function (t) {
                    return t.indexOf(node.id) === -1;
                });
                var ctozone = x.zones.first(function (t) {
                    return t.indexOf(node.id) !== -1;
                });
                var resto = me.getNodeConnectorById(ctozone);
                var res = me.getNodeConnectorById(cz);
                return {
                    node: me.getNodeById(x.nodes.first(function (t) { return t !== node.id; })),
                    connection: res,
                    to: resto
                }
            }
        });
        return inpedentnodes;
    },
    /**
     * Constructs the audio node.
     * @param {Object} node
     * @param {Array} inputs
     * @return {Object}
     **/
    constructAudioNode: function (node, inputs) {
        var me = this;
        switch (node.data.type) {
            case "MEPH.audio.graph.node.GainNode":
                return me.createGainNode(node, inputs);
            case 'MEPH.audio.graph.node.BiquadFilter':
                return me.createBiquadFilter(node, inputs);
            case 'MEPH.audio.graph.node.PannerNode':
                return me.createPannerNode(node, inputs);
            case 'MEPH.audio.graph.node.AudioBufferSourceNode':
                return me.createAudioBufferSourceNode(node, inputs);
            case 'MEPH.audio.graph.node.ChannelMergerNode':
                return me.createChannelMergerNode(node, inputs);
            case 'MEPH.audio.graph.node.ChannelSplitterNode':
                return me.createChannelSplitterNode(node, inputs);
            case 'MEPH.audio.graph.node.Convolver':
                return me.createConvolverNode(node, inputs);
            case 'MEPH.audio.graph.node.DelayNode':
                return me.createDelayNode(node, inputs);
            case 'MEPH.audio.graph.node.DynamicsCompressorNode':
                return me.createDynamicsCompressorNode(node, inputs);
            case 'MEPH.audio.graph.node.OscillatorNode':
                return me.createOscillatorNode(node, inputs);
            case 'MEPH.audio.graph.node.WaveShaperNode':
                return me.createWaveShaperNode(node, inputs);
            default:
                throw new Error('unhandled type : ' + node.data.type);
        }
    },
    createWaveShaperNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            curve: me.getNodeInputValue(node, inputs, 'curve'),
            oversample: me.getNodeInputValue(node, inputs, 'oversample')
        };
    },
    createOscillatorNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            detune: me.getNodeInputValue(node, inputs, 'detune'),
            frequency: me.getNodeInputValue(node, inputs, 'frequency'),
            type: me.getNodeInputValue(node, inputs, 'type')
        };
    },
    createDynamicsCompressorNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            knee: me.getNodeInputValue(node, inputs, 'knee'),
            ratio: me.getNodeInputValue(node, inputs, 'ratio'),
            reduction: me.getNodeInputValue(node, inputs, 'reduction'),
            release: me.getNodeInputValue(node, inputs, 'release'),
            threshold: me.getNodeInputValue(node, inputs, 'threshold'),
            attack: me.getNodeInputValue(node, inputs, 'attack')
        };
    },
    createDelayNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            delayTime: me.getNodeInputValue(node, inputs, 'delayTime')
        };
    },
    createConvolverNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            normalize: me.getNodeInputValue(node, inputs, 'normalize')
        };
    },
    createChannelSplitterNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer')
        };
    },
    createChannelMergerNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            buffer: me.getNodeInputValue(node, inputs, 'buffer'),
            buffer2: me.getNodeInputValue(node, inputs, 'buffer2'),
            buffer3: me.getNodeInputValue(node, inputs, 'buffer3'),
            buffer4: me.getNodeInputValue(node, inputs, 'buffer4')
        };
    },
    createAudioBufferSourceNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            source: me.getNodeInputValue(node, inputs, 'source'),
            loop: me.getNodeInputValue(node, inputs, 'loop'),
            loopEnd: me.getNodeInputValue(node, inputs, 'loopEnd'),
            loopStart: me.getNodeInputValue(node, inputs, 'loopStart'),
            playbackRate: me.getNodeInputValue(node, inputs, 'playbackRate')
        };
    },
    createPannerNode: function (node, inputs) {
        var me = this;
        return {
            node: node,
            coneInnerAngle: me.getNodeInputValue(node, inputs, 'coneInnerAngle'),
            coneOuterAngle: me.getNodeInputValue(node, inputs, 'coneOuterAngle'),
            coneOuterGain: me.getNodeInputValue(node, inputs, 'coneOuterGain'),
            refDistance: me.getNodeInputValue(node, inputs, 'refDistance'),
            rolloffFactor: me.getNodeInputValue(node, inputs, 'rolloffFactor'),
            panningModel: me.getNodeInputValue(node, inputs, 'panningModel'),
            buffer: me.getNodeInputValue(node, inputs, 'buffer')
        }
    },
    createBiquadFilter: function (node, inputs) {
        var me = this,
            q = me.getNodeInputValue(node, inputs, 'q'),
            frequency = me.getNodeInputValue(node, inputs, 'frequency'),
            gain = me.getNodeInputValue(node, inputs, 'gain'),
            type = me.getNodeInputValue(node, inputs, 'type'),
            detune = me.getNodeInputValue(node, inputs, 'detune'),
            buffer = me.getNodeInputValue(node, inputs, 'buffer');

        return {
            node: node,
            q: q,
            frequency: frequency,
            detune: detune,
            gain: gain,
            type: type,
            buffer: buffer
        }
    },
    /**
     * Create gain node.
     * @param {Object} node
     * @param {Array} inputs
     * @return {Object}
     **/
    createGainNode: function (node, inputs) {
        var me = this,
            gain = me.getNodeInputValue(node, inputs, 'gain'),
            buffer = me.getNodeInputValue(node, inputs, 'buffer');

        return {
            node: node,
            gain: gain,
            buffer: buffer
        }
    },
    /**
     * Gets the nodes input value.
     * @param {Object} node
     * @param {Array} inputs
     * @param {String} name
     * @return {Number/String/Object}
     **/
    getNodeInputValue: function (node, inputs, name) {
        var me = this;
        var input = me.getNodeInput(node, name),
            value;

        switch (input.type) {
            case 'Number':
                value = isNaN(input.defaultValue) ? null : parseFloat(input.defaultValue);
                break;
            default:
                value = input.defaultValue || null;
                break;
        }
        var inp = inputs.first(function (x) { return x.to.name === name; })
        if (inp) {
            return inp.connection;
        }
        return value;
    },
    getNodeInput: function (node, name) {
        return node.data.nodeInputs.first(function (x) { return x.name === name; })
    },
    /**
     * Gets the nodes dependencies.
     * @param {Object} node
     * @return {Array}
     **/
    getDependentNodes: function (node) {
        var me = this;
        return me.getGraph().connections.where(function (x) {
            var cn = x.nodes.first(function (t) { return t === node.id; });
            if (cn) {
                var cz = x.zones.first(function (t) {
                    return t.indexOf(node.id) !== -1;
                });
                if (cz) {
                    var res = me.getNodeConnectorById(cz);
                    return !res.output;
                }
            }
            return false;
        }).select(function (x) {
            var cn = x.nodes.first(function (t) { return t !== node.id; });

            return me.getNodeById(cn);
        })
    },
    /**
     * Gets node by id.
     * @param {String} id
     * @returns {Object}
     **/
    getNodeById: function (id) {
        var me = this;
        return me.getNodes().first(function (x) { return x.id === id; });
    },
    /**
     * Gets node connector by id
     **/
    getNodeConnectorById: function (id) {
        var me = this;
        var node = me.getNodes().first(function (x) {
            return id.indexOf(x.id) === 0;
        });
        var connector = id.split('').subset(node.id.length).join('');
        var inputoutputid = connector.split('-').where().first();
        if (inputoutputid.indexOf('output') !== -1) {
        }
        var input = node.data.nodeInputs.first(function (x) {
            return x.name === inputoutputid || x.name + 'input' === inputoutputid;
        })

        var output = node.data.nodeOutputs.first(function (x) {
            return x.name === inputoutputid || x.name + 'output' === inputoutputid;
        })

        var io = input || output;

        return io;
    }
});