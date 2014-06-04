MEPH.define('Riks.activity.products.view.Products', {
    alias: 'products',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'MEPH.list.List',
                'MEPH.button.Button',
                'MEPH.panel.Panel'],
    properties: {
        name: null
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Products';
    }
});