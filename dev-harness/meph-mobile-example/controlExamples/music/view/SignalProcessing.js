MEPH.define('MEPHControls.music.view.SignalProcessing', {
    alias: 'mephcontrols_signalprocessings',
    templates: true,
    extend: 'MEPH.mobile.activity.container.Container',
    mixins: ['MEPH.mobile.mixins.Activity'],
    requires: [
        'MEPH.signalprocessing.SignalProcessor',
        'MEPH.audio.view.Visualizer',
        'MEPH.audio.view.VisualSelector'],
    properties: {
        name: null,
        data: null,
        verticalScroll: 0,
        N: 4096,
        Ns: 4096,
        M: 2048,
        H: 1024,
        T: -45,
        fs: 44100,
        freqdata: null,
        magdata: null,
        samples: 512,
        phasedata: null
    },
    initialize: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.on('load', me.onLoaded.bind(me));
    },
    onLoaded: function () {
        var me = this;
        me.name = 'Signal processing';
        var sp = new SignalProcessor();
        me.sp = sp;
    },
    processAFrame: function () {
        var me = this;
        var sampleRate = 44100;
        var len = sampleRate * 2;
        var N = me.N;
        var Ns = me.Ns;
        var M = me.M;
        var H = Math.floor(Ns / 4);
        var t = -me.T;
        var fs = sampleRate;
        var w = [].interpolate(0, M, function (x) {
            return MEPH.math.Util.window.Hamming(x, M);
        });
        var signal = (new Float32Array(len)).select(function (i, x) {
            return .5 * Math.sin((x / fs) * 2 * 490 * Math.PI) + .5 * Math.sin((x / fs) * 2 * 440 * Math.PI);
        });

        var sp = me.sp;

        var res = sp.dftAnal(signal, w, N);
        me.magdata = res.mX.select(function (x) {
            return Math.abs(x);
        }).subset(0, me.samples);
        me.phasedata = res.pX.select(function (x) { return Math.abs(x); })
            .select(function (x) {
                if (x === 0) {
                    return 2.2204460492503130808472633361816E-16;
                }
                return x;
            })
        .select(function (x) {
            return sp.toDb(x);
        }).select(function (x) {
            return Math.abs(x);
        }).subset(0, me.samples);
        me.freqdata = signal.subset(0, 4000);
    },
    processA: function () {
        var me = this;
        var sampleRate = 44100;
        var len = sampleRate * 2;
        var N = me.N;
        var Ns = me.Ns;
        var M = me.M;
        var H = Math.floor(Ns / 4);
        var t = -me.T;
        var fs = sampleRate;
        var w = [].interpolate(0, M, function (x) {
            return MEPH.math.Util.window.Blackman(x, M);
        });
        var signal = (new Float32Array(len)).select(function (i, x) {
            return .9 * Math.cos((x / fs) * 2 * 440 * Math.PI);
        });

        var sp = me.sp;

        var res = sp.sineModelAnal(signal, fs, w, N, H, t);

        var freq = res.tfreq.select(function (x) {
            return x.first() || 0;
        });

        var mag = res.tmag.select(function (x) {
            return x.first() || 0;
        });
        var phase = res.tphase.select(function (x) {
            return x.first() || 0;
        });
        me.freqdata = freq;
        me.magdata = mag;
        me.phasedata = phase;
    }
});