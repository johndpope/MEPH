MEPH.define('Connection.firsttime.view.View', {
    alias: 'firstime_connection_view',
    templates: true,
    requires: ['MEPH.mixins.Injections'],
    injections: ['identityProvider'],
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    properties: {
        name: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    },
    onLoaded: function () {
        var me = this;
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
    onInjectionsComplete: function () {
        var me = this;
        me.loadProviders();
    },
    continueTo: function () {
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'Fakelogin', path: 'fake/login' });
    }
});