/**
 * @class MEPH.audio.graph.node.GainNode
 * @extend MEPH.audio.graph.node.Node
 **/
MEPH.define('MEPH.audio.graph.node.InputNode', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'inputnode',
    requires: ['MEPH.audio.graph.node.controls.InputCollection'],
    templates: true,
    properties: {
        gainTitle: '',
        gainvalue: null
    },
    initialize: function () {
        var me = this;

        me.nodecontrols = me.nodecontrols || [];
        me.nodecontrols.push('bufferoutput');

        me.super();

        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.Anything));

    },
    setupActiveZones: function (viewport, node) {
        var me = this;
        node.on('connectionadded', me.onNodeChanged.bind(me));
        return me.super();
    },
    onNodeChanged: function (type, type2, args) {
        var me = this;
        debugger
        args.added.where(function (connection) {
            return connection.getZones().length > 1
        }).foreach(function (connection) {
            var zone = connection.getZones().first(function (x) {
                return x.getOptions().connectortype !== 'Anything'
            });
            if (zone)
                me.addNodeOutput(zone.getOptions().property, zone.getOptions().connectortype);
        })
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.title = 'Input(s)';

        me.fire('altered', { path: 'nodeOutputs' })
    }

});