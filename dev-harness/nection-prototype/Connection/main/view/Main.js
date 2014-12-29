MEPH.define('Connection.main.view.Main', {
    alias: 'main_connection_view',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.input.Search',
        'MEPH.util.Observable',
        'Connection.main.view.mainview.MainView'],
    properties: {
        listsource: null,
        name: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Main';
        me.listsource = MEPH.util.Observable.observable([]);
        [].interpolate(0, 10, function (i) {
            me.listsource.push({
                name: 'Kass ' + i,
                phone: '+17634287335',
                address: '4100 Raspberry Dr.',
                title: ['Expert Design Blogger', 'Realtor', 'Mechanical Engineer', 'Plumber'].random().first(),
                id: MEPH.GUID()
            })
        });
        me.orgsource = me.listsource.select();
    },
    toImageSource: function () {
        var me = this;
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    },
    searchChanged: function (type, val) {
        var me = this;
        if (me.$timeout) {
            clearTimeout(me.$timeout);
            me.$timeout = null;
        }
        var val = MEPH.Array(arguments).last().domEvent.val;
        me.$timeout = setTimeout(function () {

            me.listsource.clear();
            me.orgsource.where(function (x) {
                return JSON.stringify(x).indexOf(val) !== -1;
            }).foreach(function (t) {
                me.listsource.push(t);
            });
        }, 1000)

    },
    openContact: function (data) {
        MEPH.publish(MEPH.Constants.OPEN_ACTIVITY, { viewId: 'Contact', path: 'main/contact', data: data });
    }
});