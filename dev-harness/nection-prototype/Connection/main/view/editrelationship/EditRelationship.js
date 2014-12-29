MEPH.define('Connection.main.view.editrelationship.EditRelationship', {
    alias: 'edit_relationship_connection_view',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.input.Checkbox', 'Connection.main.view.editrelationship.relationshipview.RelationshipView'],
    injections: ['relationshipService', 'contactService'],
    properties: {
        contact: null,
        relationships: null,
        contactname: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
    },
    onLoaded: function () {
        var me = this;
        me.super();
        me.init();
    },
    init: function () {
        var me = this;
        me.relationships = me.relationships || MEPH.util.Observable.observable([]);
    },
    afterShow: function () {
        var me = this;
        var arguments = me.activityArguments;

        if (arguments.contact) {
            me.contact = arguments.contact;
            me.contactname = me.contact.name;
        }
        me.updateRelations();
    },
    updateRelations: function () {
        var me = this;
        if (me.$inj && me.$inj.relationshipService && me.contact) {
            me.$inj.relationshipService.getRelationshiptypes().then(function (relationships) {
                return me.$inj.contactService.getRelationShip(me.contact).then(function (description) {
                    me.relationships.clear();
                    var res = relationships.select(function (relation) {
                        var contains = description.relationships.some(function (t) {
                            return t.type === relation.type && t.relation === relation.relation;
                        });
                        relation.enabled = !!contains;
                        return relation;
                    });

                    me.init();

                    me.relationships.push.apply(me.relationships, res);
                });
            })
        }
    },
    datachanged: function (data, func, template) {
        var me = this;
        data.enabled = template.checkbox.value;
    },
    ok: function () {
        var me = this;
        if (me.$inj && me.$inj.relationshipService && me.contact) {
            return Promise.resolve().then(function () {
                return me.$inj.contactService.updateRelationship(me.contact, me.relationships.select());
            }).then(function () {
                window.history.back();
            })
        }

    },
    cancel: function () {
        window.history.back();
    },
    onInjectionsComplete: function () {
        var me = this;
        me.updateRelations();
    }
});