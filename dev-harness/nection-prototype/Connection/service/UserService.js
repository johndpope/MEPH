MEPH.define('Connection.service.UserService', {
    properties: {
        loggedin: false
    },
    initialize: function () {
        var me = this;
        MEPH.Events(me);
        MEPH.subscribe(Connection.constant.Constants.LoggedIn, function () {
            me.loggedin = true;
            me.fire('statuschanged', true);
        })

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