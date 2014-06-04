MEPH.define('Riks.activity.model.OperativesReportBackModel', {
    requires: ['MEPH.mixins.Referrerable',
                'MEPH.util.DataModel',
                'MEPH.mixins.Observable'],
    mixins: {
        observable: 'MEPH.mixins.Observable',
        referrerable: 'MEPH.mixins.Referrerable'
    },
    properties: {
        availableTabs: null,
        serviceOrder: null,
        serviceOrders: null
    },
    initialize: function () {
        var me = this;
        me.mixins.referrerable.init.apply(me);
        me.mixins.observable.init.apply(me);
        me.$referenceConnections = MEPH.Array([{
            type: MEPH.control.Control.connectables.control, obj: me
        }]);
        me.availableTabs = [];
        me.serviceOrders = MEPH.util.Observable.observable([]);
        me.loadServiceOrders();
    },
    serviceOrderValidationRules: function () {
        return [{
            path: 'objectRef', rule: function (obj, path, params) {
                if (obj.objectRef === 'notvalid') {
                    return { error: 'object ref is not valid', result: false };
                }
                return true;
            }
        }]
    },
    loadServiceOrders: function () {
        var me = this;

        MEPH.MobileServices.get('serviceCaller').then(function (serviceCaller) {
            return serviceCaller.call('fieldforce/mobile/serviceorders/en').then(function (result) {
                result = JSON.parse(result.responseText);
                var rules = me.serviceOrderValidationRules();
                MEPH.util.DataModel.model(result, rules);
                me.model.serviceOrders.removeWhere(function () { return true; });
                result.foreach(function (x) {
                    me.model.serviceOrders.push(x);
                });
            })
        }).catch(function (error) {
            MEPH.Log(error);
        });;
    }
});