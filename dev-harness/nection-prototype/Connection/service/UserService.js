MEPH.define('Connection.service.UserService', {
    properties: {
        loggedin: false
    },
    initialize: function () {
        var me = this;
        MEPH.Events(me);

        MEPH.subscribe(Connection.constant.Constants.LoggedIn, function (type, args) {
            me.loggedin = true;
            me.fire('statuschanged', true);
            me.checkCredentials(args.provider);
        });
        me.hasLoggedIn = false


    },
    /**
     * Checks the users credentials.
     **/
    checkCredentials: function (provider) {
        var me = this;
        return Promise.resolve().then(function () {
            MEPH.publish(Connection.constant.Constants.ConnectionLogIn, {});

            if (provider.online && !me.hasLoggedIn) {
                MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'main', path: '/main' });
                me.hasLoggedIn = true;
                return true;
            }
            return false;
        });
    },
    toggleAccount: function (current) {
        var me = this;

        return new Promise(function (r, f) {
            setTimeout(function () {
                current.retrieving = false;
                current.using = !current.using;
            }, 2000);
            r();
        })
    },
    isLoggedIn: function () {
        var me = this;
        return me.loggedin;
    }
})