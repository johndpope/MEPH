/**
 * @class MEPH.audio.Audio
 * Defines a base class for Audio.
 **/
MEPH.define('MEPH.audio.graph.AudioGraphReader', {
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
    constructAudio: function () {
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