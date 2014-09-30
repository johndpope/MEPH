MEPH.define('MEPHControls.table.view.SpreadSheet', {
    alias: 'mephcontrols_spreadsheet',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView','MEPH.table.SpreadSheet'],
    properties: {
    },
    onLoaded: function () {
        var me = this;
        me.name = 'SpreadSheet';
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    }
});