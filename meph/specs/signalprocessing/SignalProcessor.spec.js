describe("MEPH/signalprocessing/SignalProcessor.spec.js", 'MEPH.signalprocessing.SignalProcessor', function () {
    var SignalProcessor = MEPH.signalprocessing.SignalProcessor;

    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });
    var createSin = function (length) {
        var input = new Float32Array(length);
        input.foreach(function (x, index) {
            input[index] = Math.cos(Math.PI * index / 16);
        });
        return input;
    }

    it("can create a SignalProcessor", function () {
        //Arrange

        //Assert
        var input = new SignalProcessor();

        expect(input).toBeTruthy();

    });

    it('can take the fft of an array32', function () {

        var sp = new SignalProcessor();
        var input = createSin(32);

        var res = sp.fft(input);

        expect(res.length).toBe(64);
    });

    it('can calculate the amplitude and phase from a FFT result.', function () {

        var sp = new SignalProcessor();
        var input = createSin(32);
        var res = sp.fft(input);

        var amplitudes = sp.amplitude(res);
        var phases = sp.phase(res);

        expect(amplitudes).toBeTruthy();
        expect(amplitudes.length).toBe(32);
        expect(phases.length).toBe(32);
        expect(phases).toBeTruthy();
    });

    it('can calculate the amplitude peaks of an array of numbers', function () {
        var sp = new SignalProcessor();
        var input = createSin(64);

        var peeks = sp.detectMaxima(input);

        expect(peeks.length).toBe(3);
        expect(peeks.first()).toBe(0);
        expect(peeks.second()).toBe(32);
        expect(peeks.nth(3)).toBe(63);
    });

    it('can calculate the amplitude peaks of an array of numbers within a certain area', function () {
        var sp = new SignalProcessor();
        var input = createSin(64);

        var peeks = sp.detectMaxima(input, 14);

        expect(peeks.length).toBe(3);
        expect(peeks.first()).toBe(0);
    });


    it('can calculate the amplitude valleys of an array of numbers', function () {
        var sp = new SignalProcessor();
        var input = createSin(64);

        var valleys = sp.detectMinima(input);

        expect(valleys.length).toBe(2);
        expect(valleys.first()).toBe(16);
        expect(valleys.second()).toBe(48);
    });


    it('can calculate the amplitude valleys of an array of numbers with in a certain area', function () {
        var sp = new SignalProcessor();
        var input = createSin(64);

        var valleys = sp.detectMinima(input, 14);

        expect(valleys.length).toBe(2);
        expect(valleys.first()).toBe(16);
    });

    it('can unwrap a series of phase theta values to limit the discontinuity', function () {
        var sp = new SignalProcessor();
        var input = [0.0, 0.78539816, 1.57079633, 5.49778714, 6.28318531];

        var result = sp.unwrap(input);
        var answ = [0.0, 0.78539816, 1.57079633, -0.78539816, 0.0];
        expect(result.all(function (x, i) { return Math.abs(answ[i]) - Math.abs(x) < .0001; })).toBeTruthy();
    });

    it('can unwrap a series of phase theta values to limit the discontinuity(FloatArray32)', function () {
        var sp = new SignalProcessor();
        var input = new Float32Array([0.0, 0.78539816, 1.57079633, 5.49778714, 6.28318531]);

        var result = sp.unwrap(input);
        var answ = new Float32Array([0.0, 0.78539816, 1.57079633, -0.78539816, 0.0]);
        expect(result.all(function (x, i) { return Math.abs(answ[i]) - Math.abs(x) < .0001; })).toBeTruthy();
    });

    it('can calculate the diff', function () {
        var sp = new SignalProcessor();
        var res = sp.diff([1, 2, 4, 7, 0]);

        expect(res[0]).toBe(1);
        expect(res[1]).toBe(2);
        expect(res[2]).toBe(3);
    });

    it('can stretch a signal of x(n) to a signal of xs(n)', function () {
        var sp = new SignalProcessor(), len = Math.pow(2, 8);

        var input = (new Float32Array(len)).select(function (x, i) {
            return Math.cos(i * Math.PI / 8 + i * Math.PI / 3);
        });

        sp.windowing(MEPH.math.Util.window.Rectangle);

        var result = sp.stretch(input, 2, 0).skipEvery(2);

        expect(result.length).toBe(len * 2);

    });

    it('can stretch a signal  by a float of x(n) to a signal of xs(n)', function () {
        var sp = new SignalProcessor(), len = Math.pow(2, 8);
        var stretch = 2.5;
        var input = (new Float32Array(len)).select(function (x, i) {
            return Math.cos(i * Math.PI / 8 + i * Math.PI / 3);
        });

        sp.windowing(MEPH.math.Util.window.Rectangle);

        var result = sp.stretch(input, stretch, 0).skipEvery(2);

        expect(result.length).toBe(len * stretch);

    });
    var createBuffer = function (t, sampleRate) {
        var resource = {
            buffer: {
                buffer: {
                    getChannelData: function () {
                        return t;
                    },
                    sampleRate: sampleRate
                },
                channelCount: 1
            }
        }
        return resource;
    }
    
    it('test: play , normally silent', function (done) {
        var sp = new SignalProcessor(),
            len = Math.pow(2, 15),
            stretch = 2.5,
            input = (new Float32Array(len)).select(function (x, i) {
                return Math.sin(i * Math.PI / 8);
            });

        sp.windowing(MEPH.math.Util.window.Rectangle);


        var result = sp.stretch(input, stretch, 0).skipEvery(2);
        var resource = {
            buffer: {
                buffer: {
                    getChannelData: function () {
                        return result;
                    },
                    sampleRate: len
                },
                channelCount: 1
            }
        };

        var audio = new MEPH.audio.Audio();

        var audioresult = audio.copyToBuffer(resource, 0, stretch);

        audio.buffer(audioresult.buffer).complete();

        // start the source playing
        //audioresult.buffer.start();
        setTimeout(function () {
            audio.disconnect();
            done();
        }, 1000)
    })
    
    it('can slice a signal into windowed chunks and return an array of ffts.', function () {
        var sp = new SignalProcessor(),
            len = 1024;

        var input = (new Float32Array(len)).select(function (x, i) {
            return Math.cos(i / len * 3 * Math.PI);
        });

        sp.windowing(MEPH.math.Util.window.Triangle.bind(null, -1));

        var result = sp.fftwindows(input, 32);

        expect(result.length).toBe(len / 32);

    });

    
    it('can generate a seriers of Xs[K] windows ', function () {
        var sp = new SignalProcessor();
        var windows = sp.generateWindows(32, 64);
        expect(windows.length).toBe(64);
    });

    it('throws an error if the windowing isnt set.', function () {
        var sp = new SignalProcessor(),
            len = 1024;

        var input = (new Float32Array(len)).select(function (x, i) {
            return Math.cos(i / len * 3 * Math.PI);
        });
        var caught;

        try {
            var result = sp.fftwindows(input, 32);
        }
        catch (e) {
            caught = true;
        }
        expect(caught).toBeTruthy();
    });

    it('can select the window width based on the signal length ', function () {
        var sp = new SignalProcessor();

        var width = sp.windowWidth(1024);

        expect(width).toBe(32)
    });

    it('can set the windowing function for a signal processor', function () {
        var sp = new SignalProcessor();

        sp.windowing(MEPH.math.Util.window.Triangle);

        expect(sp.windowing()).toBe(MEPH.math.Util.window.Triangle)
    });

    it('can set the window joining function for a signal processor', function () {
        var sp = new SignalProcessor();

        sp.joining(MEPH.math.Util.window.Triangle);

        expect(sp.joining()).toBe(MEPH.math.Util.window.Triangle);
    });

    it('can set frame size of a signal processor', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);

        expect(sp.frameSize()).toBe(1024);
    })

    it('can window and interleave a signal', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 100); });

        var res = sp.interleaveInput(input);
        expect(res.length).toBe(1024 * 2)
    });

    it('can do a fft on  the output of the interleave function', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 100); });

        var res = sp.interleaveInput(input);


        var output = sp.fft(res, 'complex');
        expect(output.all(function (t) { return !isNaN(t); })).toBeTruthy();
    });
    it('keeps the fftFrameSize/2 stored away', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);

        expect(sp.framesize2).toBe(512)
    });
    it('can set the over sampling rate.', function () {
        var sp = new SignalProcessor();
        sp.oversampling(4);

        expect(sp.oversampling()).toBe(4)
    });

    it('can do an analysis of the frame', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        sp.samplingRate(44100);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 100); });
        var res = sp.interleaveInput(input);
        var analysisRes = sp.analysis(res);
        expect(analysisRes.mag.length).toBe(sp.framesize2);
        expect(analysisRes.freq.length).toBe(sp.framesize2);
    });

    it('can pitch shift the analysis result', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        sp.samplingRate(44100);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 100); });
        var res = sp.interleaveInput(input);
        var analysisRes = sp.analysis(res);
        var p = sp.pitch(analysisRes, .5);
        expect(p).toBeTruthy();
    });

    it('can synthesize the new synth frame', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        sp.samplingRate(44100);
        sp.oversampling(4);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 100); });
        var res = sp.interleaveInput(input);
        var analysisRes = sp.analysis(res);
        var p = sp.pitch(analysisRes, .5);
        var s = sp.synthesis(p);
        expect(s).toBeTruthy();
    });

    it('can do the inverse fft on the synthesized frame', function () {
        var sp = new SignalProcessor();
        sp.frameSize(32);
        sp.samplingRate(44100);
        sp.oversampling(1);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(x / 2) });// ;
        var res = sp.interleaveInput(input);
        var output = sp.fft(res, 'complex');
        var analysisRes = sp.analysis(output);
        var p = sp.pitch(analysisRes, 1);
        var s = sp.synthesis(p);

        var ifft = sp.ifft(s);

        expect(ifft.all(function (x) { return !isNaN(x); })).toBeTruthy();
    });
    it('can join the output of the ifft to the previously processed part', function () {
        var sp = new SignalProcessor();
        sp.frameSize(1024);
        sp.oversampling(1);
        sp.samplingRate(44100);
        var input = [].interpolate(0, 4000, function (x) { return Math.cos(Math.PI * x / 3); });
        var res = sp.interleaveInput(input);
        var output = sp.fft(res, 'complex');
        var analysisRes = sp.analysis(output);
        var p = sp.pitch(analysisRes, 1);
        var s = sp.synthesis(p);
        var ifft = sp.ifft(s);
        var newsignal = sp.unwindow(ifft, new Float32Array(ifft.length));

        expect(newsignal.length).toBe(ifft.length);
        expect(newsignal.all(function (x) { return !isNaN(x); })).toBeTruthy();
    });

    it('straight up pitch shift', function () {
        var input = [].interpolate(0, 8000, function (x) { return Math.cos(Math.PI * x / 3); });
        var sp = new SignalProcessor();
        sp.pitchShift(1, 1024, 1024, 4, 44100, input);

    });
    it('audio file pitch shifting', function (done) {


        var audio = new MEPH.audio.Audio();
        var audiofile = '../specs/data/Parasail.mp3', audiofiletyp = 'mp3';

        audio.load(audiofile, audiofiletyp).then(function (resource) {
            var sp = new SignalProcessor();

            var audioresult = audio.copyToBuffer(resource, 1, 10);
            var inbucket;
            var outbucket;
            audio.buffer(audioresult.buffer)
                .processor({
                    name: 'proce',
                    process: function (audioProcessingEvent) {
                        var inputBuffer = audioProcessingEvent.inputBuffer;
                        var inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        var d = audioProcessingEvent.outputBuffer.getChannelData(0);
                        var hasoutput = sp.pitchShift(.95, inputData.length, inputData.length, 4, 44100, inputData, d);
                    }
                })
                .complete();

            // start the source playing
            //audioresult.buffer.start();

            setTimeout(function () {
                audio.disconnect();
                done();

            }, 1000)
        }).catch(function (e) {
            expect(e).caught();
            done();
        });;

    });
});