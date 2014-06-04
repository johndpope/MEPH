MEPH.define('Riks.activity.controller.OperativesReportBackController', {
    requires: ['MEPH.controller.Controller'],
    extend: 'MEPH.controller.Controller',
    properties: {
    },
    displayOrder: function (a, b, c, d, e, f, evnt) {
        var me = this,
            selecteddata = evnt.domEvent.data;
        me.model.serviceOrder = selecteddata;
    },
    translateToSomething: function (value) {
        return value;
    }
});