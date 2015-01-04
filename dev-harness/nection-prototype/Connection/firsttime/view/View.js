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
        //setTimeout(function () {

        //    // Additional params
        //    var additionalParams = {
        //        'theme': 'dark'
        //    };
        //    MEPH.Log('rendering button')
        //    gapi.signin.render('myButton', additionalParams);
        //    MEPH.Log('rendered button')
        //}, 5000)
    },
    signin: function () {
        MEPH.Log('sign in');
        var additionalParams = {
            callback: function (authResult) {
                GooglePlusProvider.response = authResult;

                MEPH.Log('login call back ' + authResult);

                if (authResult['status']['signed_in']) {
                    MEPH.Log('login success');
                    // Update the app to reflect a signed in user
                    gapi.client.load('plus', 'v1').then(function () {
                        // Hide the sign-in button now that the user is authorized, for example:
                        MEPH.Log('login : loaded the client ');
                        MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                            provider: provider,
                            online: true
                        });
                        r(true);
                    });
                }
                else {
                    MEPH.Log('login : not successful');
                    MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                        provider: provider,
                        online: false
                    });
                    // Update the app to reflect a signed out user
                    // Possible error values:
                    //   "user_signed_out" - User is signed-out
                    //   "access_denied" - User denied access to your app
                    //   "immediate_failed" - Could not automatically log in the user
                    r(false);
                }
            }
        }
        if (gapi.auth.signIn) {
            MEPH.Log('pre sign in');
            try {
                gapi.auth.signIn(additionalParams);
            }
            catch (e) {
                MEPH.Log('error caught : google login');
                MEPH.Log(e);
            }
            finally {
                MEPH.Log('Not logged in')
            }
        }
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
                if (provider.online) {
                    //MEPH.publish(Connection.constant.Constants.LoggedIn, { provider: provider });

                    return me.$inj.userService.checkCredentials(provider)
                }
            });
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