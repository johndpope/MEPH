/**
* @class MEPH.mobile.application.container.MobileApplicationContainer
* Mobile application container.
*/
MEPH.define('MEPH.mobile.application.container.MobileApplicationContainer', {
    extend: 'MEPH.control.Control',
    requires: ['MEPH.mobile.application.body.MobileApplicationBody',
                'MEPH.mobile.application.header.MobileApplicationHeader',
                'MEPH.mobile.application.footer.MobileApplicationFooter'],
    templates: true,
    alias: 'mobileapplicationcontainer',
    statics: {
        events: {
            /**
             * @property application_resize
             **/
            resize: 'application_resize'
        }
    },
    properties: {
        //$resizeBuffer: 50,
        //$resizeReference: null
    },
    initialize: function () {
        var me = this;

        me.callParent.apply(me, arguments);
        //me.don('resize', me.$window, function () {
        //    if (me.$resizeReference) {
        //        clearTimeout(me.$resizeReference);
        //    }
        //    //    me.$resizeReference = setTimeout(me.resizeApplication.bind(me), me.$resizeBuffer);
        //    me.resizeApplication();
        //});
        //me.on('load', me.resizeApplication.bind(me));
    },
    getDom: function () {
        var me = this, dom;
        dom = MEPH.Array(me.getDomTemplate()).first();
        return dom;
    },
    //resizeApplication: function () {
    //    var me = this,
    //        size,
    //        Dom = MEPH.util.Dom,
    //        dom;

    //    dom = me.getDom();
    //    if (dom) {
    //        size = Dom.getWindowSize();
    //        Dom.setSize(dom, size);
    //        me.fire(MEPH.mobile.application.container.MobileApplicationContainer.events.resize, {
    //            container: me
    //        });
    //    }
    //},
    destroy: function () {
        var me = this;
        if (!me.isDestroyed()) {
            me.dun();
            me.callParent.apply(me, arguments);
        }
    }
});