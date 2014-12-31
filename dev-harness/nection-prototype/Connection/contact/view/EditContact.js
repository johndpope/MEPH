MEPH.define('Connection.contact.view.EditContact', {
    alias: 'editcontact',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService', 'identityProvider'],
    requires: ['MEPH.util.Observable',
                'MEPH.mobile.activity.view.ActivityView',
                'MEPH.input.Dropdown',
                'MEPH.input.Checkbox',
                'MEPH.util.Style'],
    properties: {
        profileImages: null,
        namesource: null,
        occupationsource: null
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
            me.occupationsource = me.occupationsource || MEPH.util.Observable.observable([]);
            me.profileImages = me.profileImages || MEPH.util.Observable.observable([]);

            me.$inj.identityProvider.getNameSources(me.namesource);
            me.$inj.identityProvider.get('occupation', me.occupationsource);
            me.$inj.identityProvider.get('profileimage', me.profileImages);

        }
    },
    selectImage: function (data) {
        var me = this;
        me.selectedImage = data;
        data.selected = true;
    },
    editMe: function () {
        var me = this;
    },
    toImageSource: function (value) {
        return value || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }

});