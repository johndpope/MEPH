MEPH.define('Connection.main.view.mainview.MainView', {
    alias: 'mainview',
    templates: true,
    requires: ['MEPH.button.IconButton'],
    extend: 'MEPH.mobile.activity.view.ActivityView',
    onLoaded: function () {
        var me = this;
        me.super();
        me.hideCloseBtn()
        me.hideFooter();
        me.hideHeaderName();
    }
});