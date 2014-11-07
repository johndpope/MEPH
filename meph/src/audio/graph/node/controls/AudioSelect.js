/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.AudioSelect', {
    alias: 'audioselect',
    templates: true,
    requires: ['MEPH.util.Dom'],
    properties: {
        titlekey: null,
        valuekey: null,
        source: null
    },
    extend: 'MEPH.audio.graph.node.controls.AudioControl',
    enterValue: function () {
        //var me = this;
        var me = this, source = (me.source || []).select(function (x) {
            if (typeof x === 'object') {
                return {
                    title: (x[me.titlekey] || x.title).substring(0, 30),
                    value: x[me.valuekey] || x.value
                }
            }
            else {
                return {
                    title: x,
                    value: x
                }
            }
        });
        var element = Dom.createSimpleSelectData(me, me.dragarea, function (val) {
            me.value = val;
            var res = source.first(function (x) { return x.value === val; });
            if (res) {
                me.title = res.title;
            }
            else {
                me.title = null;
            }
        }, me.value, source);

    }
})