MEPH.define('Connection.main.view.Contact', {
    alias: 'contact_connection_view',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    injections: ['contactService'],
    requires: ['MEPH.input.Search',
        'Connection.control.relationship.Relationship',
        'Connection.main.view.contactview.ContactView',
        'MEPH.util.Observable', 'MEPH.qrcode.Generator'],
    properties: {
        name: null,
        contact: null,
        $qrgenerator: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
        me.$qrgenerator = new MEPH.qrcode.Generator();

    },

    toPhoneNumber: function (val) {
        if (val)
            return 'tel:' + val.phone;
    },
    toSMS: function (val) {
        if (val)
            return 'sms:' + val.phone;
    },
    afterShow: function () {
        var me = this;
        var arguments = me.activityArguments;

        if (arguments.data) {
            me.contact = arguments.data;
        }
        me.qrcode = me.querySelector('#qrcode');
        me.$qrgenerator.setEl(me.qrcode);
        me.$qrgenerator.clear();
        me.$qrgenerator.makeCode((me.contact.id));
        if (me.$inj.contactService) {
            me.$inj.contactService.getRelationShip(me.contact).then(function (relation) {
                me.relationshipdescription.contact = relation
            })
        }
    },
    onLoaded: function () {
        var me = this;
        me.$activityview.hideCloseBtn();
        me.name = 'Contact';
    }
});