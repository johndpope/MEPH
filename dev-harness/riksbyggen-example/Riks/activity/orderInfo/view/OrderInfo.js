MEPH.define('Riks.activity.orderInfo.view.OrderInfo', {
    alias: 'orderinfo',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'MEPH.input.Search',
                'MEPH.list.List',
                'MEPH.input.Text',
                'MEPH.input.MultilineText',
                'MEPH.panel.Panel'],
    properties: {
        name: null
    }, 
    onLoaded: function () {
        var me = this;
        me.name = 'Order Info';
    }
});