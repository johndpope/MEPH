/**
 * @class MEPH.audio.music.instrument.Instrument
 * Defines a base class for instruments.
 **/
MEPH.define('MEPH.audio.music.instrument.Instrument', {
    requires: ['MEPH.audio.Audio'],
    properties: {
        $audios: null
    },
    initialize: function () {
        var me = this;
        me.$audios = [];
    },
    ready: function (option) {
        var me = this,
            toload = me.getResourcesToLoad();
        return Promise.all(toload.select(function (x) {
            var audio = new Audio();
            me.$audios.push(audio);
            return audio.load(x.file, x.type, option);
        })).then(function () {
            return true;
        }).catch(function (e) {
            MEPH.Log(e);
            return false;
        });
    },
    getResourcesToLoad: function () {
        return [];
    }
})