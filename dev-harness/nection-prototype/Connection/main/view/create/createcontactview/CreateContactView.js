MEPH.define('Connection.main.view.create.createcontactview.CreateContactView', {
    alias: 'createcontactview',
    templates: true,
    requires: ['MEPH.button.IconButton'],
    extend: 'MEPH.mobile.activity.view.ActivityView',
    onLoaded: function () {
        var me = this;
        me.super();
        me.hideCloseBtn()
    }
});