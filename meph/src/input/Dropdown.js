/*global MEPH*/

/**
* @class MEPH.input.Dropdown
* @extends MEPH.field.FormField
* This is a convenient way of defining an input control
* color css selector when using the MEPH.iconfont.IconFont#color selector syntax.
*/
MEPH.define('MEPH.input.Dropdown', {
    alias: 'dropdown',
    extend: 'MEPH.field.FormField',
    requires: ['MEPH.util.Dom'],
    templates: true,
    properties: {
        source: null,
        labelfield: 'label',
        valuefield: 'value'
    },
    initialize: function () {
        var me = this;

        me.callParent.apply(me, arguments);
        me.on('altered', me.onAltered.bind(me));
    },
    onAltered: function (type, args) {
        var me = this;
        if (args.path === 'source' || args.property === 'source') {
            me.updateselectDom();
        }
    },
    updateselectDom: function () {
        var me = this;
        if (me.selectDom) {
            me.selectDom.options.length = 0;
            if (me.source && Array.isArray(me.source) && me.source.length) {
                me.source.foreach(function (x) {
                    MEPH.util.Dom.addOption(x[me.labelfield], x[me.valuefield], me.selectDom);
                })
            }
        }

    },
    onLoaded: function () {
        var me = this;;
        me.super();
        me.updateselectDom();
    },
    /**
    * @private
    * Adds transferable properties.
    **/
    addTransferables: function () {
        var me = this,
            properties = MEPH.Array(['value']);
        me.callParent.apply(me, arguments);
        properties.foreach(function (prop) {
            me.addTransferableAttribute(prop, {
                object: me,
                path: prop
            });
        });

    }
});