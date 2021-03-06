﻿MEPH.define('MEPHControls.communication.view.Communication', {
    alias: 'mephcontrols_communication',
    templates: true,
    extend: 'MEPH.control.Control',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'MEPH.pad.DrawingSurface',
                'MEPH.list.List', 'MEPH.button.IconButton',
                 'MEPH.input.Text',
                'MEPH.panel.Panel'],
    properties: {
        name: null
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Communication Example';
    },
    show: function () {
        var me = this,
            view,
            dom;
        dom = me.getDomTemplate();
        view = dom.first();
        return me.viewTransition(view, { remove: me.$removeHomePageCls });
    },
    hide: function () {
        var me = this,
            view,
            dom = me.getDomTemplate();

        view = dom.first();
        return me.viewTransition(view, { add: me.$removeHomePageCls });
    },
    close: function () {
        var me = this;
    },
    open: function () {
        var me = this;
    }
});