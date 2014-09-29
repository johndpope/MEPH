MEPH.define('MEPHControls.music.view.MusicVisualizer', {
    alias: 'mephcontrols_visualizer',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: ['MEPH.mobile.activity.view.ActivityView',
        'MEPH.file.Dropbox',
        'MEPH.audio.Audio',
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
    copySnippet: function (snippet) {
        var me = this;

        return MEPH.audio.Audio.copy(snippet);
    },
    playSnippet: function (snippet) {
        if (snippet) {
            var audio = new MEPH.audio.Audio();
            audio.buffer(snippet.buffer).gain({ name: 'gain', volume: 1 }).complete();

            snippet.buffer.onended = function () {
                audio.disconnect();
                delete audio;
                delete snippet.buffer;
            }
            snippet.buffer.start();
        }
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Dropbox';
    },
    drawBytes: function (res) {
        var me = this;
        if (!res) {
            return null;
        }
        me.data = res
    }
});