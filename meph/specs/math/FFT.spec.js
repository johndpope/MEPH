describe("MEPH/math/FFT.spec.js", 'MEPH.math.FFT', function () {
    var FFT;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        FFT = MEPH.math.FFT;
    });

    it('can create a FFT.', function () {
        var fft = new FFT();

        expect(fft).toBeTruthy();
    });

    it('can execute a fft on an array', function () {
        var fft = new FFT();
        var output = new Float32Array(32);
        var outputOffset = 0;
        var outputStride = 1;;
        var input = new Float32Array(32);
        input.foreach(function (x, index) {
            input[index] = Math.cos(Math.PI * index / 16);
        })
        var inputOffset = 0;
        var inputStride = 1;
        var type = false;
        
        fft.complex(16, true);
        fft.process(output, outputOffset, outputStride, input, inputOffset, inputStride, type)

        var ifft = new FFT();
        ifft.complex(16, false);
        var output2 = new Float32Array(32);
        ifft.process(output2, inputOffset, inputStride, output, outputOffset, outputStride, type);

        var res = [].interpolate(0, 32, function (x) {
            return (output2[x] / 16);
        })

        expect(res.all(function (x, i) {
            
            return Math.abs(Math.abs(res[i]) - Math.abs(input[i])) < .001;
        })).toBeTruthy();
        

    });
});