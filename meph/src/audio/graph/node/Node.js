/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Node', {
    requires: ['MEPH.util.Observable'],
    statics: {
        types: {
            AudioBuffer: 'AudioBuffer',
            Boolean: 'boolean'
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
    createInput: function (name, type) {
        return {
            name: name,
            type: type,
            output: false
        }
    },
    createOutput: function (name, type) {
        return {
            name: name,
            type: type,
            output: true
        }
    }
});