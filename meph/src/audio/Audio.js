/**
 * @class MEPH.audio.Audio
 * Defines a base class for Audio.
 **/
MEPH.define('MEPH.audio.Audio', {
    requires: ['MEPH.util.Dom', 'MEPH.util.Observable'],
    statics: {
        /**
         * Audio context.
         */
        audioCtx: null,

        sourcebuffer: null,
        CHANGED_BUFFER_SOURCE: 'CHANGED_BUFFER_SOURCE',
        nodeTypes: {
            oscillator: 'oscillator',
            gain: 'gain',
            convolver: 'convolver',
            delay: 'delay',
            dynamicsCompressor: 'dynamicsCompressor',
            waveShaper: 'waveShaper',
            analyser: 'analyser',
            splitter: 'splitter',
            merger: 'merger',
            periodicWave: 'periodicWave',
            panner: 'panner',
            buffer: 'buffer ',
            biquadFilter: 'biquadFilter'
        },
        GetSourceBuffer: function () {
            MEPH.audio.Audio.$sourcebuffer = MEPH.audio.Audio.$sourcebuffer || [];
            return MEPH.audio.Audio.$sourcebuffer;
        },
        /**
         * Does a quick analysis of resource.
         **/
        quickAnalysis: function (resource, start, end, frames) {
            var result = [];

            start = start || 0;
            end = end || resource.buffer.buffer.duration;

            var sampleRate = resource.buffer.buffer.sampleRate;
            var startframe = sampleRate * start;
            var endFrame = sampleRate * end;
            var frameCount = endFrame - startframe;
            frames = frames || 2000;
            frames = Math.min(frames, 2000);
            frames = Math.round(Math.max(1, frameCount / frames));
            for (var i = 0 ; i < resource.buffer.channelCount; i++) {
                var channeldata = resource.buffer.buffer.getChannelData(i);
                var subres = channeldata.skipEveryFromTo(Math.round(frames), Math.round(startframe), Math.round(endFrame), function (x) { return x; });
                result.push({ channel: i, data: subres });
            }
            return result;
        },

        copy: function (resource, options) {
            var audio = new MEPH.audio.Audio();
            return audio.copyToBuffer(resource, 0, resource.buffer.buffer.duration, options);

        },
        analyze: function (audiofile, audiofiletyp, resolution) {
            var audio = new MEPH.audio.Audio(),
                func = function (result) {
                    if (resolution === undefined) {
                        resolution = Math.max(1, Math.round((result.buffer.buffer.duration * result.buffer.buffer.sampleRate) / 5760));
                    }
                    audio.buffer(result.buffer).volume({ name: 'volume', resolution: resolution }).gain({ name: 'gain', volume: 0 }).complete();
                    return new Promise(function (r) {

                        result.buffer.onended = function () {
                            var volume = audio.get({ name: 'volume' }).first();
                            audio.disconnect();
                            result.buffer.stop();
                            r(volume);
                        }
                        result.buffer.start();

                    });
                };
            if (arguments.length === 2) {
                return audio.load(audiofile, audiofiletyp).then(function (resource) {

                    var result = audio.copyToBuffer(resource, 0, resource.buffer.buffer.duration);
                    return func(result)
                })
            }
            else if (arguments.length === 1) {
                return func({ buffer: audiofile });
            }
        },
        /**
         * Extracts a clip from a resoure
         * @param {Object} resource
         * @param {Number} from
         * @param {Number} to
         ***/
        clip: function (resource, from, to, options) {

            var audio = new MEPH.audio.Audio();


            return audio.copyToBuffer(resource, from, to, options);
        }
    },
    properties: {
        /**
         * Audio context.
         */
        audioCtx: null,
        nodes: null,
        sourcebuffer: null,
        title: 'Untitled',
        id: null,
        offlineContext: false
    },
    initialize: function (injections) {
        var me = this;
        MEPH.applyIf(injections, me);
        me.nodes = [];
        me.id = MEPH.GUID();
        me.sourcebuffer = [];
    },
    /**
     * Loads a resouce.
     **/
    load: function (file, type, options) {
        var me = this,
            result = me.getBufferSources().first(function (x) {
                return x.file === file && x.type === type;
            });
        if (result) {
            return Promise.resolve().then(function () {
                return result;
            });
        }
        return MEPH.loadJSCssFile(file, type).then(function (result) {
            return me.loadByteArray(result.response, options, file, type);
        })
    },
    /**
     * Loads a byte array.
     * @param {ByteArray} bytearray
     * @return {Promise}
     ***/
    loadByteArray: function (bytearray, options, file, type) {
        var me = this, toresolve, tofail;
        var promise = new Promise(function (r, s) {
            toresolve = r;
            tofail = s;
        });

        var context = me.createContext(options);

        context.decodeAudioData(
          bytearray,
          function (buffer) {
              var sbuffer = me.buffersource();
              sbuffer.buffer = buffer;

              me.addBufferSource({
                  buffer: sbuffer,
                  file: file,
                  type: type
              });

              toresolve(me.getBufferSources().last());
          },
          function (e) {
              tofail(e);
          });
        return promise;
    },
    /**
     * Copies a section of a buffer to a new buffer,
     * @param {Object} resource
     * @param {Number} start
     * @param {Number} end
     **/
    copyToBuffer: function (resource, start, end, options) {
        var buffer = resource.buffer;
        var rate = buffer.buffer.sampleRate;
        var channels = buffer.channelCount;
        var me = this;
        var duration = (end - start);
        var frame_start = Math.round(start * rate);
        var frame_end = Math.round(end * rate);
        var frameCount = frame_end - frame_start;
        frameCount = Math.round(frameCount);
        var audioCtx = me.createContext(options);
        var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

        // Fill the buffer with white noise;
        // just random values between -1.0 and 1.0
        for (var channel = 0; channel < channels; channel++) {
            // This gives us the actual array that contains the data
            var nowBuffering = myArrayBuffer.getChannelData(channel);
            var bufferdata = buffer.buffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = bufferdata[i + frame_start];
            }
        }
        var source = audioCtx.createBufferSource();

        // set the buffer in the AudioBufferSourceNode
        source.buffer = myArrayBuffer;
        return { name: MEPH.GUID(), buffer: source, type: '' };
    },
    /**
     * Sets the duration to be played.
     **/
    duration: function (time) {
        //Todo: define a proper way to get the duration of the audio.
        if (time !== undefined || time !== null) {
            this.$duration = time;
        }
        return this.$duration || 1;
    },
    getBufferSources: function () {
        var me = this, Audio = MEPH.audio.Audio;
        Audio.$sourcebuffer = Audio.$sourcebuffer || [];
        return MEPH.audio.Audio.$sourcebuffer.select();
    },
    /**
     * Adds a buffer source.
     * @param {Object} options
     * @return {Array}
     ***/
    addBufferSource: function (options) {
        var me = this, Audio = MEPH.audio.Audio;
        
        Audio.$sourcebuffer = Audio.$sourcebuffer || ([]);//MEPH.util.Observable.observable
        options.id = options.id || MEPH.GUID();
        Audio.$sourcebuffer.push(options);
        MEPH.publish(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, options, Audio.$sourcebuffer);
        return options;
    },
    /**
     * Remove buffer source by id.
     * @param {String} id
     * @return {Array}
     ***/
    removeBufferSource: function (id) {
        var Audio = MEPH.audio.Audio;
        if (Audio.$sourcebuffer) {
            MEPH.publish(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, Audio.$sourcebuffer);
            return Audio.$sourcebuffer.removeWhere(function (t) { return t.id === id; });
        }
        return null;
    },
    createContext: function (options) {
        var me = this;
        if (options || me.offlineMode) {
            me.offlineMode = true;
            var audioCtx = MEPH.audio.Audio.OfflineAudioContext || me.offlineAudioCtx || new (window.OfflineAudioContext)(options.channels || 32, options.length || 10000, options.sampleRate || 44100);
            if (options) {
                audioCtx.addEventListener('complete', options.oncomplete);
            }
            MEPH.audio.Audio.OfflineAudioContext = audioCtx;
            //MEPH.audio.Audio.AudioContext = me.audioCtx;
            me.currentContext = audioCtx;
            return audioCtx;
        }
        else {
            me.audioCtx = MEPH.audio.Audio.AudioContext || me.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            MEPH.audio.Audio.AudioContext = me.audioCtx;

            me.currentContext = audioCtx;
            return me.audioCtx;
        }
    },
    getContext: function () {
        var me = this;
        return me.currentContext;
    },
    buffersource: function (options) {
        var me = this;
        var context = me.createContext(options);
        return context.createBufferSource();
    },
    buffer: function (buffer, options) {
        var me = this;
        options = options || {};

        if (!buffer && options.source) {
            var res = MEPH.audio.Audio.$sourcebuffer.first(function (x) { return x.id === options.source; })
            if (res) {
                buffer = res.buffer.buffer;
            }
        }
        if (!buffer && MEPH.audio.Audio.$sourcebuffer) {
            var res = MEPH.audio.Audio.$sourcebuffer.first(function (x) { return x; })
            if (res) {
                buffer = res.buffer.buffer;
            }
        }
        options.buffer = buffer instanceof AudioBufferSourceNode ? buffer.buffer : buffer;
        options.noinputs = true;
        me.nodes.push({ options: options, buffer: buffer, type: MEPH.audio.Audio.nodeTypes.buffer })
        return me;
    },
    /**
     * Analyses the volume. This doesnt really work at all.
     * @param {Object} options
     * @param {Number} options.resolution
     **/
    volume: function (options) {
        var me = this;
        var context = me.createContext();

        // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
        var scriptNode = context.createScriptProcessor(4096, 1, 1);

        var nodecontext = { options: options || null, node: scriptNode };
        me.nodes.push(nodecontext);
        nodecontext.data = [];
        // Give the node a function to process audio events
        scriptNode.onaudioprocess = function (nodecontext, audioProcessingEvent) {
            // The input buffer is the song we loaded earlier
            var inputBuffer = audioProcessingEvent.inputBuffer;

            // The output buffer contains the samples that will be modified and played
            var outputBuffer = audioProcessingEvent.outputBuffer;
            // Loop through the output channels (in this case there is only one)
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                var inputData = inputBuffer.getChannelData(channel);
                var outputData = outputBuffer.getChannelData(channel);

                // Loop through the 4096 samples
                for (var sample = 0; sample < inputBuffer.length; sample++) {
                    // make output equal to the same as the input
                    outputData[sample] = inputData[sample];
                    var data = {};
                    if (sample % (options.resolution || 32) === 0) {
                        data[channel] = { amplitude: 0, num: 0 };
                        data[channel].amplitude += Math.pow((inputData[sample]), 2);
                        data[channel].num++;
                        nodecontext.data.push({ channels: data });
                    }
                }
            }
        }.bind(me, nodecontext);
        return me;
    },
    /**
     * Processor node.
     * @param {Object} options
     * @param {Number} options.resolution
     **/
    processor: function (options) {
        var me = this;
        var context = me.createContext();
        if (!options || !options.process) {
            throw new Error('Processor requires a process function.')
        }
        // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
        var scriptNode = context.createScriptProcessor(1024, 1, 1);

        var nodecontext = { options: options || null, node: scriptNode };
        me.nodes.push(nodecontext);
        nodecontext.data = [];
        // Give the node a function to process audio events
        scriptNode.onaudioprocess = options.process;

        return me;
    },
    /**
     * Creates an oscillator node
     **/
    oscillator: function (options) {
        var me = this, params = me.createK().concat(me.createA('frequency', 'detune')).concat(me.createS('type'));
        options = options || {};
        options.noinputs = true;
        me.createNode(options, function () {
            return MEPH.audio.Audio.nodeTypes.oscillator;
        }, params)
        return me;
    },
    /**
     * The ConvolverNode interface is an AudioNode that performs a Linear Convolution on a given AudioBuffer, often used to achieve a reverb effect. A ConvolverNode always has exactly one input and one output.
     * @param {Object} options
     * @return {MEPH.audio.Audio}
     **/
    convolver: function (options) {
        var me = this, params = me.createK().concat(me.createA()).concat(me.createParams('boolean', 'normalize'));

        me.createNode(options, function () { return MEPH.audio.Audio.nodeTypes.convolver }, params)
        return me;
    },
    delay: function (options) {
        var me = this, params = me.createK().concat(me.createA('delayTime'));

        me.createNode(options, function () { return MEPH.audio.Audio.nodeTypes.delay }, params)
        return me;
    },
    dynamicsCompressor: function (options) {
        var me = this, params = me.createK('attack', 'knee', 'ratio', 'reduction', 'release', 'threshold').concat(me.createA());

        me.createNode(options, function () {
            return MEPH.audio.Audio.nodeTypes.dynamicsCompressor
        }, params)
        return me;

    },
    waveShaper: function (options) {
        var me = this, params = me.createS('oversample').concat(me.createParams('float32array', 'curve'));

        me.createNode(options || null, function () { return MEPH.audio.Audio.nodeTypes.waveShaper; }, params)
        return me;

    },
    analyser: function (options) {
        var me = this, params = me.createS().concat(me.createParams('plainNumber', 'fftSize', 'frequencyBinCount', 'maxDecibels', 'minDecibels', 'smoothingTimeConstant'));

        me.createNode(options || null, function () { return MEPH.audio.Audio.nodeTypes.analyser; }, params)
        return me;
    },
    splitter: function (options) {
        var me = this;
        options = options || {};
        options.splitIndex = 0;
        me.setChannels(options);
        me.createNode(options || null, function () { return MEPH.audio.Audio.nodeTypes.splitter; })
        return me;
    },
    merger: function (options) {
        var me = this;
        options = options || {};
        options.mergeIndex = 0;
        me.setChannels(options);
        me.createNode(options, function () { return MEPH.audio.Audio.nodeTypes.merger; })
        return me;
    },
    setChannels: function (options) {
        var me = this;
        if (options && options.buffer && options.buffer.id) {

            var count = me.nodes.count(function (node) {
                if (node && node.options && node.options.node && node.options.node.data && node.options.node.data.nodeOutputs)
                    return node.options.node.data.nodeOutputs.some(function (y) {
                        return y.id === options.buffer.id;
                    });
                return false;
            });
            if (count > 2) {
                options.channels = count;
            }
        }
    },
    periodicWave: function (options) {
        var me = this;

        me.createNode(options, function () { return MEPH.audio.Audio.nodeTypes.periodicWave; })
        return me;

    },
    panner: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () {
            return MEPH.audio.Audio.nodeTypes.panner
        });
        return me;

    },
    createNode: function (options, func, params) {
        var me = this;
        var context = me.createContext();

        var node = func();

        me.nodes.push({ params: params, options: options || null, type: node });

        return me;
    },
    createK: function () {
        var me = this, args = MEPH.Array(arguments);
        return me.createParams.apply(me, ['k'].concat(args.select()))
    },
    createA: function () {
        var me = this, args = MEPH.Array(arguments);
        return me.createParams.apply(me, ['a'].concat(args.select()));
    },
    createS: function () {
        var me = this, args = MEPH.Array(arguments);
        return me.createParams.apply(me, (['S'].concat(args.select())));
    },
    createParams: function () {
        var me = this, args = MEPH.Array(arguments);
        var type = args.first();
        return args.subset(1).select(function (name) {
            return {
                type: type,
                name: name
            }
        });
    },
    biquadFilter: function (options) {
        var me = this, params = me.createK('Q', 'frequency', 'gain').concat(me.createA('detune')).concat(me.createS('type'));

        me.nodes.push({ params: params, options: options || null, type: MEPH.audio.Audio.nodeTypes.biquadFilter });

        return me;

    },
    play: function (delay) {
        var me = this;
        delay = delay || 0;
        me.nodes.where(function (x) {
            return x.type === MEPH.audio.Audio.nodeTypes.oscillator || x.type === MEPH.audio.Audio.nodeTypes.buffer;
        }).foreach(function (node) {
            if (node.node.played) {
                debugger
            }
            node.node.start(delay);
            node.node.played = true;
        })
    },
    stop: function (delay) {
        var me = this;
        delay = delay || 0;
        me.nodes.where(function (x) {
            return x.type === MEPH.audio.Audio.nodeTypes.oscillator || x.type === MEPH.audio.Audio.nodeTypes.buffer;
        }).foreach(function (node) {
            node.node.stop(delay);
        })
    },
    disconnect: function () {
        var me = this, last, context = me.createContext();
        me.nodes.foreach(function (x, i) {
            x.node.disconnect();
            x.node = null;
        });
        //last.disconnect(context.destination);
        me.completed = false;
    },
    gain: function (options) {
        var me = this, params = me.createK().concat(me.createA('gain')).concat(me.createS());

        me.nodes.push({ params: params, options: options || null, type: MEPH.audio.Audio.nodeTypes.gain });

        return me;
    },
    /**
     * Creates an audio node based on the type.
     * @param {String} type
     * @return {Audio}
     */
    createAudioNode: function (type, options, nodeoptions) {
        var A = MEPH.audio.Audio;
        nodeoptions = nodeoptions || {};
        var me = this;
        var real = new Float32Array(2);
        var imag = new Float32Array(2);

        real[0] = 0;
        imag[0] = 0;
        real[1] = 1;
        imag[1] = 0;
        var nodel
        switch (type) {
            case A.nodeTypes.oscillator:
                return me.createContext(options).createOscillator();
            case A.nodeTypes.gain:
                node = me.createContext(options).createGain();
                node.gain.value = nodeoptions.volume === undefined || nodeoptions.volume === null ? 1 : nodeoptions.volume;
                return node;
            case A.nodeTypes.panner:
                return me.createContext(options).createPanner();

            case A.nodeTypes.convolver:
                return me.createContext(options).createConvolver();

            case A.nodeTypes.delay:
                return me.createContext(options).createDelay();
            case A.nodeTypes.dynamicsCompressor:
                return me.createContext(options).createDynamicsCompressor();
            case A.nodeTypes.waveShaper:
                return me.createContext(options).createWaveShaper();
            case A.nodeTypes.analyser:
                return me.createContext(options).createAnalyser();
            case A.nodeTypes.splitter:
                return me.createContext(options).createChannelSplitter(nodeoptions.channels || 2);
            case A.nodeTypes.merger:
                return me.createContext(options).createChannelMerger(nodeoptions.channels || 2);
            case A.nodeTypes.periodicWave:
                return me.createContext(options).createPeriodicWave(nodeoptions.real || real, nodeoptions.imaginary || imag);
            case A.nodeTypes.biquadFilter:
                return me.createContext(options).createBiquadFilter();
            case A.nodeTypes.buffer:
                var bs = me.createContext(options).createBufferSource();
                bs.buffer = nodeoptions.buffer;
                return bs;
            case A.nodeTypes.bufferSource:
                return me.createContext(options).createBufferSource();
            default:
                throw new Error('unhandled case: createAudioNode. : ' + type)

        }
    },
    get: function (query) {
        var me = this;

        return me.nodes.where(function (x) {
            for (var i in query) {
                return (x.options && x.options[i] === query[i]);
            }
            return false;
        });
    },
    /**
     * Connects a audio to the end of this audio.
     **/
    connect: function (audio) {
        var me = this;
        if (me !== audio && !me.contains(audio) &&
            !audio.contains(me)) {
            me.nodes.push({ type: 'Audio', options: { audio: audio } });
            return me;
        }
        throw new Error('adding node will create a circular loop.')
    },
    /**
     * Returns true if node is found in descendants.
     **/
    contains: function (audioNode) {
        var me = this;
        return !!me.getAudioNodes().first(function (x) { return x.options.audio === audioNode })
    },

    getAudioNodes: function () {
        var me = this;
        var nodes = me.nodes.where(function (x) {
            return x.type === 'Audio';
        }).concatFluent(function (x) {
            return [x].concat(x.options.audio.getAudioNodes());
        });
        return nodes;
    },
    /**
     * Gets all the descendant nodes connected to it.
     * @return {Array}
     **/
    getNodes: function () {
        var me = this;
        var nodes = me.nodes.concatFluent(function (x) {
            if (x.type === 'Audio') {
                return x.options.audio.getNodes();
            }
            else {
                return [x];
            }
        });
        return nodes;
    },
    complete: function (options) {
        var me = this, last, targetnode,
            nodes = me.getNodes();
        if (me.completed) {
            me.disconnect();
        }
        me.completed = true;
        nodes.foreach(function (x, index) {
            if (!x.node) {
                x.node = me.createAudioNode(x.type, options, x.options);
            }
            if (index) {
                if (x.options && x.options.buffer && x.options.buffer.id) {//If point to a specific node, find it in the previous partss.
                    me.completeTargetNodes(nodes, x);
                }
                else if (x.options && x.options.noinputs) {
                    //do nothin.
                }
                else {
                    last.connect(x.node);
                }


            }
            if (x.params) {
                x.params.foreach(function (param) {
                    if (x.options && x.options[param.name] && typeof x.options[param.name] === 'object') {
                        me.connectTargetToNode(nodes, x, param);
                    }
                    else if (x.node[param.name] && x.options && x.options[param.name] !== null && x.options[param.name] !== undefined) {

                        x.node[param.name].value = x.options[param.name];
                    }
                })
            }
            last = x.node;
        });
        last.connect(me.createContext(options).destination);
        return me;
    },
    getBufferIndex: function (x) {
        if (x.type === MEPH.audio.Audio.nodeTypes.merger)
            switch (x.options.buffer.name) {
                case 'buffer':
                    return 0;
                case 'buffer2':
                    return 1;
                case 'buffer3':
                    return 2;
                case 'buffer4':
                    return 3;
            }
    },
    connectTargetToNode: function (nodes, x, param) {
        var targetnode,
            me = this;

        targetnode = nodes.first(function (node) {
            return node.options.node.data.nodeOutputs.some(function (y) {
                return y.id === x.options[param.name].id;
            });
        });

        switch (targetnode.type) {
            case 'splitter':
                x.options.splitIndex = x.options.splitIndex || -1;
                x.options.splitIndex++;

                targetnode.node.connect(x.node[param.name], 0, x.options.splitIndex);

                break;
            default:
                if (x.type === MEPH.audio.Audio.nodeTypes.merger) {
                    x.options.mergedIndex = x.options.mergedIndex || -1;
                    x.options.mergedIndex++;
                    targetnode = nodes.first(function (node) {
                        return node.options.node.data.nodeOutputs.some(function (y) { return y.id === x.options.buffer.id; });
                    });

                    targetnode.node.connect(x.node[param.name], 0, x.options.mergedIndex);

                }
                else
                    targetnode.node.connect(x.node[param.name]);
                break;
        }
    },
    completeTargetNodes: function (nodes, x) {
        var targetnode,
            me = this;

        targetnode = nodes.first(function (node) {
            return node.options.node.data.nodeOutputs.some(function (y) { return y.id === x.options.buffer.id; });
        });

        switch (targetnode.type) {
            case 'splitter':
                x.options.splitIndex = x.options.splitIndex || -1;
                x.options.splitIndex++;

                targetnode.node.connect(x.node, 0, x.options.splitIndex);

                break;
            default:
                if (x.type === MEPH.audio.Audio.nodeTypes.merger) {
                    x.options.mergedIndex = x.options.mergedIndex || -1;
                    x.options.mergedIndex++;

                    var options = [].interpolate(0, 4, function (i) {
                        if (i) {
                            return 'buffer' + (i + 1)
                        }
                        return 'buffer';
                    });

                    options.where(function (t) {
                        return x.options[t];
                    }).foreach(function (op) {
                        targetnode = nodes.first(function (node) {
                            return node.options.node.data.nodeOutputs.some(function (y) {
                                return y.id === x.options[op].id;
                            });
                        });
                        if (targetnode)
                            targetnode.node.connect(x.node, 0, x.options.mergedIndex);
                    })
                }
                else
                    targetnode.node.connect(x.node);
                break;
        }

    }
});