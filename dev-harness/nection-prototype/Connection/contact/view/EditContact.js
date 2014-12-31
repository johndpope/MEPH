MEPH.define('Connection.contact.view.EditContact', {
    alias: 'editcontact',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService', 'identityProvider'],
    requires: ['MEPH.util.Observable',
                'MEPH.mobile.activity.view.ActivityView',
                'MEPH.input.Dropdown',
                'MEPH.util.Style'],
    properties: {
        namesource: null
    },
    initialize: function () {
        var me = this;
        me.super();
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.activityview.hideCloseBtn()
        me.initMe();
    },
    onInjectionsComplete: function () {
        var me = this;
        me.initMe();
    },
    initMe: function () {
        var me = this;
        if (me.$inj && me.$inj.identityProvider) {
            me.namesource = me.namesource || MEPH.util.Observable.observable([]);
            me.$inj.identityProvider.getNameSources(me.namesource);
        }
    },
    editMe: function () {
        var me = this;
    },
    toImageSource: function () {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }

});