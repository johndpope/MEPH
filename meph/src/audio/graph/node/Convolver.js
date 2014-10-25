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
        booleanFill: '',
        bufferTitle: '',
        audioBufferFill:'',
        normalizefill: '',
        normalizeTitle: ''
    },
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');
        me.nodecontrols.push('bufferinput');
        me.nodecontrols.push('normalizeinput');
        me.super();
        me.title = 'Convolver';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('normalize', MEPH.audio.graph.node.Node.Boolean));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    },
    setupActiveControlZones: function (viewport, node) {
        var me = this;

        viewport.requestZone(node, {
            managed: true,
            id: node.getId() + '-bufferoutput-connector',
            type: MEPH.graph.ActiveZone.type.connector,
            dom: me.bufferoutput.connector
        });

        viewport.requestZone(node, {
            managed: true,
            id: node.getId() + '-bufferinput-connector',
            type: MEPH.graph.ActiveZone.type.connector,
            dom: me.bufferinput.connector
        });

        viewport.requestZone(node, {
            managed: true,
            id: node.getId() + '-normalizeinput-connector',
            type: MEPH.graph.ActiveZone.type.connector,
            dom: me.normalizeinput.connector
        });
    },
    onLoaded: function () {
        var me = this;
        me.bufferoutput.left = false;
        me.booleanFill = me.booleanFill || '#FAF332';
        me.audioBufferFill = me.audioBufferFill || '#3AF3F2'
        me.normalizefill
        me.bufferTitle = 'buffer';
        me.normalizeTitle = 'normalize';
        me.inputsy = 0;
        me.super();
    }
});