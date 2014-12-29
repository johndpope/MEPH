MEPH.define('Connection.application.header.ApplicationHeader', {
    extend: 'MEPH.mobile.application.header.MobileApplicationHeader',
    templates: true,
    requires: ['Connection.constant.Constants', 'MEPH.util.Style'],
    injections: ['userService'],
    alias: 'connectionapplicationheader',
    initialize: function () {
        var me = this;
        me.super();
        MEPH.subscribe(Connection.constant.Constants.LoggedIn, me.onloggedIn.bind(me));
    },
    onLoaded: function () {
        var me = this;

        if (me.$inj && me.$inj.userService) {
            if (me.$inj.userService.isLoggedIn()) {
                me.onloggedIn();
            }
        }
    },
    gotoCreateContact: function () {
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'CreateContact', path: 'main/create/contact' });
    },
    onInjectionsCompleted: function () {
        var me = this;
        if (me.$inj && me.$inj.userService) {
            me.$inj.userService.on('statuschanged', function (type, status) {
                if (status) {
                    me.headerdom.classList.add('connection-show');
                }
                else {
                    me.headerdom.classList.remove('connection-show');
                }
            });
            if (me.$inj.userService.isLoggedIn()) {
                me.onloggedIn();
            }
        }
    },
    onloggedIn: function () {
        var me = this;
        me.loggedin = true;
        me.headerdom.classList.add('connection-show');
    }
});