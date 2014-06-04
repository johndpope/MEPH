MEPH.define('Riks.activity.view.OperativesReportBack', {
    alias: 'mephricks_operativereportback',
    templates: true,
    extend: 'MEPH.control.Control',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView',
                'Riks.activity.orderInfo.view.OrderInfo',
                'Riks.activity.feedback.view.Feedback',
                'Riks.activity.search.view.Search',
                'Riks.activity.timesheet.view.Timesheet',
                'Riks.activity.products.view.Products',
                'MEPH.panel.Panel'],
    properties: {
        $removeHomePageCls: 'meph-view-remove',
        name: null,
        $operativesPromise: null
    },
    initialize: function () {
        var me = this;
        me.$operativesPromise = Promise.resolve();
        me.callParent.apply(me, arguments);
        me.on('afterload', me.activityLoaded.bind(me));

    },
    onLoaded: function () {
        var me = this;
        me.name = 'Operative Reports Back';
        me.showSearch();
    },
    showSearch: function () {
        var me = this;

        if (me.activityview.searchserviceorders) {
            MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.searchserviceorders });
        }
    },
    showOrderInfo: function () {
        var space,
            div = document.createElement('div'),
            me = this;

        if (me.activityview.orderinfo) {
            MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.orderinfo });
        }
        else {
            div.innerHTML = '<orderinfo mephid="orderinfo"></orderinfo>';
            space = me.querySelector('.operativesreportback')
            space.appendChild(div.firstElementChild);
            me.$operativesPromise = me.$operativesPromise.then(function () {
                if (me.activityview.orderinfo) {
                    me.showOrderInfo();
                }
                else
                    return Promise.resolve().then(function () { return me.loadSubControl(me.activityview, space.firstElementChild) }).then(function () {
                        MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.orderinfo });
                    });;
            });
        }
    },
    showFeeback: function () {
        var space,
            div = document.createElement('div'),
            me = this;
        if (me.activityview.feedback) {
            MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.feedback });
        }
        else {
            div.innerHTML = '<feedback mephid="feedback"></feedback>';
            space = me.querySelector('.operativesreportback')
            space.appendChild(div.firstElementChild);
            me.$operativesPromise = me.$operativesPromise.then(function () {
                if (me.activityview.feedback) {
                    me.showFeeback();
                }
                else
                    return Promise.resolve().then(function () { return me.loadSubControl(me.activityview, space.firstElementChild) }).then(function () {
                        MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.feedback });
                    });;
            });
        }
    },
    showProduct: function () {
        var space,
            div = document.createElement('div'),
            me = this;
        if (me.activityview.products) {
            MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.products });
        }
        else {
            div.innerHTML = '<products mephid="products"></products>';
            space = me.querySelector('.operativesreportback')
            space.appendChild(div.firstElementChild);
            me.$operativesPromise = me.$operativesPromise.then(function () {
                if (me.activityview.products) {
                    me.showProduct();
                }
                else
                    return Promise.resolve().then(function () { return me.loadSubControl(me.activityview, space.firstElementChild) }).then(function () {
                        MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.products });
                    });
            });
        }
    },
    showTimeSheet: function () {
        var space,
            div = document.createElement('div'),
            me = this;
        if (me.activityview.timesheet) {
            MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.timesheet });
        }
        else {
            div.innerHTML = '<timesheet mephid="timesheet"></timesheet>';
            space = me.querySelector('.operativesreportback')
            space.appendChild(div.firstElementChild);
            me.$operativesPromise = me.$operativesPromise.then(function () {
                if (me.activityview.timesheet) {
                    me.showTimeSheet();
                }
                else
                    return Promise.resolve().then(function () { return me.loadSubControl(me.activityview, space.firstElementChild) }).then(function () {
                        MEPH.publish(MEPH.Constants.showView, { activity: me.activityview.timesheet });
                    });;

            });
        }
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