MEPH.define('MEPHControls.music.controller.Controller', {
    extend: 'MEPH.controller.Controller',
    requires: ['MEPH.util.FileReader', 'MEPH.audio.Audio', 'MEPH.util.Observable'],
    properties: {
        fileResources: null,
        soundFileMarks: null,
        range: 100,
        timeScroll: 100,
        lastSong: null,
        magnification: 0
    },
    initialize: function () {
        var me = this;
        me.super();
        ///meph-event-change="ct$.loadBytes, ct$.lastSong | v$.drawBytes"
        var source = [];
        MEPH.util.Observable.observable(source)
        me.soundFileMarks = MEPH.util.Observable.observable([])
        me.fileResources = source;
    },
    loadFiles: function () {
        var me = this;
        var args = MEPH.util.Array.convert(arguments);
        var evntArgs = args.last();

        var files = args.last();

        return FileReader.readFileList(files.domEvent.files, { readas: 'ArrayBuffer' }).then(function (res) {
            res.foreach(function (t) {
                me.fileResources.push(t);
            })
        }).catch(function (e) {
            console.log(e);
        });
    },
    visualizeFile: function (file, res) {

        switch (file.type) {
            case 'audio/wav':
            case 'audio/mp3':
                return { res: res };
            default:
                return null;
        }
    },
    loadBytes: function (songBytes) {
        var me = this;
        if (!songBytes) {
            return null;
        }
        var audio = new MEPH.audio.Audio();
        var magnification = parseFloat(me.magnification || 100) ;
        var timeScroll = parseFloat(me.timeScroll || 0) / 100;
        if (me.lastSong === songBytes) {
            var start = timeScroll * me.result.buffer.buffer.duration;
            var time = me.result.buffer.buffer.duration / magnification;
            var res = MEPH.audio.Audio.quickAnalysis(me.result, start, Math.min(me.result.buffer.buffer.duration, time + start), 1000);
            return res.first().data;
        }
        else {
            me.lastSong = songBytes;
            return audio.loadByteArray(songBytes.res).then(function (result) {
                me.result = result;
                var start = timeScroll * result.buffer.buffer.duration;
                var time = result.buffer.buffer.duration * magnification;
                var res = MEPH.audio.Audio.quickAnalysis(result, start, Math.min(me.result.buffer.buffer.duration, time + start), 1000);
                return res.first().data;
            })
        }
    },
    createSnippets: function () {
        var me = this;
        console.log('create snippets of files');
        console.log(arguments);
    }
});