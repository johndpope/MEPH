MEPH.define('MEPH.mobile.activity.view.ActivityView', {
    alias: 'activityview',
    templates: true,
    extend: 'MEPH.control.Control',
    properties: {
        activityName: null,
        injectControls: {
            location: 'defaultLocation'
        }
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
    }
});