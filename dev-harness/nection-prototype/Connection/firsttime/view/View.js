MEPH.define('Connection.firsttime.view.View', {
    alias: 'firstime_connection_view',
    templates: true,
    requires: ['MEPH.mixins.Injections', 'MEPH.Constants'],
    injections: ['identityProvider', 'userService'],
    extend: 'Connection.control.accountbase.AccountBase',
    mixins: ['MEPH.mobile.mixins.Activity'],
    properties: {
        name: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
        var res = MEPH.subscribe(MEPH.Constants.provider.PROVIDERONLINE, function (args) {
            me.accountOnline(args.provider);
            MEPH.unsubscribe(res);
        });
    },
    onLoaded: function () {
        var me = this;
        me.super()
        me.name = 'First time login';

        me.loadProviders();
    },
    loadProviders: function () {
        var me = this;

        if (me.$inj && me.$inj.identityProvider && !me.notretrieved) {
            me.$inj.identityProvider.ready().then(function () {
            });
            me.notretrieved = true;
        }

    },
    logInWith: function () {
        var me = this;
        if (!me.$injectionscompleted) {
            return;
        }
        var res = me.super();
        if (res) {
            res.then(function (provider) {

                MEPH.publish(Connection.constant.Constants.LoggedIn, { provider: provider });
                return me.$inj.userService.checkCredentials(provider)
            })
        }
    },
    accountOnline: function (provider) {
        var me = this;
        MEPH.publish(Connection.constant.Constants.LoggedIn, { provider: provider });
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'main', path: '/main' });
    },
    onInjectionsComplete: function () {
        var me = this;
        me.loadProviders();
        me.$injectionscompleted = true;
        me.super();
    },
    continueTo: function () {
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'Fakelogin', path: 'fake/login' });
    }
});