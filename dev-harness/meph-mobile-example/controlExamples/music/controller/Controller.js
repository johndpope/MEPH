MEPH.define('MEPHControls.music.controller.Controller', {
    extend: 'MEPH.controller.Controller',
    requires: ['MEPH.util.FileReader', 'MEPH.audio.Audio'],
    loadFiles: function () {
        var me = this;
        var args = MEPH.util.Array.convert(arguments);
        var evntArgs = args.last();

        var files = args.last();

        return FileReader.readFileList(files.domEvent.files, { readas: 'ArrayBuffer' }).then(function (res) {
            return res.first();
        }).catch(function (e) {
            console.log(e);
        });
    },
    loadBytes: function (songBytes) {
        var me = this;
        var audio = new MEPH.audio.Audio();
        return audio.loadByteArray(songBytes.res).then(function (result) {
            return MEPH.audio.Audio.analyze(result.buffer);
        })
    }
});