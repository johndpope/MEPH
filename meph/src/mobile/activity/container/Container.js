///<reference path="~/extjs/ext-debug.js" />

/**
 * @class
 * The base class for Views used in the mobile application.
 */

/*global MEPH,U4,window*/
MEPH.define('MEPH.mobile.activity.container.Container', {
    extend: 'MEPH.control.Control',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView'],
    properties: {
        $removeHomePageCls: 'meph-view-remove'
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('afterload', me.activityLoaded.bind(me));
    },
    /**
     * Shows the container.
     * @returns {Promise}
     */
    show: function () {
        var me = this,
            view,
            dom;
        dom = me.getDomTemplate();
        view = dom.first();
        return me.viewTransition(view, { remove: me.$removeHomePageCls });
    },
    /**
     * Hides the container.
     * @returns {Promise}
     */
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