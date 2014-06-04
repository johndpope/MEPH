
MEPH.define('MEPH.input.Image', {
    alias: 'camera',
    extend: 'MEPH.input.Input',
    properties: {
        type: 'file'
    },
    onLoaded: function () {
        var me = this, input;
        me.callParent.apply(me, arguments);
        input = me.querySelector('input');
        input.setAttribute('capture', 'camera');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('type', me.type);
    }
});