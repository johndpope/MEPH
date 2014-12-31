﻿MEPH.define('Connection.main.view.contactview.ContactView', {
    alias: 'contactview',
    templates: true,
    requires: ['MEPH.button.IconButton'],
    extend: 'MEPH.mobile.activity.view.ActivityView',
    onLoaded: function () {
        var me = this;
        me.super();
        me.hideCloseBtn()
    }
});