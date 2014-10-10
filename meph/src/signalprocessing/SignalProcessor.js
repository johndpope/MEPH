/**
 * @class MEPH.signalprocessing.SignalProcessor
 * @extends MEPH.control.Control
 * Signal processing library.
 **/
MEPH.define('MEPH.signalprocessing.SignalProcessor', {
    requires: ['MEPH.math.FFT', 'MEPH.math.Util'],
    statics: {
    },
    properties: {
    },
    /**
     * Performs a fast fourier transform(FFT).
     * @param {Array} array
     * @param {Number} outputOffset
     * @param {Number} outputStride
     * @param {Number} inputOffset
     * @param {Number} inputStide
     * @param {Array} output
     ***/
    fft: function (array, outputOffset, outputStride, inputOffset, inputStride, type) {
        var output = new Float32Array(array.length);
        outputOffset = outputOffset !== undefined ? outputOffset : 0;
        outputStride = outputStride !== undefined ? outputStride : 1;

        inputOffset = inputOffset !== undefined ? inputOffset : 0;
        inputStride = inputStride !== undefined ? inputStride : 1;
        type = type !== undefined ? type : false;
        var fft = new FFT();

        fft.complex(array.length / 2, true);
        fft.process(output, outputOffset, outputStride, array, inputOffset, inputStride, type)
        return output;
    },
    /**
     *
     * Calculates the amplitude for each imaginary real pair of the fft result.
     * @param {Array} fftarray
     * [r,i,r,i,r,i,r,i,r,i]
     ***/
    amplitude: function (fftarray) {
        var res = new Float32Array(fftarray.length / 2);
        [].interpolate(0, fftarray.length / 2, function (x) {
            var index = x * 2;
            res[x] = MEPH.math.Util.polar(fftarray[index], fftarray[index + 1]).theta;
        });
        return res;
    },
    /**
     *
     * Calculates the phases for each imaginary real pair of the fft result.
     * @param {Array} fftarray
     * [r,i,r,i,r,i,r,i,r,i]
     ***/
    phase: function (fftarray) {
        var res = new Float32Array(fftarray.length / 2);
        [].interpolate(0, fftarray.length / 2, function (x) {
            var index = x * 2;
            res[x] = MEPH.math.Util.polar(fftarray[index], fftarray[index + 1]).theta;
        });
        return res;
    },
    /**
     *
     * Detects maxima in an array of values;
     * @param {Array} array
     * @param {Number} distance
     **/
    detectMaxima: function (array, distance) {
        var res = [];
        var i = 0;
        distance = distance || 1
        var maxima = null;
        var x;

        for (var index = 0 ; index < array.length ; index++) {
            x = array[index];
            maxima = x;
            var forwardMin = array.subset(index + 1, index + distance + 1).where(function (y) {
                if (y >= maxima) {
                    maxima = y;
                }
                return y >= maxima;
            });

            maxima = x;
            var backwardMin = array.subset(index - distance, index).where(function (y) {
                if (y >= maxima) {
                    maxima = y;
                }
                return y >= maxima;
            });

            if (forwardMin.length === 0 && backwardMin.length === 0) {
                res.push(index);
                index += distance - 1;
            }
        }
        return res;
    },
    /**
     *
     * Detects minima in an array of values;
     * @param {Array} array
     **/
    detectMinima: function (array, distance) {
        var res = [];
        var i = 0;
        distance = distance || 1
        var minima = null;
        var x;

        for (var index = 0 ; index < array.length ; index++) {
            x = array[index];
            minima = x;
            var forwardMin = array.subset(index + 1, index + distance + 1).where(function (y) {
                if (y <= minima) {
                    minima = y;
                }
                return y <= minima;
            });

            minima = x;
            var backwardMin = array.subset(index - distance, index).where(function (y) {
                if (y <= minima) {
                    minima = y;
                }
                return y <= minima;
            });

            if (forwardMin.length === 0 && backwardMin.length === 0) {
                res.push(index);
                index += distance - 1;
            }
        }
        return res;
    }
})