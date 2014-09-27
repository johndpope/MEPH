MEPH.define('MEPHControls.music.view.MusicVisualizer', {
    alias: 'mephcontrols_visualizer',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView',
        'MEPH.file.Dropbox',
        'MEPH.list.List',
        'MEPH.input.Range',
        'MEPH.audio.view.Visualizer',
        'MEPH.audio.view.VisualSelector'],
    properties: {
        name: null,
        data: null,
        verticalScroll: 0
    },
    observable: {
        filelist: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Dropbox';
    },
    drawBytes: function (res) {
        var me = this;
        me.data = res.data.select(function (x) {

            var val = (x.channels[0].amplitude / x.channels[0].num);
            if (Number.NEGATIVE_INFINITY === val) return 0;
            return val;
        })
    }
});