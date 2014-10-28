/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Convolver', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'convolver',
    templates: true,
    requires: ['MEPH.audio.graph.node.controls.Control'],
    properties: {
        normalizeinputvalue: null
    },
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferinput');
        me.nodecontrols.push('normalizeinput');
        me.super();
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('normalize', MEPH.audio.graph.node.Node.Boolean));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer)); 
    },
    onLoaded: function () {
        var me = this;
        //me.inputsy = 0;
        me.title = 'Convolver';
        me.super();
    }
});