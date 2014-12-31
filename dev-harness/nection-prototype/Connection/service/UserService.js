MEPH.define('Connection.service.UserService', {
    properties: {
        loggedin: false,
        $promise: null
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

        me.$promise = Promise.resolve();
    },
    /**
     * Checks the users credentials.
     **/
    checkCredentials: function (provider) {
        var me = this;
        me.$promise = me.$promise.then(function () {
            return Promise.resolve().then(function () {
                if (provider.online && !me.hasLoggedIn) {
                    MEPH.publish(Connection.constant.Constants.ConnectionLogIn, {});
                    MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'main', path: '/main' });
                    me.hasLoggedIn = true;
                    return true;
                }
                return false;
            });
        });
        return me.$promise;
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