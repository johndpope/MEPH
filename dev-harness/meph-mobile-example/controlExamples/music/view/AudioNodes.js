MEPH.define('MEPHControls.music.view.AudioNodes', {
    alias: 'mephcontrols_audionodes',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.input.Number',
        'MEPH.audio.graph.node.Node',
        'MEPH.audio.graph.node.Convolver'],
    properties: {
        numberValue: 400,
        cposx: '4px'
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Audio Nodes';
    }
});