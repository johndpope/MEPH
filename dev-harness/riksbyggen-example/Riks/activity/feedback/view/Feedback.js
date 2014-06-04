MEPH.define('Riks.activity.feedback.view.Feedback', {
    alias: 'feedback',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'MEPH.input.Dropdown',
                'MEPH.button.Button',
                'MEPH.panel.Panel'],
    properties: {
        name: null
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Feedback';
    }
});