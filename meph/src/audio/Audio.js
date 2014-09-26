﻿/**
 * @class MEPH.audio.Audio
 * Defines a base class for Audio.
 **/
MEPH.define('MEPH.audio.Audio', {
    requires: ['MEPH.util.Dom'],
    statics: {
        /**
         * Audio context.
         */
        audioCtx: null,

        sourcebuffer: null,

        analyze: function (audiofile, audiofiletyp) {
            var audio = new MEPH.audio.Audio();
            debugger
            return audio.load(audiofile, audiofiletyp).then(function (resource) {

                var result = audio.copyToBuffer(resource, 40, 40.3);
                audio.buffer(result.buffer).volume({ name: 'volume' }).gain({ name: 'gain', volume: 0 }).complete();
                result.buffer.start();
                return new Promise(function (r) {
                    setTimeout(function () {
                        var volume = audio.get({ name: 'volume' }).first();
                        expect(volume.data).toBeTruthy();
                        audio.disconnect();
                        r(volume);
                    }, 1000)
                })
            })
        }
    },
    properties: {
        /**
         * Audio context.
         */
        audioCtx: null,
        nodes: null,
        sourcebuffer: null,
        offlineContext: false
    },
    initialize: function () {
        var me = this;
        me.nodes = [];
        me.sourcebuffer = [];
    },
    /**
     * Loads a resouce.
     **/
    load: function (file, type, options) {
        var me = this, toresolve, tofail;
        var result = me.getBufferSources()
            .first(function (x) {
                return x.file === file && x.type === type;
            });
        if (result) {
            return Promise.resolve().then(function () { return result; });
        }
        return MEPH.loadJSCssFile(file, type).then(function (result) {
            var promise = new Promise(function (r, s) {
                toresolve = r;
                tofail = s;
            });
            var context = me.createContext(options);

            context.decodeAudioData(
              result.response,
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
        }).catch(function (error) {
            tofail(error);
        });
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
    getBufferSources: function () {
        var me = this, Audio = MEPH.audio.Audio;
        Audio.sourcebuffer = Audio.sourcebuffer || [];
        return MEPH.audio.Audio.sourcebuffer;
    },
    addBufferSource: function (options) {
        var me = this, Audio = MEPH.audio.Audio;
        Audio.sourcebuffer = Audio.sourcebuffer || [];
        Audio.sourcebuffer.push(options);
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
        me.nodes.push({ options: options || null, node: buffer })
        return me;
    },
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
            var data = {};
            // Loop through the output channels (in this case there is only one)
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                var inputData = inputBuffer.getChannelData(channel);
                var outputData = outputBuffer.getChannelData(channel);
                data[channel] = { amplitude: 0, num: 0 };
                // Loop through the 4096 samples
                for (var sample = 0; sample < inputBuffer.length; sample++) {
                    // make output equal to the same as the input
                    outputData[sample] = inputData[sample];
                    if ((sample % 16) === 0) {
                        data[channel].amplitude += Math.abs(inputData[sample]);
                        data[channel].num++;
                    }
                }
            }
            nodecontext.data.push({ channels: data });
        }.bind(me, nodecontext);
        return me;
    },
    /**
     * Creates an oscillator node
     **/
    oscillator: function (options) {
        var me = this;
        var context = me.createContext();

        var oscillator = context.createOscillator();

        me.nodes.push({ options: options || null, node: oscillator });

        return me;
    },
    /**
     * The ConvolverNode interface is an AudioNode that performs a Linear Convolution on a given AudioBuffer, often used to achieve a reverb effect. A ConvolverNode always has exactly one input and one output.
     * @param {Object} options
     * @return {MEPH.audio.Audio}
     **/
    convolver: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createConvolver(); })
        return me;
    },
    delay: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createDelay(); })
        return me;
    },
    dynamicsCompressor: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createDynamicsCompressor(); })
        return me;

    },
    waveShaper: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createWaveShaper(); })
        return me;

    },
    analyser: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createAnalyser(); })
        return me;
    },
    splitter: function (options) {
        var me = this;
        options = options || {};

        var context = me.createContext();

        me.createNode(options, function () { return context.createChannelSplitter(options.channels || 2); })
        return me;
    },
    merger: function (options) {
        var me = this;
        options = options || {};

        var context = me.createContext();

        me.createNode(options, function () { return context.createChannelMerger(options.channels || 2); })
        return me;
    },
    periodicWave: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () { return context.createPeriodicWave(options.real, options.imaginary); })
        return me;

    },
    panner: function (options) {
        var me = this;
        var context = me.createContext();

        me.createNode(options, function () {
            return context.createPanner();
        });
        return me;

    },
    createNode: function (options, func) {
        var me = this;
        var context = me.createContext();

        var node = func();

        me.nodes.push({ options: options || null, node: node });

        return me;
    },
    biquadFilter: function (options) {
        var me = this;
        var context = me.createContext();
        var bf = context.createBiquadFilter();

        me.nodes.push({ options: options || null, node: bf });

        return me;

    },
    disconnect: function () {
        var me = this, last, context = me.createContext();
        me.nodes.foreach(function (x, i) {
            if (i === me.nodes.length - 1) {
                last = x.node;
            }
            else {
                x.node.disconnect(me.nodes[i + 1].node);
            }
        });
        last.disconnect(context.destination);
    },
    gain: function (options) {
        var me = this;
        var context = me.createContext();

        var gain = context.createGain();
        if (options && options.volume !== undefined) {
            gain.gain.value = options.volume;
        }
        me.nodes.push({ options: options || null, node: gain });

        return me;
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
    complete: function (options) {
        var me = this, last;
        me.nodes.foreach(function (x, index) {
            if (index) {
                last.connect(x.node);
            }
            last = x.node;
        });
        last.connect(me.createContext(options).destination);
        return me;
    }
});