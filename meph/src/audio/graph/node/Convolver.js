/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Convolver', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'convolver',
    requires: ['MEPH.audio.graph.node.controls.Control'],
    templates: true,
    properties: {
        bufferfill: '',
        bufferTitle: ''
    },
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Convolver';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('normalize', MEPH.audio.graph.node.Node.Boolean));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    onLoaded: function () {
        var me = this;
        me.bufferfill = me.bufferfill || '#FAF332';
        me.bufferTitle = 'buffer';
        me.inputsy = 120;
        me.super();
    }
});