MEPH.define('MEPHControls.music.controller.Controller', {
    extend: 'MEPH.controller.Controller',
    requires: ['MEPH.util.FileReader', 'MEPH.audio.Audio', 'MEPH.util.Observable'],
    properties: {
        fileResources: null,
        soundFileMarks: null,
        range: 100,
        timeScroll: 100,
        magnification: 0
    },
    initialize: function () {
        var me = this;
        me.super();
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
        var audio = new MEPH.audio.Audio();
        return audio.loadByteArray(songBytes.res).then(function (result) {
            return MEPH.audio.Audio.analyze(result.buffer);
        })
    },
    createSnippets: function () {
        var me = this;
        console.log('create snippets of files');
        console.log(arguments);
    }
});