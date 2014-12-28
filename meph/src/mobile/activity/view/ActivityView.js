MEPH.define('MEPH.mobile.activity.view.ActivityView', {
    alias: 'activityview',
    templates: true,
    requires: ['MEPH.button.IconButton', 'MEPH.util.Style'],
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
    hideCloseBtn: function () {
        var me = this;
        Style.hide(me.closeBtn);
    },
    onButtonClicked: function (a, b, c, d, e, f, evt) {
        var me = this;
        me.getFirstElement().dispatchEvent(MEPH.createEvent(MEPH.mobile.activity.view.ActivityView.CloseActivity, {}));
        evt.domEvent.preventDefault();
        evt.domEvent.stopPropagation();
        return false;
    }
});