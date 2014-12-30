MEPH.define('Connection.menu.ConnectionMenuProvider', {
    requires: ['MEPH.util.Observable',
                'MEPH.Constants',
                'Connection.menu.template.MenuTemplate'],
    properties: {
        appMenu: null
    },
    intialize: function () {
        var me = this;
        MEPH.subscribe(Connection.constant.Constants.LoggedIn, me.onloggedIn.bind(me));
    },
    onloggedIn: function () {
        var me = this;

    },
    getTemplate: function (data) {
        var me = this;
        if (me.ownsData(data)) {
            return 'Connection.menu.template.MenuTemplate';
        }
    },
    getItems: function (data, toplevel) {
        var me = this;
        return [{
            connectionmenu: true,
            viewId: 'main',
            name: 'Contacts',
            path: 'main/contact'
        }, {
            connectionmenu: true,
            viewId: 'CreateContact',
            path: 'main/create/contact',
            name: 'New Contact'
        }, {
            connectionmenu: true,
            name: 'Accounts',
            viewId: 'Accounts',
            path: 'accounts'
        }]
    },
    ownsData: function (data) {
        var me = this;
        return data.connectionmenu === true;
    },
    /**
     * Handles an item clicked event.
     * @param {Object} data
     * @param {Boolean} getparentdata, If true, the parents data should be retrieve. If no data exists,
     * then return false;
     */
    itemClicked: function (data, getparentdata) {
        var me = this;

        if (data.viewId) {
            MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: data.viewId, path: data.path });
            if (me.appMenu) {
                return me.appMenu.close().then(function () { return true; });
            }
            return true;
        }
        return true;
    }
});