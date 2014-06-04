MEPH.define('Riks.activity.timesheet.view.Timesheet', {
    alias: 'timesheet',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container', 
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'MEPH.panel.Panel'],
    properties: {
        name: null
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Timesheet';
    }
});