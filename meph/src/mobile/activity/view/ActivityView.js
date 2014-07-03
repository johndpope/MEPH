MEPH.define('MEPH.mobile.activity.view.ActivityView', {
    alias: 'activityview',
    templates: true,
    requires: ['MEPH.button.IconButton'],
    extend: 'MEPH.control.Control',
    statics: {
        CloseActivity: 'ActivityView : CloseActivity'
    },
    properties: {
        activityName: null,
        injectControls: {
            location: 'defaultLocation'
        }
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
    },
    onButtonClicked: function (a, b, c, d, e, f, evt) {
        var me = this;
        me.getFirstElement().dispatchEvent(MEPH.createEvent(MEPH.mobile.activity.view.ActivityView.CloseActivity, {}));
        evt.domEvent.preventDefault();
        evt.domEvent.stopPropagation();
        return false;
    }
});