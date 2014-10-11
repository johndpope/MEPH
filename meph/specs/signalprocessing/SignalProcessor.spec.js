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

        expect(res.length).toBe(32);
    });

    it('can calculate the amplitude and phase from a FFT result.', function () {

        var sp = new SignalProcessor();
        var input = createSin(32);
        var res = sp.fft(input);

        var amplitudes = sp.amplitude(res);
        var phases = sp.phase(res);

        expect(amplitudes).toBeTruthy();
        expect(amplitudes.length).toBe(16);
        expect(phases.length).toBe(16);
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
    })
});