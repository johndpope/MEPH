MEPH.define('MEPH.audio.music.instrument.SoundFontInstrument', {
    extend: 'MEPH.audio.music.instrument.Instrument',
    alternateNames: ['SoundFontInstrument'],
    requires: ['MEPH.audio.soundfont.SoundFontParser',

        'MEPH.audio.soundfont.utils.SFByteArray',
        'MEPH.audio.soundfont.utils.NoteSampleDecoder'],
    statics: {
        soundFontParse: null,
        $resources: null,
        $decoder: null,
        getSoundFontParse: function () {
            SoundFontInstrument.soundFontParse = SoundFontInstrument.soundFontParse || new MEPH.audio.soundfont.SoundFontParser();
            return SoundFontInstrument.soundFontParse;
        },
        getResources: function () {
            SoundFontInstrument.$resources = SoundFontInstrument.$resources || [];
            return SoundFontInstrument.$resources;
        },
        getResource: function (file) {
            return SoundFontInstrument.getResources().first(function (x) { return x.file === file; });
        }
    },
    properties: {
        $soundfontfile: null,
        $soundfont: null
    },
    setFontFile: function (file, type) {
        var me = this;
        me.$soundfontfile = file;
        me.$type = type || '.sf2';
    },
    ready: function (option) {
        var me = this,
            toload = me.getResourcesToLoad();
        return Promise.all(toload.select(function (x) {
            var fontinstrument = {
                file: x.file,
                type: x.type
            };
            SoundFontInstrument.getResources().push(fontinstrument);
            return me.load(x.file, x.type, option).then(function (res) {
                fontinstrument.result = res;
            });;
        })).then(function () {
            return true;
        }).catch(function (e) {
            MEPH.Log(e);
            return false;
        });
    },
    /*
     * Loads a resouce.
     **/
    load: function (file, type, options) {
        var me = this,
            result = SoundFontInstrument.getResources().first(function (x) {
                return x.file === file && x.type === type;
            });
        if (result && result.result) {
            return Promise.resolve().then(function () {
                return result.result;
            });
        }
        return MEPH.loadJSCssFile(file, type).then(function (result) {
            return result.response;
        })
    },
    getResourcesToLoad: function () {
        var me = this;
        var files = [{
            file: MEPH.getClassPath(me.$soundfontfile) + me.$type,
            type: 'audio'
        }];

        return files;
    },
    getFontResource: function () {
        var me = this;
        return SoundFontInstrument.getResource(MEPH.getClassPath(me.$soundfontfile) + me.$type).result;
    },
    presets: function () {
        var me = this,
            soundfont = me.getSoundFont();
        if (soundfont) {
            return soundfont.getPresets();
        }
    },
    /**
     * Returns a notes frequency.
     **/
    noteToFrequency: function (note)//: int = 60.0  //: Number
    {
        note = note || 60;
        return 440.0 * Math.pow(2.0, (note + 3.0) / 12.0 - 6.0);
    },
    /**
     * Sets/Gets the sample rate of the sound font.
     ***/
    samplerate: function (rate) {
        var me = this;
        if (rate !== undefined) {
            me.$samplerate = rate;
        }

        return me.$samplerate;
    },
    getSoundFont: function () {
        var me = this;
        return me.$soundfont;
    },
    decoder: function (notesample) {
        var $decoder = new MEPH.audio.soundfont.utils.NoteSampleDecoder(notesample);
        return $decoder;
    },
    /**
     * Gets the buffer array for the key and velocity
     * @param {Number } key 
     * @param {Number } velocity
     **/
    note: function (key, velocity) {
        var me = this;
        var notesample = me.selectPreset().notesample(key, velocity);
        var decoder = me.decoder(notesample);

        var startPos = notesample.getStart();
        var endPos = notesample.getEnd();

        var intarget = new ArrayBuffer((endPos - startPos) * 8);
        var target = new SFByteArray(intarget);
        var sampleraite = me.samplerate();
        decoder.extract(target, (endPos - startPos) / 2, 0, sampleraite);
        var samples2 = me.converFloat32(target._dataview);

        return samples2;
        //var wave = new SoundFontInstrument.RiffWave();
        //wave.header.sampleRate = sampleraite;
        //wave.header.numChannels = 2;
        //wave.Make(samples2);

        //var audio = new Audio();
        //audio.src = wave.dataURI;
        //audio.loop = true;
        //return audio;
    },
    loadDataUri: function (datauri) {
        var toResolve,
            promise = new Promise(function (r) {
                toResolve = r;
            })
        var XHR = new XMLHttpRequest();
        XHR.open('GET', datauri, true);
        XHR.responseType = 'arraybuffer';
        XHR.onload = function () {

            toResolve(XHR.response)
        };

        XHR.onerror = function () {
            toFail({ error: new Error('AudioSampleLoader: XMLHttpRequest called onerror') })
        };
        XHR.send();
        return promise;
    },
    converFloat32: function (data) {
        var data_0_255 = new Float32Array(data.byteLength / 4);
        //for (var j = 0 ; j < 2 ; j++)
        for (var i = 0; i < data.byteLength / 4; i++) {
            var flo = data.getFloat32(i * 4, true)
            data_0_255[i] = flo;
            //data_0_255[i + (j * data.length)] = Math.max(.01 * data_0_255[i], ((data.length - i) / data.length) * data_0_255[i]);
        }
        return data_0_255;
    },
    convert255: function (data) {
        var data_0_255 = [];
        //for (var j = 0 ; j < 2 ; j++)
        for (var i = 0; i < data.byteLength / 4; i++) {
            var flo = data.getFloat32(i * 4, true)
            data_0_255[i] = 128 + Math.round(127 * flo);
            //data_0_255[i + (j * data.length)] = Math.max(.01 * data_0_255[i], ((data.length - i) / data.length) * data_0_255[i]);
        }
        return data_0_255;
    },
    selectPreset: function (preset) {
        var me = this,
            soundfont = me.getSoundFont(), presetIds = soundfont.getPresetIds();

        soundfont.selectPreset(preset || presetIds.first() || 0);
        return me;
    },
    /**
     * Gets a note sample with the key and velocity.
     * @param {Number} keyNum
     * @param {Number} velocity
     ****/
    notesample: function (keyNum, velocity) {
        var me = this;
        var soundfont = me.getSoundFont();
        keyNum = keyNum || 60;
        velocity = velocity || 100;
        var notesample = soundfont.getNoteSample(keyNum, velocity);
        return notesample;
    },
    prepare: function () {
        var me = this;
        var soundfont = me.parse();
        me.$soundfont = soundfont;
        return Promise.resolve().then(function () { return me.$soundfont; })
    },
    parse: function () {
        var parser = SoundFontInstrument.getSoundFontParse();
        var me = this;
        var resource = me.getFontResource();
        var soundfont = parser.parse(resource);
        return soundfont;
    }
}).then(function () {
    /* 
     * RIFFWAVE.js v0.03 - Audio encoder for HTML5 <audio> elements.
     * Copyleft 2011 by Pedro Ladaria <pedro.ladaria at Gmail dot com>
     *
     * Public Domain
     *
     * Changelog:
     *
     * 0.01 - First release
     * 0.02 - New faster base64 encoding
     * 0.03 - Support for 16bit samples
     *
     * Notes:
     *
     * 8 bit data is unsigned: 0..255
     * 16 bit data is signed: âˆ’32,768..32,767
     *
     */

    var FastBase64 = {

        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encLookup: [],

        Init: function () {
            for (var i = 0; i < 4096; i++) {
                this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
            }
        },

        Encode: function (src) {
            var len = src.length;
            var dst = '';
            var i = 0;
            while (len > 2) {
                n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
                dst += this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
                len -= 3;
                i += 3;
            }
            if (len > 0) {
                var n1 = (src[i] & 0xFC) >> 2;
                var n2 = (src[i] & 0x03) << 4;
                if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
                dst += this.chars[n1];
                dst += this.chars[n2];
                if (len == 2) {
                    var n3 = (src[i++] & 0x0F) << 2;
                    n3 |= (src[i] & 0xC0) >> 6;
                    dst += this.chars[n3];
                }
                if (len == 1) dst += '=';
                dst += '=';
            }
            return dst;
        } // end Encode

    }

    FastBase64.Init();

    var RIFFWAVE = function (data) {

        this.data = [];        // Array containing audio samples
        this.wav = [];         // Array containing the generated wave file
        this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

        this.header = {                         // OFFS SIZE NOTES
            chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
            chunkSize: 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
            format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
            subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
            subChunk1Size: 16,                    // 16   4    16 for PCM
            audioFormat: 1,                     // 20   2    PCM = 1
            numChannels: 1,                     // 22   2    Mono = 1, Stereo = 2...
            sampleRate: 8000,                  // 24   4    8000, 44100...
            byteRate: 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
            blockAlign: 0,                     // 32   2    NumChannels*BitsPerSample/8
            bitsPerSample: 8,                     // 34   2    8 bits = 8, 16 bits = 16
            subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
            subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
        };

        function u32ToArray(i) {
            return [i & 0xFF, (i >> 8) & 0xFF, (i >> 16) & 0xFF, (i >> 24) & 0xFF];
        }

        function u16ToArray(i) {
            return [i & 0xFF, (i >> 8) & 0xFF];
        }

        function split16bitArray(data) {
            var r = [];
            var j = 0;
            var len = data.length;
            for (var i = 0; i < len; i++) {
                r[j++] = data[i] & 0xFF;
                r[j++] = (data[i] >> 8) & 0xFF;
            }
            return r;
        }

        this.Make = function (data) {
            if (data instanceof Array) this.data = data;
            this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
            this.header.byteRate = this.header.blockAlign * this.sampleRate;
            this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3);
            this.header.chunkSize = 36 + this.header.subChunk2Size;

            this.wav = this.header.chunkId.concat(
                u32ToArray(this.header.chunkSize),
                this.header.format,
                this.header.subChunk1Id,
                u32ToArray(this.header.subChunk1Size),
                u16ToArray(this.header.audioFormat),
                u16ToArray(this.header.numChannels),
                u32ToArray(this.header.sampleRate),
                u32ToArray(this.header.byteRate),
                u16ToArray(this.header.blockAlign),
                u16ToArray(this.header.bitsPerSample),
                this.header.subChunk2Id,
                u32ToArray(this.header.subChunk2Size),
                (this.header.bitsPerSample == 16) ? split16bitArray(this.data) : this.data
            );
            this.dataURI = 'data:audio/wav;base64,' + FastBase64.Encode(this.wav);
        };

        if (data instanceof Array) this.Make(data);

    }; // end RIFFWAVE
    MEPH.audio.music.instrument.SoundFontInstrument.RiffWave = RIFFWAVE;



}).then(function () {
    /*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Daniel Guerrero nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

    var Base64Binary = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        /* will return a  Uint8Array type */
        decodeArrayBuffer: function (input) {
            var bytes = Math.ceil((3 * input.length) / 4.0);
            var ab = new ArrayBuffer(bytes);
            this.decode(input, ab);

            return ab;
        },

        decode: function (input, arrayBuffer) {
            //get last chars to see if are valid
            var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
            var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 1));

            var bytes = Math.ceil((3 * input.length) / 4.0);
            if (lkey1 == 64) bytes--; //padding chars, so skip
            if (lkey2 == 64) bytes--; //padding chars, so skip

            var uarray;
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            if (arrayBuffer)
                uarray = new Uint8Array(arrayBuffer);
            else
                uarray = new Uint8Array(bytes);

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            for (i = 0; i < bytes; i += 3) {
                //get the 3 octects in 4 ascii chars
                enc1 = this._keyStr.indexOf(input.charAt(j++));
                enc2 = this._keyStr.indexOf(input.charAt(j++));
                enc3 = this._keyStr.indexOf(input.charAt(j++));
                enc4 = this._keyStr.indexOf(input.charAt(j++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                uarray[i] = chr1;
                if (enc3 != 64) uarray[i + 1] = chr2;
                if (enc4 != 64) uarray[i + 2] = chr3;
            }

            return uarray;
        }
    };
    SoundFontInstrument.Base64Binary = Base64Binary;
})