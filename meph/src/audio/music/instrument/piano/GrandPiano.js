/**
 * @class MEPH.audio.music.instrument.piano.GrandPiano
 * @extend MEPH.audio.music.instrument.Instrument
 * Defines a base class for instruments.
 **/
MEPH.define('MEPH.audio.music.instrument.piano.GrandPiano', {
    extend: 'MEPH.audio.music.instrument.Instrument',
    getResourcesToLoad: function () {
        var me = this;
        var prefix = 'MEPH.audio.music.instrument.piano.mp3.';
        var files = [].interpolate(0, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'A' + x) + '.mp3',
                type: 'mp3'
            }
        }).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'Ab' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(0, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'B' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(0, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'Bb' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 9, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'C' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'D' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 9, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'Db' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'E' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'Eb' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'F' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'G' + x) + '.mp3',
                type: 'mp3'
            }
        })).concat([].interpolate(1, 8, function (x) {
            return {
                file: MEPH.getClassPath(prefix + 'Gb' + x) + '.mp3',
                type: 'mp3'
            }
        }))
        return files;
    }
})