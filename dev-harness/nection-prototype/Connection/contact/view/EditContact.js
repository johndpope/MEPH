MEPH.define('Connection.contact.view.EditContact', {
    alias: 'editcontact',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService', 'identityProvider'],
    requires: ['MEPH.util.Observable',
                'MEPH.mobile.activity.view.ActivityView',
                'MEPH.input.Dropdown',
                'Connection.constant.Constants',
                'MEPH.input.Radio',
                'MEPH.util.Style'],
    properties: {
        profileImages: null,
        namesource: null,
        occupationsource: null,
        profileimagesource: null
    },
    initialize: function () {
        var me = this;
        me.great()

        MEPH.subscribe([Connection.constant.Constants.LoggedOut, Connection.constant.Constants.LoggedIn], function () {
            me.initMe();
        })
    },
    onLoaded: function () {
        var me = this;
        me.great()
        me.activityview.hideCloseBtn()
        me.initMe();
        me.activityview.hideHeader();
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
        // me.profileimagesource = data.value;
        me.activityview.currentprofileimage.src = data.value;
    },
    editMe: function () {
        var me = this;
    },
    toImageSource: function (value) {
        return value || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }

});