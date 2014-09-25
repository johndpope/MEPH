describe("MEPH/audio/Audio.spec.js", 'MEPH.audio.Audio', function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create an audio', function () {
        var audio = new MEPH.audio.Audio();

        expect(audio).toBeTruthy();
    });

    it('can create an audio context', function () {
        var audio = new MEPH.audio.Audio();

        var context = audio.createContext();

        expect(context).toBeTruthy();
    });

    it('can create an audio context, and returns the same context the second time unless otherwise specified.', function () {
        var audio = new MEPH.audio.Audio();

        var context = audio.createContext();

        expect(context === audio.createContext()).toBeTruthy();
    })
    it('it can create oscillator node and a gainnode, and link to the context fluently', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.oscillator().gain().complete();
    });

    it('can name nodes', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.oscillator({ name: 'oc' }).gain().complete();

        var oscillatornode = audio.get({ name: 'oc' }).first();

        expect(oscillatornode).toBeTruthy();
    });

    it('can set the oscillator node to on ', function (done) {
        var audio = new MEPH.audio.Audio();

        var result = audio.oscillator({ name: 'oc' }).gain({ name: 'gain' }).complete();
        var gainnode = audio.get({ name: 'gain' }).first();

        var gainNode = gainnode.node;
        gainNode.gain.value = .01;

        var oscillatornode = audio.get({ name: 'oc' }).first();
        var oscillator = oscillatornode.node;
        var initialFreq = 3000;
        oscillator.type = 0; // sine wave
        oscillator.frequency.value = initialFreq; // value in hertz
        oscillator.start();
        expect(oscillatornode).toBeTruthy();
        setTimeout(function () {
            audio.disconnect();
            done();
        }, 10);
    });

    it('it can create biquad filter', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.biquadFilter();
        expect(result).toBeTruthy();
    });

    it('it can create convolverfilter', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.convolver();
        expect(result).toBeTruthy();
    });

    it('it can create delay', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.delay();
        expect(result).toBeTruthy();
    });

    it('it can create dynamicscompressornode', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.dynamicsCompressor();
        expect(result).toBeTruthy();
    });
    it('it can create wave shaper', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.waveShaper();
        expect(result).toBeTruthy();
    });
    it('it can create analyser', function () {
        var audio = new MEPH.audio.Audio();

        var result = audio.analyser();
        expect(result).toBeTruthy();
    });
    it('it can create periodic  Wave', function () {
        var audio = new MEPH.audio.Audio();
        var real = new Float32Array(2);
        var imag = new Float32Array(2);
        var result = audio.periodicWave({ name: 'period', real: real, imaginary: imag });
        expect(result).toBeTruthy();
    });

    it('channel splitter node', function () {
        var audio = new MEPH.audio.Audio();
        var result = audio.splitter({ name: 'channelsplitter' });
        expect(result).toBeTruthy();

    })
    it('channel splitter node', function () {
        var audio = new MEPH.audio.Audio();
        var result = audio.merger();
        expect(result).toBeTruthy();

    })
    it('channel panner node', function () {
        var audio = new MEPH.audio.Audio();
        var result = audio.panner();
        expect(result).toBeTruthy();

    })

    it('can load an mp3 resource ', function (done) {
        var audio = new MEPH.audio.Audio();

        audio.load('../specs/data/The_Creek.mp3', 'mp3').then(function (resource) {

            expect(resource.buffer).toBeTruthy();
            done();
        });
    });

    it('loaded resources are cached globally.', function (done) {
        var audio = new MEPH.audio.Audio();

        audio.load('../specs/data/The_Creek.mp3', 'mp3').then(function (resource) {
            expect(resource.buffer).toBeTruthy();

        }).then(function () {
            expect((new MEPH.audio.Audio()).getBufferSources().length).toBeTruthy();
            done();
        });
    });
    var audiofile = '../specs/data/The_Creek.mp3', audiofiletyp = 'mp3';

    it('can play a buffer source ', function (done) {
        var audio = new MEPH.audio.Audio();

        audio.load(audiofile, audiofiletyp).then(function (resource) {
            audio.buffer(resource.buffer).complete();

            // start the source playing
            resource.buffer.start();
            setTimeout(function () {
                audio.disconnect();
                done();

            }, 2000)
        });
    });

    it('can copy a clip of sound ', function (done) {
        var audio = new MEPH.audio.Audio();

        audio.load(audiofile, audiofiletyp).then(function (resource) {

            var result = audio.copyToBuffer(resource, 50, 52);

            audio.buffer(result.buffer).complete();

            // start the source playing
            result.buffer.start();
            setTimeout(function () {
                audio.disconnect();
                done();
            }, 2000)

        });

    });

    it('can render offline', function (done) {
        var audio = new MEPH.audio.Audio();

        audio.load(audiofile, audiofiletyp, {}).then(function (resource) {

            var result = audio.copyToBuffer(resource, 50, 52, {});

            audio.buffer(result.buffer).complete({
                length: 2,
                numOfChannels: resource.buffer.channelCount,
                sampleRate: resource.buffer.buffer.sampleRate,
                oncomplete: function (res) {
                    audio.disconnect();
                    done();
                },
                start: true
            });

            // start the source playing
            result.buffer.start();
            audio.getContext().startRendering();
        });
    });

});