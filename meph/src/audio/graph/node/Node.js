/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Node', {
    requires: ['MEPH.util.Observable'],
    statics: {
        types: {
            AudioBuffer: 'AudioBuffer',
            Boolean: 'boolean',
            Number: 'Number',
            String: 'String',
            Float32Array: 'Float32Array'
        }
    },
    properties: {
        title: null,
        type: null,
        id: null,
        nodeInputs: null,
        nodeOutputs: null
    },
    initialize: function () {
        var me = this;
        me.nodeInputs = MEPH.util.Observable.observable([]);
        me.nodeOutputs = MEPH.util.Observable.observable([]);
        me.id = MEPH.GUID();
    },
    createInput: function (name, type, options) {
        return {
            name: name,
            title: name,
            type: type,
            id: MEPH.GUID(),
            options: options || null,
            output: false
        }
    },
    createOutput: function (name, type) {
        return {
            name: name,
            title: name,
            type: type,
            id: MEPH.GUID(),
            output: true
        }
    }
});