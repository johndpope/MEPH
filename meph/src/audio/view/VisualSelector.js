/*global MEPH*/

/**
* @class
*
* This is a convenient way of defining a visual selector.
*/
MEPH.define('MEPH.audio.view.VisualSelector', {
    alias: 'visualselector',
    extend: 'MEPH.audio.view.Visualizer',
    requires: ['MEPH.input.Range'],
    templates: true,
    properties: {
        stop: 100,
        start: 0,
        step: .0001,
        max: null,
        min: null,
        smallestStep: 0.000001
    },
    initialize: function () {
        var me = this;
        me.super();
        me.on('altered', function (type, args) {
            var stop = parseFloat(me.stop) || 100;
            var start = parseFloat(me.start) || 0;

            if (args.path === 'stop') {
                if (stop < start) {
                    me.start = stop - me.smallestStep;
                }
            }
            if (args.path === 'start') {
                if (start > stop) {
                    me.stop = start + me.smallestStep;
                }
            }

        })
    }
});