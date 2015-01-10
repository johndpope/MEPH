MEPH.define('Connection.contact.view.Contact', {
    alias: 'my_contact_page',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService', 'identityProvider'],
    requires: ['MEPH.util.Observable',
        'MEPH.input.Dropdown',
        'Connection.contact.view.contactview.ContactView',
                'MEPH.util.Style'],
    properties: {
        companies: null,
        contact: null
    },
    initialize: function () {
        var me = this;
        me.great()
    },
    onLoaded: function () {
        var me = this;
        me.companies = me.companies || MEPH.util.Observable.observable([]);
        me.great()
        me.activityview.hideCloseBtn()
        me.initMe();
    },
    onInjectionsComplete: function () {
        var me = this;
        me.initMe();
    },
    initMe: function () {
        var me = this;
        if (me.$inj && me.$inj.contactService) {
            me.$inj.contactService.me().then(function (contact) {
                me.contact = contact;
            });
        }
        if (me.$inj && me.$inj.identityProvider) {
            me.$inj.identityProvider.get('companies', me.companies);
        }
    },
    editMe: function () {
        var me = this;
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, {
            viewId: 'EditContact', path: 'main/me/edit'
        });
    },
    toImageSource: function () {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }

});