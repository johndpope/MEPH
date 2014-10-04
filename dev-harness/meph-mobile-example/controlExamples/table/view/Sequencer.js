MEPH.define('MEPHControls.table.view.Sequencer', {
    alias: 'mephcontrols_spreadsheet',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView', 'MEPH.table.Sequencer'],
    properties: {
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Sequencer';
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    }
});