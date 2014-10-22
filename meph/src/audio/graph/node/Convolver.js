/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.Convolver', {
    extend: 'MEPH.audio.graph.node.Node',
    alias: 'convolver',
    templates: ['MEPH.audio.graph.node.Convolver'],
    initialize: function () {
        var me = this;
        me.super();
        me.title = 'Convolver';
        me.nodeInputs.push(me.createInput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
        me.nodeInputs.push(me.createInput('normalize', MEPH.audio.graph.node.Node.Boolean));
        me.nodeOutputs.push(me.createOutput('buffer', MEPH.audio.graph.node.Node.AudioBuffer));
    }
    //    title: 'Node ' + MEPH.GUID().substr(0, 4),
    //    id: MEPH.GUID(),
    //    nodeInputs: [].interpolate(0, 3, function (x) {
    //        return {
    //            title: 'Input ',
    //            type: x,
    //            id: MEPH.GUID()
    //        }
    //    }),
    //    nodeOutputs: [].interpolate(0, 3, function (x) {
    //        return {
    //            title: 'Output ' + x,
    //            type: x,
    //            id: MEPH.GUID()
    //        }
    //    })
});