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
    isLoggedIn: function () {
        var me = this;
        return me.loggedin;
    }
})