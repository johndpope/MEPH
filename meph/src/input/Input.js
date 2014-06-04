﻿/*global MEPH*/

/**
* @class
*
* This is a convenient way of defining an input control
* color css selector when using the MEPH.iconfont.IconFont#color selector syntax.
*/
MEPH.define('MEPH.input.Input', {
    alias: 'm_input',
    extend: 'MEPH.field.FormField',
    templates: true,
    properties: {
    },
    initialize: function () {
        var me = this,
            properties = MEPH.Array(['value']);

        me.callParent.apply(me, arguments);
        properties.foreach(function (prop) {
            me.addTransferableAttribute(prop, {
                object: me,
                path: prop
            });
        });
    },
    onLoaded: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.fire('altered', { path: 'type', references: [] });
    }
});