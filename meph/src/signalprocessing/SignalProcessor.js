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
        sampleRate: 44100,
        joiningFunc: null,
        framesize: 2048,
        lastphase: null
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
    fft: function (array, type, outputOffset, outputStride, inputOffset, inputStride) {
        type = type !== undefined ? type : 'real';
        var size = type === 'real' ? array.length * 2 : array.length;
        var output = new Float32Array(size);
        outputOffset = outputOffset !== undefined ? outputOffset : 0;
        outputStride = outputStride !== undefined ? outputStride : 1;

        inputOffset = inputOffset !== undefined ? inputOffset : 0;
        inputStride = inputStride !== undefined ? inputStride : 1;
        var fft = new FFT();

        fft.complex(type === 'complex' ? array.length / 2 : array.length, false);
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
        type = type !== undefined ? type : 'complex';
        var size = array.length;
        var output = new Float32Array(type === 'complex' ? size : size * 2);
        outputOffset = outputOffset !== undefined ? outputOffset : 0;
        outputStride = outputStride !== undefined ? outputStride : 1;

        inputOffset = inputOffset !== undefined ? inputOffset : 0;
        inputStride = inputStride !== undefined ? inputStride : 1;
        var fft = new FFT();

        fft.complex(output.length / 2, true);
        fft.process(output, outputOffset, outputStride, array, inputOffset, inputStride, false);

        output.foreach(function (t, i) {
            output[i] = output[i] / (size / 2);
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
     * Gets/Sets the frame size.
     **/
    frameSize: function (size) {
        var me = this;
        if (size) {
            me.framesize = size;
            me.framesize2 = size / 2;
        }
        return me.framesize;
    },
    oversampling: function (os) {
        var me = this;
        if (os) {
            me.oversample = os;
        }
        return me.oversample;
    },
    samplingRate: function (sr) {
        var me = this;
        if (sr) {
            me.samplingrate = sr;
        }
        return me.samplingrate;
    },
    /**
     *
     * Analysis of the input.
     **/
    analysis: function (input) {
        var me = this,
            magn, phase,
            real, expct,
            stepSize, tmp, freqPerBin,
            sampleRate = me.samplingRate(),
            qpd, osamp = me.oversampling(),
            imag;
        me.lastphase = me.lastphase || new Float32Array(me.framesize2);
        if (me.lastphase.length !== me.framesize2) {
            me.lastphase = new Float32Array(me.framesize2)
        }
        stepSize = me.frameSize() / osamp;
        expct = 2 * Math.PI * stepSize / me.frameSize();
        freqPerBin = sampleRate / me.frameSize();
        var res = {
            mag: new Float32Array(me.framesize2),
            freq: new Float32Array(me.framesize2)
        }
        for (var k = 0 ; k < me.framesize2; k++) {
            /* de-interlace FFT buffer */
            real = input[2 * k];
            imag = input[2 * k + 1];

            /* compute magnitude and phase */
            magn = 2. * Math.sqrt(real * real + imag * imag);
            phase = Math.atan2(imag, real);

            /* compute phase difference */
            tmp = phase - me.lastphase[k];
            me.lastphase[k] = phase;

            /* subtract expected phase difference */
            tmp -= k * expct;

            /* map delta phase into +/- Pi interval */
            qpd = tmp / Math.PI;
            if (qpd >= 0) {
                qpd += (qpd & 1);
            }
            else {
                qpd -= (qpd & 1);
            }
            tmp -= Math.PI * qpd;

            /* get deviation from bin frequency from the +/- Pi interval */
            tmp = osamp * tmp / (2.0 * Math.PI);

            /* compute the k-th partials' true frequency */
            tmp = k * freqPerBin + tmp * freqPerBin;

            res.mag[k] = magn;
            res.freq[k] = tmp;
        }
        return res;
    },
    /**
     * Pitch shifts input.
     ***/
    pitch: function (analysisframe, pitchShift) {
        var me = this, k,
            synthesisMag = new Float32Array(me.frameSize()),
            synthesisFreq = new Float32Array(me.frameSize()),
            index;
        for (k = 0; k < me.framesize2; k++) {
            index = Math.floor(k * pitchShift);
            if (index < me.framesize2) {
                synthesisMag[index] += analysisframe.mag[k];
                synthesisFreq[index] = analysisframe.freq[k] * pitchShift;
            }
        }
        return {
            mag: synthesisMag,
            freq: synthesisFreq
        }
    },
    synthesis: function (frame) {
        var me = this,
            k, osamp, stepSize,
            expct,
            sampleRate = me.samplingRate(),
            freqPerBin;

        osamp = me.oversampling();
        stepSize = me.frameSize() / osamp;
        expct = 2 * Math.PI * stepSize / me.frameSize();
        freqPerBin = sampleRate / me.frameSize();
        me.sumPhase = me.sumPhase || new Float32Array(me.framesize2);
        if (me.sumPhase.length !== me.framesize2) {
            me.sumPhase = new Float32Array(me.framesize2);
        }
        var result = new Float32Array(me.frameSize());
        for (k = 0; k < me.framesize2; k++) {

            /* get magnitude and true frequency from synthesis arrays */
            magn = frame.mag[k];
            tmp = frame.freq[k];

            /* subtract bin mid frequency */
            tmp -= k * freqPerBin;

            /* get bin deviation from freq deviation */
            tmp /= freqPerBin;

            /* take osamp into account */
            tmp = 2.0 * Math.PI * tmp / osamp;

            /* add the overlap phase advance back in */
            tmp += k * expct;

            /* accumulate delta phase to get bin phase */
            me.sumPhase[k] += tmp;
            phase = me.sumPhase[k];

            /* get real and imag part and re-interleave */
            result[2 * k] = magn * Math.cos(phase);
            result[2 * k + 1] = magn * Math.sin(phase);
        }
        return result;
    },
    /*
     *
     * do windowing and add to output accumulator 
     * @param {Array} frame
     * @param {Array} output
     */
    unwindow: function (frame, output) {
        var me = this,
            window,
            osamp,
            k;
        osamp = me.oversampling();

        for (k = 0; k < me.frameSize() ; k++) {
            window = -.5 * Math.cos(2.0 * Math.PI * k / me.frameSize()) + .5;
            output[k] += 2. * window * (frame[2 * k] || 0) / (me.framesize2 * osamp);
        };
        return output;
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
     * @param {Number} stretch how much to stretch the windows.
     * @param {Number} overlap the overlap factor of the windowing function.
     * @param {Number} width overrides the calculated width.
     * @param {String} type , complex or real
     **/
    stretch: function (signal, stretch, overlap, width, type) {
        var len = signal.length, me = this;
        overlap = overlap === null ? .5 : overlap;
        var windowWidth = width || me.windowWidth(signal.length);

        stretch = type === 'complex' ? stretch : stretch * 2;
        var windows = me.fftwindows(signal, windowWidth);
        var frames = windows.select(function (x, index) {
            return {
                a: x,
                b: windows[index + 1] || null
            }
        });

        var interpolatedWindows = me.interpolateFrames(windowWidth * 2, windows, type === 'complex' ? stretch : stretch / 2, overlap);

        var ifftwindows = me.ifftwindows(interpolatedWindows);
        var res = me.joinWindows(ifftwindows, me.joining(), overlap, stretch * len);

        return res//.subset(0, Math.ceil(stretch * signal.length * (1 / (overlap || 1))));
    },
    /**
     * @private
     **/
    interpolateFrames: function (windowWidth, windows, stretch, overlap) {
        var me = this, unwrappedPhase, phase, amplitude, rectangular,
            a, b, halfIndex,
            unwrappedA, unwrappedB,
            lerp, frame, gth,
            fth, interpolateVal, inverseoverlap = (1 / (overlap || 1)),
        generatedWindowFrames;
        generatedWindowFrames = me.generateWindows(windowWidth, Math.ceil(windows.length * stretch * inverseoverlap));
        lerp = MEPH.util.Vector.Lerp;

        var unwrappedPhase = windows.first().phase.select();
        var wwindow = windowWidth / 2;

        var unwrappedPhase = [].interpolate(0, windows.first().phase.length, function (x) {
            return windows.select(function (t) {
                return t.phase[x];
            })
        }).select(function (x) {
            return me.unwrap(x);
        });

        var lastXsk = null, hop = windowWidth * overlap;
        generatedWindowFrames.foreach(function (Xsk, i) {
            fth = Math.floor(i / (stretch * inverseoverlap));
            gth = Math.ceil(i / (stretch * inverseoverlap));
            interpolateVal = (i / (stretch)) - fth;
            a = windows[fth];
            b = windows[gth];
            b = b || a;
            if (fth > gth) {
                throw new Error('Frames are out of sequence.')
            }
            Xsk.step(2, function (xsk, index) {
                halfIndex = index / 2;
                //unwrappedPhase = unwrappedB ? lerp(unwrappedA[halfIndex], unwrappedB[halfIndex], interpolateVal) : unwrappedA[halfIndex];
                //phase = unwrappedPhase //% Math.PI;
                //amplitude = unwrappedB ? lerp(a.amplitude[halfIndex], b.amplitude[halfIndex], interpolateVal) : a.amplitude[halfIndex];
                //rectangular = MEPH.math.Util.rectangular(phase, amplitude);
                var phasea = unwrappedPhase[halfIndex][fth];
                var phaseb = unwrappedPhase[halfIndex][gth];
                if (lastXsk) {
                    var dpkm = (phaseb - phasea) / (hop);
                    //var dpckm = (hop * (Math.PI * 2)) / (wwindow / (wwindow / 2));
                    var polar = MEPH.math.Util.polar(lastXsk[index], lastXsk[index + 1]);
                    var pa = polar.theta + dpkm * stretch * overlap;
                    //var pa = dpckm + (halfIndex / hop) * (1 / wwindow);
                    phasea = pa;/// me.unwrap([phasea, pa]).last();
                }
                // var phasea = unwrappedPhase[halfIndex];
                //var phasea = a.phase[halfIndex]
                //var phaseb;
                //phaseb = b.phase[halfIndex];

                //var dp = phaseb - phasea - (2 * Math.PI * (wwindow / 2)) / (wwindow / index);
                //dp = dp - 2 * Math.PI * Math.round(dp / (2 * Math.PI));
                //phaseb = dp;

                // b.phase[halfIndex] = phaseb;
                //var x = b && b.raw ? lerp(a.raw[index], b.raw[index], interpolateVal) : a.raw[index];
                //var y = b && b.raw ? lerp(a.raw[index + 1], b.raw[index + 1], interpolateVal) : a.raw[index + 1];
                var x = phasea;
                // var x = lerp(phasea, phaseb, interpolateVal);
                var y = lerp(a.amplitude[halfIndex], b.amplitude[halfIndex], interpolateVal);
                var rect = MEPH.math.Util.rectangular(x, y)
                //var x = a.raw[index];
                //var y = a.raw[index + 1];
                //Xsk[index] = x;
                //Xsk[index + 1] = y;
                Xsk[index] = rect.x;
                Xsk[index + 1] = rect.y;
            });
            lastXsk = Xsk;
        });

        return generatedWindowFrames;
    },
    joinWindows: function (windows, joinfunc, stepratio, length) {
        var windowWidth = windows.first().length;
        stepratio = stepratio || 1;
        var resultSignalLength = length;
        var res = new Float32Array(resultSignalLength);


        res.step(2, function (x, rindex) {
            //var percentage = index / res;
            var indexesOfContributingWindows = windows.indexWhere(function (w, index) {
                var start = index * stepratio * windowWidth;
                var end = start + windowWidth - 1;
                return start <= rindex && rindex < end;
            });

            var contributionsWindow = indexesOfContributingWindows.select(function (w, index) {
                var t = windows[w];
                var start = Math.floor(w * stepratio * windowWidth);
                var contribution = joinfunc(rindex - start, windowWidth);
                return {
                    window: windows[w],
                    start: start,
                    contribution: contribution < 0 ? 0 : contribution
                }
            });

            var total = contributionsWindow.addition(function (t) {
                return t.contribution;
            });
            var r = contributionsWindow.addition(function (t, index) {
                var w = t.window;
                return total === 0 ? w[rindex - t.start] : (t.contribution / total) * w[rindex - t.start];
            });
            res[rindex] = r;

            r = contributionsWindow.addition(function (t, index) {
                var w = t.window;
                return (t.contribution / total) * w[(rindex + 1) - t.start];
            });
            res[rindex + 1] = r;

            //var r = indexesOfContributingWindows.addition(function (w, index) {
            //    var t = windows[w];
            //    var start = w * stepratio * windowWidth;
            //    var contribution = joinfunc(rindex - start, windowWidth);
            //    return contribution < 0 ? 0 : contribution * t[rindex - start];
            //});
            //res[rindex] = r;

            //r = indexesOfContributingWindows.addition(function (w, index) {
            //    var t = windows[w];
            //    var start = w * stepratio * windowWidth;
            //    var contribution = joinfunc((rindex) - (start), windowWidth);
            //    return contribution < 0 ? 0 : contribution * t[(rindex + 1) - (start)];
            //});
            //res[rindex + 1] = r;
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
            var windowSlice = signal.subset(windowStartIndex, windowEndIndex);//, windowing, t === 0, t === (steps - 1)
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
            me.windowingFunc = w;
        }
        return me.windowingFunc;
    },
    /**
     *  Do windowing and re,im interleave
     ***/
    interleaveInput: function (input) {
        var me = this, window, framesize = me.frameSize(),
            gFFTworksp = me.getArray(input, framesize * 2);
        for (k = 0; k < me.frameSize() ; k++) {
            window = -.5 * Math.cos(2. * Math.PI * k / framesize) + .5;
            gFFTworksp[2 * k] = input[k] * window;
            gFFTworksp[2 * k + 1] = 0.;
        }
        return gFFTworksp;
    },
    getArray: function (array, length) {
        if (array instanceof Float32Array) {
            return new Float32Array(length);
        }
        else if (array instanceof Float64Array) {
            return new Float64Array(length);
        }
        return [].interpolate(0, length, function () { return 0; });
    }
})