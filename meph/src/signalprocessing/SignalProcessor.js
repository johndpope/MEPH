/**
 * @class MEPH.signalprocessing.SignalProcessor
 * @extends MEPH.control.Control
 * Signal processing library.
 **/
MEPH.define('MEPH.signalprocessing.SignalProcessor', {
    requires: ['MEPH.math.FFT', 'MEPH.math.Util', 'MEPH.util.Vector'],
    statics: {
        maximumWindow: 1024
    },
    properties: {
        windowingFunc: null,
        joiningFunc: null
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
        var size = array.length * 2;
        var output = new Float32Array(size);
        outputOffset = outputOffset !== undefined ? outputOffset : 0;
        outputStride = outputStride !== undefined ? outputStride : 1;

        inputOffset = inputOffset !== undefined ? inputOffset : 0;
        inputStride = inputStride !== undefined ? inputStride : 1;
        type = type !== undefined ? type : 'real';
        var fft = new FFT();

        fft.complex(array.length, false);
        fft.process(output, outputOffset, outputStride, array, inputOffset, inputStride, type)
        return output;
    },/**
     * Performs an inverse fast fourier transform(FFT).
     * @param {Array} array
     * @param {Number} outputOffset
     * @param {Number} outputStride
     * @param {Number} inputOffset
     * @param {Number} inputStide
     * @param {Array} output
     ***/
    ifft: function (array, outputOffset, outputStride, inputOffset, inputStride, type) {
        var size = array.length;
        var output = new Float32Array(size);
        outputOffset = outputOffset !== undefined ? outputOffset : 0;
        outputStride = outputStride !== undefined ? outputStride : 1;

        inputOffset = inputOffset !== undefined ? inputOffset : 0;
        inputStride = inputStride !== undefined ? inputStride : 1;
        type = type !== undefined ? type : 'complex';
        var fft = new FFT();

        fft.complex(array.length / 2, true);
        fft.process(output, outputOffset, outputStride, array, inputOffset, inputStride, false);
        output.foreach(function (t, i) {
            output[i] = output[i] / size;
        })
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
            res[x] = MEPH.math.Util.polar(fftarray[index], fftarray[index + 1]).radius;
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
    },
    /**
     *
     * Stretches a signal by the stretch factor, resulting in a signal * stretch long.
     * @param {Array} signal
     * @param {Number} stretch
     **/
    stretch: function (signal, stretch, overlap, width) {
        var len = signal.length, me = this;
        overlap = overlap === null ? .5 : overlap;
        var windowWidth = width || me.windowWidth(signal.length);
        var windows = me.fftwindows(signal, windowWidth );
        var frames = windows.select(function (x, index) {
            return {
                a: x,
                b: windows[index + 1] || null
            }
        });

        var interpolatedWindows = me.interpolateFrames(windowWidth, windows, stretch, frames, overlap);
        var ifftwindows = me.ifftwindows(interpolatedWindows);
        var res = me.joinWindows(ifftwindows, me.joining(), overlap);

        return res.subset(0, Math.ceil(stretch * signal.length * (1 / (overlap || 1))));
    },
    /**
     * @private
     **/
    interpolateFrames: function (windowWidth, windows, stretch, frames, overlap) {
        var me = this, unwrappedPhase, phase, amplitude, rectangular,
            a, b, halfIndex,
            unwrappedA, unwrappedB,
            lerp, frame,
            fth, interpolateVal, inverseoverlap = (1 / (overlap || 1)),
        generatedWindowFrames;
        generatedWindowFrames = me.generateWindows(windowWidth, Math.ceil(windows.length * stretch * inverseoverlap));
        lerp = MEPH.util.Vector.Lerp;

        generatedWindowFrames.foreach(function (Xsk, i) {
            fth = Math.floor(i / (stretch * inverseoverlap));
            interpolateVal = (i / (stretch * inverseoverlap)) - fth;
            frame = frames[fth];
            a = frame.a;
            b = frame.b;
            unwrappedA = me.unwrap(a.phase);
            if (b) {
                unwrappedB = me.unwrap(b.phase);
            }
            else {
                unwrappedB = null;
            }
            Xsk.step(2, function (xsk, index) {
                halfIndex = index / 2;
                unwrappedPhase = unwrappedB ? lerp(unwrappedA[halfIndex], unwrappedB[halfIndex], interpolateVal) : unwrappedA[halfIndex];
                phase = unwrappedPhase % Math.PI;
                amplitude = unwrappedB ? lerp(a.amplitude[halfIndex], b.amplitude[halfIndex], interpolateVal) : a.amplitude[halfIndex];
                rectangular = MEPH.math.Util.rectangular(phase, amplitude);
                Xsk[index] = rectangular.x;
                Xsk[index + 1] = rectangular.y;
            })
        });

        return generatedWindowFrames;
    },
    joinWindows: function (windows, joinfunc, stepratio) {
        var windowWidth = windows.first().length;
        stepratio = stepratio || 1;
        var resultSignalLength = windows.first().length * (windows.length + 1) * stepratio;
        var res = new Float32Array(resultSignalLength);
        //windows.foreach(function (w) {
        //    joinfunc()
        //    w.foreach(function (t, index) {
        //        joinfunc(t, w.length);
        //    })
        //});

        res.step(2, function (x, rindex) {
            //var percentage = index / res;
            var indexesOfContributingWindows = windows.indexWhere(function (w, index) {
                var start = index * stepratio * windowWidth;
                var end = start + windowWidth;
                return start <= rindex && rindex < end;
            });
            var r = indexesOfContributingWindows.addition(function (w, index) {
                var t = windows[w];
                var start = w * stepratio * windowWidth;
                var contribution = joinfunc(rindex - start, windowWidth);
                return contribution < 0 ? 0 : contribution * t[rindex - start];
            });
            res[rindex] = r;

            r = indexesOfContributingWindows.addition(function (w, index) {
                var t = windows[w];
                var start = w * stepratio * windowWidth;
                var contribution = joinfunc((rindex) - (start), windowWidth);
                return contribution < 0 ? 0 : contribution * t[(rindex + 1) - (start)];
            });
            res[rindex + 1] = r;
        });
        return res;
    },
    /**
     * Splits real signal arrays into fft chunks.
     * @param {Array} signal
     * @param {Number} step
     **/
    fftwindows: function (signal, step) {
        var me = this;
        var windowing = me.windowing();
        if (!windowing) {
            throw new Error('Set a windowing function.');
        }
        var steps = Math.ceil(signal.length / step);
        var result = [].interpolate(0, steps, function (t) {
            var windowStartIndex = t * step;
            var windowEndIndex = (t + 1) * step;
            var windowSlice = signal.window(windowStartIndex, windowEndIndex, windowing, t === 0, t === (steps - 1));
            var windowFFT = me.fft(windowSlice);
            return {
                raw: windowFFT,
                phase: me.phase(windowFFT),
                amplitude: me.amplitude(windowFFT)
            };
        });

        return result;
    },
    ifftwindows: function (windows) {
        var me = this;
        var res = windows.select(function (w) {
            return me.ifft(w);
        });
        return res;
    },
    /**
     * Generates a count of series of arrays of size long
     **/
    generateWindows: function (size, count) {
        return [].interpolate(0, count, function (x) {
            return new Float32Array(size);
        })
    },
    /**
     * Selects a windows width based on the signal length.
     * @param {Number} len
     **/
    windowWidth: function (len) {
        var length = Math.log(len) / Math.log(2);

        return Math.pow(2, Math.min(MEPH.signalprocessing.SignalProcessor.maximumWindow, Math.max(2, (length / 2))));
    },
    /**
     * Gets/Sets the function to use for windowing.
     */
    windowing: function (w) {
        var me = this;
        if (w !== undefined) {
            me.windowingFunc = w;
        }
        return me.windowingFunc;
    },
    joining: function (w) {
        var me = this;
        if (w !== undefined) {
            me.joiningFunc = w;
        }
        return me.joiningFunc;
    }
})