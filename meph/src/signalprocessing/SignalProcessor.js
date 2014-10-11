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
    },
    /**
     * https://github.com/numpy/numpy/blob/v1.8.1/numpy/lib/function_base.py#L1122
     * Unwrap by changing deltas between values to 2*pi complement.
     * Unwrap radian phase `p` by changing absolute jumps greater than 
     * `discont` to their 2*pi complement along the given axis.
    *
    *    Parameters
    *    ----------
    *    p : array_like
    *        Input array.
    *    discont : float, optional
    *        Maximum discontinuity between values, default is ``pi``.
    *    axis : int, optional
    *        Axis along which unwrap will operate, default is the last axis.
    *
    *    Returns
    *    -------
    *    out : ndarray
    *        Output array.
    *
    *    See Also
    *    --------
    *    rad2deg, deg2rad
    *
    *    Notes
    *    -----
    *    If the discontinuity in `p` is smaller than ``pi``, but larger than
    *    `discont`, no unwrapping is done because taking the 2*pi complement
    *    would only make the discontinuity larger.

    *    Examples
    *    --------
    *    >>> phase = np.linspace(0, np.pi, num=5)
    *    >>> phase[3:] += np.pi
    *    >>> phase
    *    array([ 0.        ,  0.78539816,  1.57079633,  5.49778714,  6.28318531])
    *    >>> np.unwrap(phase)
    *    array([ 0.        ,  0.78539816,  1.57079633, -0.78539816,  0.        ])
    *
    */
    unwrap: function (p, discont, axis) {
        discont = discont || Math.PI;
        axis = axis || -1;
        var me = this;
        var nd = p.length;
        var dd = me.diff(p);
        //slice1 = [slice(None, None)] * nd
        // slice1[axis] = slice(1, None)
        // ddmod = mod(dd + pi, 2 * pi) - pi
        var ddmod = dd.select(function (x) {
            return (x + Math.PI) % (2 * Math.PI) - Math.PI;
        })
        // _nx.copyto(ddmod, pi, where = (ddmod == -pi) & (dd > 0))
        ddmod = ddmod.select(function (x, index) {
            return x === -Math.PI && dd[index] > 0 ? Math.PI : x;
        });
        // ph_correct = ddmod - dd;
        var ph_correct = ddmod.select(function (x, index) {
            return x - dd[index];
        });

        // _nx.copyto(ph_correct, 0, where = abs(dd) < discont)
        ph_correct = ph_correct.select(function (x, index) {
            return Math.abs(dd[index]) < discont ? 0 : x;
        })
        // up = array(p, copy = True, dtype = 'd')
        // up[slice1] = p[slice1] + ph_correct.cumsum(axis)
        var correct = ph_correct.cumsum();
        return p.select(function (x, index) {
            return x + (correct[index - 1] || 0);
        });

    },
    /**
    *
    *  Calculate the n-th order discrete difference along given axis.
    *  The first order difference is given by ``out[n] = a[n+1] - a[n]`` along
    *  the given axis, higher order differences are calculated by using `diff`
    *  recursively.

    *  Parameters
    *  ----------
    *  a : array_like
    *      Input array
    *  n : int, optional
    *      The number of times values are differenced.
    *  axis : int, optional
    *      The axis along which the difference is taken, default is the last axis.
    *
    *  Returns
    *  -------
    *  diff : ndarray
    *      The `n` order differences. The shape of the output is the same as `a`
    *      except along `axis` where the dimension is smaller by `n`.
    *
    *
    */
    diff: function (array, n) {
        n = n || 1;

        var res = array.subset(1).select(function (x, index) {
            return x - array[index];
        });
        if (n > 1) {
            n--;
            return me.diff(res, n);
        }
        return res;
    }
})