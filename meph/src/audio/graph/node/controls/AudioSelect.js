/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.AudioSelect', {
    alias: 'audioselect',
    templates: true,
    requires: ['MEPH.util.Dom'],
    properties: {
        source: null
    },
    extend: 'MEPH.audio.graph.node.controls.AudioControl',
    enterValue: function () {
        //var me = this;
        var me = this;
        var element = Dom.createSimpleSelectData(me, me.dragarea, function (val) {
            me.value = val;
        }, me.value, me.source || []);

    }
})