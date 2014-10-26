/**
 * @class MEPH.control.Control
 * Defines a base class for all controls and views.
 **/
MEPH.define('MEPH.audio.graph.node.controls.AudioRange', {
    alias: 'audiorange',
    templates: true,
    extend: 'MEPH.audio.graph.node.controls.Control',
    properties: {
        dragareawidth: null,
        dragareaheight: null,
        dragareax: null,
        dragareay: null,
        $spaceafterconnector: 3
    },
    initialize: function () {
        var me = this;
        me.super();
    },
    onLoaded: function () {
        var me = this;
        me.super();
    },
    defineTextX: function () {
        var me = this;
        me.super();

        MEPH.util.Observable.defineDependentProperty('dragareatransform', me, ['texttransform', 'left', 'width', 'connectorxmargin', 'radius', 'bufferx'], function () {
            var result;

            if (me.left) {
                result = me.connectorxmargin + (me.radius || 0) + (me.$spaceafterconnector || 0);
            }
            else {
                result = me.width - me.connectorxmargin - me.radius - (me.$spaceafterconnector || 0);
            }
            me.bufferx = me.width / 2;

            me.dragareaheight = (me.radius * 2) || 0;
            me.dragareawidth = (me.width / 2 - me.$spaceafterconnector) || 0;
            var x = result;
            var y = parseFloat(me.radius || 0);
            me.dragareax = x;
            me.dragareay = y;
            result = 'translate(' + (x || 0) + ',' + (y || 0) + ')';
            return result;
        });
    }
})