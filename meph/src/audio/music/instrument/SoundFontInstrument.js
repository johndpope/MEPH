MEPH.define('MEPH.audio.music.instrument.SoundFontInstrument', {
    extend: 'MEPH.audio.music.instrument.Instrument',
    alternateNames: ['SoundFontInstrument'],
    requires: ['MEPH.audio.soundfont.SoundFontParser',
        'MEPH.audio.Audio',
       // 'MEPH.audio.graph.node.AudioBufferSourceNode',
        'MEPH.graph.Node',
        'MEPH.audio.soundfont.chunks.data.operators.OperatorFactory',
        'MEPH.audio.Constants',
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
        $samplerate: 44100,
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
    addResource: function (file, type, res, id) {
        var me = this;
        SoundFontInstrument.getResources().push({
            file: file,
            type: type,
            result: res,
            id: id
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
    getFontResource: function (name) {
        var me = this,
            fr = SoundFontInstrument.getResource(name || (MEPH.getClassPath(me.$soundfontfile) + me.$type));
        return fr.result;
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
    note: function (key, velocity, duration) {
        var me = this;
        var audio = new MEPH.audio.Audio();
        var notesample = me.selectPreset().notesample(key, velocity);
        var decoder = me.decoder(notesample);

        var startPos = notesample.getStart();
        var endPos = notesample.getEnd();

        var startloop = notesample.getLoopStart();
        var endloop = notesample.getLoopEnd();
        var sampleraite = me.samplerate();
        duration = Math.round(duration * sampleraite) || (endPos - startPos);

        var target = new ArrayBuffer(duration * 8);
        var finaltarget = new SFByteArray(target);
        decoder.extract(finaltarget, (duration) / 2, 0, sampleraite);
        var resource = me.converFloat32(finaltarget._dataview);

        var myArrayBuffer = audio.createBuffer(2, resource.length / 2, sampleraite);
        var data1 = myArrayBuffer.getChannelData(0);
        var data2 = myArrayBuffer.getChannelData(1);

        for (var i = 0 ; i < resource.length / 2; i++) {
            data1[i] = resource[2 * i];
            data2[i] = resource[(2 * i) + 1];
        }

        return myArrayBuffer;
    },

    createNoteGraph: function (id, name) {

        var graph = new MEPH.graph.Graph(),
            node,
            audiobuffer = new MEPH.audio.graph.node.AudioBufferSourceNode();

        node = new MEPH.graph.Node();
        node.setId(MEPH.GUID());
        audiobuffer.id = MEPH.GUID();
        audiobuffer.setNodeInputDefaultValue('source', id)
        node.appendData(audiobuffer);
        node.data = audiobuffer;
        graph.addNode(node);
        var result = graph.saveGraph();
        result.id = result.id || MEPH.GUID();
        result.name = name;
        audiobuffer.destroy();
        MEPH.publish(MEPH.audio.Constants.AUDIO_GRAPH_SAVED, result);
        return result;
    },
    sampleChunks: function () {
        var me = this;
        return me.$soundfont._data.dataChunk.samplesSubchunk.records.select();
    },
    trimResource: function (resource) {
        var start = resource.firstIndex(function (x) { return x !== 0; });
        var end = resource.lastIndex(function (x) { return x !== 0; });
        if (end % 2) {
            end = Math.min(end + 1, resource.length)
        }
        resource = resource.subset(start, end);
        return resource;
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
    prepare: function (name) {
        var me = this;
        var soundfont = me.parse(name);
        me.$soundfont = soundfont;
        return Promise.resolve().then(function () { return me.$soundfont; })
    },
    parse: function (name) {
        var parser = SoundFontInstrument.getSoundFontParse();
        var me = this;
        var resource = me.getFontResource(name);
        var soundfont = parser.parse(resource);
        return soundfont;
    }
});