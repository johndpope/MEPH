MEPH.define('MEPHControls.table.view.Sequencer', {
    alias: 'mephcontrols_sequencer',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView', 'MEPH.table.Sequencer'],
    properties: {
        timeFunc: null,
        laneFunc: null,
        settimeFunc: null,
        lengthFunc: null,
        source: null
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Sequencer';
        me.timeFunc = function () {

            return {
                'function': function (item) {
                    return item.time || 0;
                }
            }
        }
        me.laneFunc = function () {
            return {
                'function': function (item) {
                    return item.lane || 0;
                }
            }
        }
        me.settimeFunc = function () {
            return {
                'function': function (time, item) {
                    return item.time = time;
                }
            }
        }
        me.lengthFunc = function () {
            return {
                'function': function (item) {
                    return item.length || 1;
                }
            }
        }
        me.source = MEPH.Observable.observable([]);
        var res = [].interpolate(0, 10, function (x) {
            return MEPH.Observable.observable({
                lane: x,
                time: x,
                length: (Math.random() * 3) + 1
            });
        });
        me.source.push.apply(me.source, res);
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    }
});