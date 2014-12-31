MEPH.define('Connection.contact.view.contactview.ContactView', {
    alias: 'meview',
    templates: true,
    requires: ['MEPH.button.IconButton'],
    extend: 'MEPH.mobile.activity.view.ActivityView',
    onLoaded: function () {
        var me = this;
        me.super();
        me.hideCloseBtn()
    }
});