MEPH.define('Connection.main.view.Contact', {
    alias: 'contact_connection_view',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.input.Search', 'MEPH.util.Observable'],
    properties: {
        name: null,
        contact: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));

    },
    afterShow: function () {
        var me = this;
        var arguments = me.activityArguments;

        if (arguments.data) {
            me.contact = arguments.data;
        }
    },
    onLoaded: function () {
        var me = this;
        me.$activityview.hideCloseBtn();
        me.name = 'Contact';
    }
});