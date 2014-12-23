/**
 * @class MEPH.audio.sbsms.SMS
 **/
MEPH.define('MEPH.audio.sbsms.SMS', {
    statics: {
    },
    requires: ['MEPH.audio.sbsms.Util'],
    properties: {
        //        list<TrackPoint*> ended[2];
        ended: null,
        //list<TrackPoint*> started[2];
        started: null,
        //int minTrackSize;
        minTrackSize: 0,
        //int peakWidth0;
        peakWidth0: 0,
        //int peakWidth1;
        peakWidth1: 0,
        //int peakWidth2;
        peakWidth2: 0,
        //int minCutSep1;
        minCutSep1: 0,
        //int minCutSep2;
        minCutSep2: 0,
        //int minK;
        minK: 0,
        //int maxK;
        maxK: 0,
        //float peakThresh;
        peakThresh: 0,
        //float maxCost2;
        maxCost2: 0,
        //float maxDF;
        maxDF: 0,
        //float dMCoeff2;
        dMCoeff2: 0,
        //float dNCoeff2;
        dNCoeff2: 0,
        //float maxDFSplitMerge;
        maxDFSplitMerge: 0,
        //float maxCost2SplitMerge;
        maxCost2SplitMerge: 0,
        //float dMCoeff2SplitMerge;
        dMCoeff2SplitMerge: 0,
        //float maxCost2Match;
        maxCost2Match: 0,
        //float maxDFMatch;
        maxDFMatch: 0,
        //float dMCoeff2Match;
        dMCoeff2Match: 0,
        //float maxCost2Stereo;
        maxCost2Stereo: 0,
        //float maxDFStereo;
        maxDFStereo: 0,
        //float dMCoeff2Stereo;
        dMCoeff2Stereo: 0,
        //float maxFMatchM;
        maxFMatchM: 0,
        //float minFMatchL;
        minFMatchL: 0,
        //float minFLo;
        minFLo: 0,
        //float maxFHi;
        maxFHi: 0,
        //float minFMid;
        minFMid: 0,
        //float maxFMid;
        maxFMid: 0,
        //int kStart;
        kStart: 0,
        //int kEnd;
        kEnd: 0,
        //int kLo;
        kLo: 0,
        //int kHi;
        kHi: 0,
        //float mNorm;
        mNorm: 0,
        //float localFavorRatio;
        localFavorRatio: 0,
        //queue<Slice*> adjust2SliceQueue[2];
        adjust2SliceQueue: null,
        //queue<Slice*> adjust1SliceQueue[2];
        adjust1SliceQueue: null,
        //RingBuffer<Slice*> sliceBuffer[2];
        sliceBuffer: null,
        //Slice* sliceM0[2];
        sliceM0: null,
        //Slice* sliceL0[2];
        sliceL0: null,
        //Slice* sliceH0[2];
        sliceH0: null,
        //Slice* sliceM1[2];
        sliceM1: null,
        //Slice* sliceL1[2];
        sliceL1: null,
        //Slice* sliceM2[2];
        sliceM2: null,
        //Slice* sliceH1[2];
        sliceH1: null,
        //audio* x10[2];
        x10: null,
        //audio* x11[2];
        x11: null,
        //float* dmag1[2];
        dmag1: null,
        //float* mag11[2];
        mag11: null,
        //audio* x00[2];
        x00: null,
        //audio* x01[2];
        x01: null,
        //float* dmag0[2];
        dmag0: null,
        //float* mag01[2];
        mag01: null,
        //float *mag2[2];
        mag2: null,
        //audio* x2[2];
        x2: null,
        //float* dec2[2];
        dec2: null,
        //float *peak20;
        peak20: null,
        //float *peak2N;
        peak2N: null,
        //int N;
        N: 0,
        //int Nover2;
        Nover2: 0,
        //SMS *lo;
        lo: null,
        //SMS *hi;
        hi: null,
        //queue<TrackIndexType> trackIndex[2];
        trackIndex: null,
        //queue<float*> mag1Queue[2];
        mag1Queue: null,
        //queue<float*> mag0Queue[2];
        mag0Queue: null,
        //float *trial2Buf[2];
        trial2Buf: null,
        //ArrayRingBuffer<float> *trial2RingBuf[2];
        trial2RingBuf: null,
        //GrainBuf *trial2GrainBuf;
        trial2GrainBuf: null,
        //float *trial1Buf[2];
        trial1Buf: null,
        //ArrayRingBuffer<float> *trial1RingBuf[2];
        trial1RingBuf: null,
        //GrainBuf *trial1GrainBuf;
        trial1GrainBuf: null,
        //list<Track*> assignTracks[2];
        assignTracks: null,
        //list<Track*> renderTracks[2];
        renderTracks: null,
        //TimeType addtime[2];
        addtime: null,
        //TimeType assigntime[2];
        assigntime: null,
        //TimeType trial2time[2];
        trial2time: null,
        //TimeType adjust2time;
        adjust2time: null,
        //TimeType trial1time[2];
        trial1time: null,
        //TimeType adjust1time;
        adjust1time: null,
        //TimeType synthtime[2];
        synthtime: null,
        //queue<int> nRender[2];
        nRender: null,
        //double h2cum;
        h2cum: 0,
        //int channels;
        channels: 0,
        //long res;
        res: null,
        //long resMask;
        resMask: 0,
        //int h;
        h: 0,
        //float M;
        M: 0,
        //double h1;
        h1: 0,
        //int band;  
        band: 0,
        //#ifdef MULTITHREADED
        //pthread_mutex_t sliceMutex[2];
        //pthread_mutex_t magMutex[2];
        //pthread_mutex_t renderMutex[2];
        //pthread_mutex_t trial2Mutex[2];
        //pthread_mutex_t trial1Mutex[2];
        //pthread_mutex_t trackMutex[2];
        //#endif
        //bool bAssignDone[2];
        bAssignDone: null
    },
    //SMS *lo, int N, int band, int bandMax, int h, int res, int N0, int N1, int N2, int channels, audio *peak2
    initialize: function (lo, N, band, bandMax, h, res, N0, N1, N2, channels, peak2) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        this.lo = lo;
        if (lo) lo.hi = this;
        this.hi = null;
        this.band = band;
        this.h = h;
        this.h1 = (h << band);
        this.res = res;
        this.resMask = res - 1;
        this.channels = channels;
        this.N = N;
        this.Nover2 = N / 2;
        var pad2 = N / N2;
        var pad1 = N / N1;
        var pad0 = N / N0;
        me.M = (1 << band);
        var M = me.M;
        me.peakThresh = 1e-8;

        var maxDF2 = U.square(0.005 * h) / M;
        me.maxDF = Math.sqrt(maxDF2);
        var maxDF = me.maxDF;
        me.maxCost2 = 0.5 * maxDF2;
        me.dMCoeff2 = 0.002 * maxDF2;

        var maxDF2SplitMerge = Math.square(0.001 * h) / M;
        me.maxDFSplitMerge = Math.sqrt(maxDF2SplitMerge);
        me.maxCost2SplitMerge = 1.0 * maxDF2SplitMerge;
        me.dMCoeff2SplitMerge = 0.006 * maxDF2SplitMerge;

        me.maxDFMatch = .06 / M;
        var maxDFMatch = me.maxDFMatch;
        var maxDF2Match = Math.square(me.maxDFMatch);
        me.dMCoeff2Match = 0.0075 * maxDF2Match;
        me.maxCost2Match = 0.8 * maxDF2Match;

        me.maxDFStereo = .04 / M;
        var maxDF2Stereo = Math.square(me.maxDFStereo);
        me.dMCoeff2Stereo = 0.005 * maxDF2Stereo;
        me.maxCost2Stereo = 1.0 * maxDF2Stereo;

        me.peakWidth0 = lrintf(pad0 * N * 0.0055) + 1;
        var peakWidth0 = me.peakWidth0;
        me.peakWidth1 = lrintf(pad1 * N * 0.0055) + 1;
        me.peakWidth2 = lrintf(pad2 * N * 0.0055) + 1;
        me.minTrackSize = Math.Math.max(384 / (h << band), N2 / h / 2);
        me.minCutSep2 = Math.max(lrintf(0.008 * N), me.peakWidth1);
        me.minCutSep1 = Math.max(lrintf(0.011 * N), me.peakWidth0);
        if (band == bandMax) {
            me.kLo = 1;
        }
        else {
            me.kLo = Math.max(1, lrintf(floor(0.5 * N / lo.N * lo.kHi - maxDFMatch * M / U.TWOPI * N)));
        }
        var kLo = me.kLo;
        if (band == 0) {
            me.kHi = Nover2;
        }
        else {
            me.kHi = Math.max(1, lrintf(0.4785 * N) - peakWidth0 * 2);
        }
        var kHi = me.kHi;
        me.kStart = Math.max(1, kLo - peakWidth0);
        me.kEnd = min(Nover2 - 1, kHi + peakWidth0 * 2);
        var kEnd = me.kEnd;
        var kNorm = U.TWOPI / (M * N);
        me.maxFHi = kHi * kNorm + maxDF;
        me.minFLo = kLo * kNorm - maxDF;
        if (lo) {
            me.maxFMatchM = lo.kHi * U.TWOPI / (lo.N * M * 2) + maxDFMatch;
        }
        else {
            me.maxFMatchM = 0.0;
        }
        var maxFMatchM = me.maxFMatchM;
        me.minFMatchL = kLo * kNorm - maxDFMatch;
        var minFMatchL = me.minFMatchL;
        if (lo) {
            me.maxFMid = lo.kHi * U.TWOPI / (lo.N * M * 2) + maxDF;
        }
        else {
            me.maxFMid = 0.0;
        }
        var maxFMid = me.maxFMid;
        if (lo) {
            lo.minFMid = kLo * kNorm - lo.maxDF;
        }
        if (lo && lo.lo) {
            me.minK = Math.max(1, (lrintf(0.25 * N / lo.lo.N * lo.lo.kHi + peakWidth0)));
        } else {
            me.minK = 1;
        }
        var minK = me.minK;
        me.maxK = Math.min(kEnd, kHi + peakWidth0);
        me.localFavorRatio = 1.1;
        me.mNorm = MScale * MScale * 16.061113032124002 * pad2 / U.square(N);
        //    for(var c=0; c<me.channels; c++) {
        me.bAssignDone = [].interpolate(0, me.channels, function () { return false; });
        me.addtime = [].interpolate(0, me.channels, function () { return 0; });
        me.assigntime = [].interpolate(0, me.channels, function () { return 0; });
        me.trial2time = [].interpolate(0, me.channels, function () { return 0; });
        me.trial1time = [].interpolate(0, me.channels, function () { return 0; });
        me.synthtime = [].interpolate(0, me.channels, function () { return 0; });
        //for(int k=1; k<256; k++) {
        //    trackIndex[c].push(k);
        //}
        me.trackIndex = [].interpolate(0, me.channels, function () {
            return [].interpolate(0, 256);
        });
        me.trial2Buf = [].interpolate(0, me.channels, function () {
            return [].interpolate(0, h * res, function () { return 0; });
        });//[c] = (float*)malloc(h*res*sizeof);
        me.trial2RingBuf = [].interpolate(0, me.channels, function () {
            return [];
        });//[c] = new ArrayRingBuffer<float>(0);
        me.dmag1 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });// = (float*)malloc(N*sizeof);
        me.mag11 = [].interpolate(0, me.channels, function () {
            return [].zeroes(Nover2 + 1);
        });///[c] = (float*)malloc((Nover2+1)*sizeof);
        me.x10 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (audio*)malloc(N*sizeof(audio));
        me.x11 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (audio*)malloc(N*sizeof(audio));
        me.trial1Buf = [].interpolate(0, me.channels, function () {
            return [].zeroes(h * res);
        });//[c] = (float*)malloc(h*res*sizeof);
        me.trial1RingBuf = [].interpolate(0, me.channels, function () {
            return [];
        });//[c] = new ArrayRingBuffer<float>(0);
        me.dmag0 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (float*)malloc(N*sizeof);
        me.mag01 = [].interpolate(0, me.channels, function () {
            return [].zeroes(Nover2 + 1);
        });//[c] = (float*)malloc((Nover2+1)*sizeof);
        me.x00 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (audio*)malloc(N*sizeof(audio));
        me.x01 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (audio*)malloc(N*sizeof(audio));
        me.mag2 = [].interpolate(0, me.channels, function () {
            return [].zeroes(Nover2 + 1);
        });//[c] = (float*)malloc((Nover2+1)*sizeof);
        me.dec2 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (float*)malloc(N*sizeof);
        me.x2 = [].interpolate(0, me.channels, function () {
            return [].zeroes(N);
        });//[c] = (audio*)malloc(N*sizeof(audio));
        //#ifdef MULTITHREADED
        //      pthread_mutex_init(&renderMutex[c],null);
        //      pthread_mutex_init(&trackMutex[c],null);
        //      pthread_mutex_init(&sliceMutex[c],null);
        //      pthread_mutex_init(&trial2Mutex[c],null);
        //      pthread_mutex_init(&trial1Mutex[c],null);
        //      pthread_mutex_init(&magMutex[c],null);
        //#endif
        //  }
        me.h2cum = 0.0;
        me.adjust2time = 0;
        me.adjust1time = 0;
        me.trial2GrainBuf = new GrainBuf(N, h, N1, hannpoisson);
        me.trial1GrainBuf = new GrainBuf(N, h, N0, hannpoisson);
        me.peak20 = [].interpolate(0, me.channels, function () {
            return [].zeroes(2 * N);
        });// = (float*)calloc(2*N,sizeof);
        me.peak2N = [].zeros(2 * N);
        for (var k = -Nover2; k <= Nover2; k++) {
            peak2N[k + Nover2] = U.norm2(peak2[(k + N) % N]);
        }
    },

    destroy: function () {
    },

    //int c
    trial2Start: function (c) {
        var me = this;
        if (me.band >= minTrial2Band) {
            memset(trial2Buf[c], 0, me.h * me.res * sizeof(float));
        }
    },
    //void SMS :: //int c
    trial2End: function (c) {
        var me = this;
        if (me.band < minTrial2Band) return;
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&trial2Mutex[c]);
        //#endif
        me.trial2RingBuf[c].write(trial2Buf[c], me.h * me.res);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&trial2Mutex[c]);
        //#endif
    },
    //void SMS :: //int c
    trial2: function (c) {
        //#ifdef MULTITHREADED
        //    pthread_mutex_lock(&trackMutex[c]);
        //#endif
        //for(list<Track*>::iterator tt = renderTracks[c].begin(); 
        //    tt != renderTracks[c].end();
        //++tt) {
        var stop = false;
        var trial2time = me.trial2time;
        var renderTracks = me.renderTracks;
        [].interpolate(renderTracks[c].begin(), renderTracks[c].end(), function (tt) {
            if (!stop) {
                var t = (tt);
                if (trial2time[c] >= t.start) {
                    if (trial2time[c] > t.last) {
                    }
                    else {
                        t.updateM(trial2time[c], synthModeTrial2);
                        if (hi && hi.band >= minTrial2Band) {
                            var f = 0.5 * M;
                            t.updateFPH(trial2time[c], synthModeTrial2, h << 1, f, f);
                            t.synth(hi.trial2Buf[c], trial2time[c], h << 1, synthModeTrial2, c);
                        }
                        if (lo && lo.band >= minTrial2Band) {
                            var f = 2.0 * M;
                            t.updateFPH(trial2time[c], synthModeTrial2, h >> 1, f, f);
                            t.synth(lo.trial2Buf[c] + (trial2time[c] & (res * lo.res - 1)) * (h >> 1), trial2time[c], h >> 1, synthModeTrial2, c);
                        }
                        if (band >= minTrial2Band) {
                            var f = M;
                            t.updateFPH(trial2time[c], synthModeTrial2, h, f, f);
                        }
                    }
                } else {
                    stop = true;
                }
            }
        });
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&trackMutex[c]);
        //#endif
        trial2time[c]++;
    },

    //void SMS :: //int c
    trial1Start: function (c) {
        var me = this;
        if (me.band >= minTrial1Band) {
            memset(me.trial1Buf[c], 0, me.h * me.res);
        }
    },
    //int c
    trial1End: function (c) {
        var me = this;
        if (me.band < minTrial1Band) return;
        //#ifdef MULTITHREADED
        //    pthread_mutex_lock(&trial1Mutex[c]);
        //#endif
        me.trial1RingBuf[c].write(trial1Buf[c], me.h * me.res);
        //#ifdef MULTITHREADED
        //    pthread_mutex_unlock(&trial1Mutex[c]);
        //#endif
    },
    //    void SMS ::     int c
    trial1: function (c) {
        //#ifdef MULTITHREADED
        //    pthread_mutex_lock(&trackMutex[c]);
        //#endif
        //for(list<Track*>::iterator tt = renderTracks[c].begin(); 
        //    tt != renderTracks[c].end();
        //++tt) {
        var me = this;
        var trial1time = me.trial1time;
        var M = me.M
        var stop = false;
        var h = me.h;
        var hi = me.hi;
        var lo = me.lo;
        var renderTracks = me.renderTracks;
        var resMask = me.resMask;
        var res = me.res;
        [].interpolate(renderTracks[c].begin(), renderTracks[c].end(), function (tt) {
            var t = (tt);//Track *
            if (stop) return;
            if (trial1time[c] >= t.start) {
                if (trial1time[c] > t.last) {
                }
                else {
                    t.updateM(trial1time[c], synthModeTrial1);
                    if (hi && hi.band >= minTrial1Band) {
                        var f = 0.5 * M;
                        t.updateFPH(trial1time[c], synthModeTrial1, h << 1, f, f);
                        t.synth(hi.trial1Buf[c], trial1time[c], h << 1, synthModeTrial1, c);
                    }
                    if (lo && lo.band >= minTrial1Band) {
                        var f = 2.0 * M;
                        t.updateFPH(trial1time[c], synthModeTrial1, h >> 1, f, f);
                        t.synth(lo.trial1Buf[c] + (trial1time[c] & (res * lo.res - 1)) * (h >> 1), trial1time[c], h >> 1, synthModeTrial1, c);
                    }
                    if (band >= minTrial1Band) {
                        var f = M;
                        t.updateFPH(trial1time[c], synthModeTrial1, h, f, f);
                        t.synth(trial1Buf[c] + (trial1time[c] & resMask) * h, trial1time[c], h, synthModeTrial1, c);
                    }
                }
            } else {
                stop = true;
            }
        });
        //#ifdef MULTITHREADED
        //    pthread_mutex_unlock(&trackMutex[c]);
        //#endif
        trial1time[c]++;
    },
    //void SMS :: 
    adjust2: function () {
        var me = this;
        var slice = [].zeros(2);//Slice* 
        for (var c = 0; c < me.channels; c++) {
            //#ifdef MULTITHREADED
            //      pthread_mutex_lock(&sliceMutex[c]);
            //#endif
            slice[c] = adjust2SliceQueue[c].front(); adjust2SliceQueue[c].pop();
            //#ifdef MULTITHREADED
            //      pthread_mutex_unlock(&sliceMutex[c]);
            //#endif
        }
        if (band >= minTrial2Band) {
            //#ifdef MULTITHREADED
            //    for(int c=0; c<channels; c++) {
            //        pthread_mutex_lock(&trial2Mutex[c]);
            //    }
            //#endif
            me.adjustInit(me.trial2RingBuf, me.trial2GrainBuf);
            //#ifdef MULTITHREADED
            //    for(int c=channels-1; c>=0; c--) {
            //        pthread_mutex_unlock(&trial2Mutex[c]);
            //    }
            //#endif
            me.adjust(me.trial2GrainBuf, me.mag1Queue, me.minCutSep1, me.mag11, me.dmag1,
                me.x11, me.adjust2time, slice);
        }
        if (me.channels == 2) {
            for (var c = 0; c < 2; c++) {
                //for(TrackPoint *pc = slice[c].bottom;
                //    pc;
                //    pc = pc.pn) {
                //    pc.bOwned = false;
                //    pc.cont = null;
                //}
                var pc = slice[c].bottom;
                while (pc) {
                    pc.bOwned = false;
                    pc.cont = null;
                    pc = pc.pn;
                }

            }
            for (var c = 0; c < 2; c++) {
                var c2 = (c == 0 ? 1 : 0);
                var begin = slice[c2].bottom;
                var pc = slice[c].bottom;
                while (pc) {
                    var F;
                    pc.cont = me.nearestForward(begin, pc, F, me.maxCost2Stereo, me.maxDFStereo, me.dMCoeff2Stereo);
                    pc = pc.pn
                }
            }
            //TrackPoint *p0 = slice[0].bottom;
            var p0 = slice[0].bottom;
            while (p0) {
                var p1 = p0.cont;//TrackPoint *
                if (p1 && p1.cont === p0) {
                    p0.dupStereo = p1;
                    p1.dupStereo = p0;
                }
                p0 = p0.pn
            }
        }
        me.adjust2time++;
    },
    //void SMS :: //float stretch, float pitch0, float pitch1
    adjust1: function (stretch, pitch0, pitch1) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        var slice = [].zeros(2);// Slice* [2];
        for (var c = 0; c < me.channels; c++) {
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&sliceMutex[c]);
            //#endif
            slice[c] = me.adjust1SliceQueue[c].front();
            me.adjust1SliceQueue[c].pop();
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&sliceMutex[c]);
            //#endif
        }
        if (me.band >= minTrial1Band) {
            //#ifdef MULTITHREADED
            //    for(int c=0; c<channels; c++) {
            //        pthread_mutex_lock(&trial1Mutex[c]);
            //    }
            //#endif
            me.adjustInit(me.trial1RingBuf, me.trial1GrainBuf);
            //#ifdef MULTITHREADED
            //    for(int c=channels-1; c>=0; c--) {
            //        pthread_mutex_unlock(&trial1Mutex[c]);
            //    }
            //#endif
            me.adjust(me.trial1GrainBuf, me.mag0Queue, me.minCutSep1,
                me.mag01, me.dmag0, me.x01, me.adjust1time, slice);
        }
        for (var c = 0; c < me.channels; c++) {
            delete slice[c];
        }

        var h2 = stretch * h1;
        me.h2cum += h2;
        var h2i = lrint(me.h2cum);
        me.h2cum -= h2i;
        for (var c = 0; c < me.channels; c++) {
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&renderMutex[c]);
            //#endif
            me.nRender[c].push(h2i);
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&renderMutex[c]);
            //#endif
        }
        var dupStereoPostponed = [];//list<TrackPoint*> 
        for (var c = 0; c < me.channels; c++) {
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&trackMutex[c]);
            //#endif
            //for(list<Track*>::iterator tt = renderTracks[c].begin(); 
            //    tt != renderTracks[c].end();
            //++tt) {
            var stop = false;
            var renderTracks = me.renderTracks;
            [].interpolate(renderTracks[c].begin(), renderTracks[c].end(), function (tt) {
                if (stop) return;
                var t = (tt);//Track *
                if (me.adjust1time >= t.start) {
                    if (me.adjust1time <= t.last) {
                        var tp = t.updateFPH(me.adjust1time, synthModeOutput, me.h2i,
                            me.pitch0, me.pitch1);//TrackPoint *
                        if (tp) {
                            dupStereoPostponed.push(tp);
                        }
                    }
                } else {
                    stop = true;
                }
            });
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&trackMutex[c]);
            //#endif  
        }
        //for(list<TrackPoint*>::iterator tpi = dupStereoPostponed.begin();
        //    tpi != dupStereoPostponed.end();
        //tpi++) {
        for (var tpi in dupStereoPostponed) {
            var tp = (tpi);//TrackPoint *
            tp.phSynth = U.canon2PI(tp.dupStereo.phSynth + tp.ph - tp.dupStereo.ph);
        }
        me.adjust1time++;
    },
    //int SMS :: //float *dmag, int k0, int maxK
    findCut: function (dmag, k0, maxK) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        var k;
        for (k = Math.max(1, k0) ; k <= maxK; k++) {
            var dd0 = dmag[k + 1] - dmag[k];
            if (dd0 > 0.0) {
                var d02 = U.square(dmag[k + 1] + dmag[k]);
                if (dd0 * U.square(dmag[k] + dmag[k - 1]) > (dmag[k] - dmag[k - 1]) * d02
                   &&
                   dd0 * U.square(dmag[k + 2] + dmag[k + 1]) > (dmag[k + 2] - dmag[k + 1]) * d02) {
                    break;
                }
            }
        }
        return k;
    },

    //    void SMS :: //ArrayRingBuffer<float> **trialRingBuf,    GrainBuf *trialGrainBuf
    adjustInit: function (trialRingBuf, trialGrainBuf) {
        var me = this;
        var n = me.trialRingBuf[0].nReadable();
        for (var c = 1; c < me.channels; c++) {
            n = min(n, me.trialRingBuf[c].nReadable());
        }
        var ndone = 0;
        while (n) {
            var abuf = [].zeros(512);//audio[512]
            var ntodo = Math.min(512, n);
            for (var c = 0; c < me.channels; c++) {
                var fbuf = me.trialRingBuf[c].getReadBuf();
                for (var k = 0; k < ntodo; k++) {
                    abuf[k][c] = fbuf[ndone + k];
                }
            }
            for (var c = me.channels; c < 2; c++) {
                for (var k = 0; k < ntodo; k++) {
                    abuf[k][c] = 0.0;
                }
            }
            me.trialGrainBuf.write(abuf, ntodo);
            ndone += ntodo;
            n -= ntodo;
        }
        for (var c = 0; c < me.channels; c++) {
            me.trialRingBuf[c].advance(ndone);
        }
    },
    //    void SMS ::     
    //GrainBuf *trialGrainBuf,
    //queue<float*> *magQueue,
    //int minCutSep,
    //var **_mag1,
    //var **_dmag1,
    //audio **x1,
    //const TimeType &time,
    //Slice **slices
    adjust: function (trialGrainBuf,
                       magQueue,
                       minCutSep,
                       _mag1,
                       _dmag1,
                       x1,
                       time,
                       slices) {
        var me = this;
        var g = trialGrainBuf.read(trialGrainBuf.readPos);//grain *
        g.analyze();
        for (var c = 0; c < me.channels; c++) {
            var slice = slices[c];//Slice *
            var p = slice.bottom;//TrackPoint *
            if (c === 0) {
                c2even(g.x, x1[0], N);
            } else {
                c2odd(g.x, x1[1], N);
            }
            var mag1 = _mag1[c]///float */missing most float *;
            me.calcmags(mag1, x1[c]);
            //#ifdef MULTITHREADED
            //        pthread_mutex_lock(&magMutex[c]);
            //#endif
            var mag0 = magQueue[c].front();
            magQueue[c].pop();
            //#ifdef MULTITHREADED
            //        pthread_mutex_unlock(&magMutex[c]);
            //#endif
            if (p) {
                var dmag = _dmag1[c];
                var cuts = [];//list<int>
                var k3 = Math.min(me.Nover2, me.maxK + 2);

                dmag[0] = mag1[0];
                for (var k = Math.max(1, minK - 2) ; k < k3; k++) {
                    dmag[k] = mag1[k] - mag1[k - 1];
                }
                var k = minK;
                while (true) {
                    k = me.findCut(dmag, k + 1, me.maxK);
                    if (k >= me.maxK) {
                        break;
                    } else {
                        cuts.push(k);
                    }
                }
                var bDone = false;
                while (!bDone) {
                    bDone = true;
                    //for(list<int>::iterator i = cuts.begin();
                    //    i != cuts.end();
                    //++i) {
                    for (var i in cuts) {
                        var k0 = i;
                        var ibad = cuts.last();//list<int>::iterator 
                        var i2 = i;//list<int>::iterator 
                        ++i2;
                        var maxY = 0.0;
                        for (; i2 != cuts.last() ; ++i2) {
                            var k2 = cuts[i2];//dont know
                            if (k2 - k0 >= minCutSep) break;
                            var y = mag0[k2] * mag1[k2];
                            if (y >= maxY) {
                                maxY = y;
                                ibad = i2;
                            }
                            k0 = k2;
                        }
                        if (ibad != cuts.last()) {
                            if (mag0[cuts[i]] * mag1[cuts[i]] > maxY) {
                                ibad = i;
                            }
                            cuts.splice(ibad, 1);
                            bDone = false;
                            break;
                        }
                    }
                }
                cuts.unshift(minK);
                cuts.push(maxK);
                //list<int>::iterator i = cuts.first();
                var i = 0;
                while (p) {
                    var k0 = i;
                    ++i;
                    if (i == cuts.length) break;
                    var k2 = i;
                    if (p.x > k2) continue;
                    var m0 = 0.0;
                    var m1 = 0.0;
                    for (var k = k0; k <= k2; k++) {
                        m0 += mag0[k];
                        m1 += mag1[k];
                    }
                    var s = (m1 > m0 ? Math.sqrt(m0 / m1) : 1.0);
                    while (p && p.x <= k2) {
                        p.m *= s;
                        p = p.pn;
                    }
                }
            }
            //free(mag0);
        }
        me.trialGrainBuf.advance(1);
    },
    //void SMS :: //int c, list<SBSMSRenderer*> &renderers
    render: function (c, renderers) {
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&renderMutex[c]);
        //#endif
        var me = this;
        var n = me.nRender[c].front();
        me.nRender[c].pop();
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&renderMutex[c]);
        //#endif
        var time = me.synthtime[c];
        //(list<SBSMSRenderer*>::iterator i = renderers.begin(); i != renderers.end(); ++i) {
        [].interpolate(renderers.begin(), renderers.end(), function (i) {
            var renderer = renderers[i];//SBSMSRenderer *
            renderer.startTime(c, time, n);
        });
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&trackMutex[c]);
        //#endif
        //for(list<Track*>::iterator tt = renderTracks[c].begin(); 
        //tt != renderTracks[c].end();) {
        //   var toremove = 
        MEPH.Log('There are probably problems here')
        var stop = false;
        var renderTracks = me.renderTracks;
        var toremove = [];
        [].interpolate(renderTracks[c].begin(), renderTracks[c].end(), function (tt) {
            if (stop) return;
            var t = renderTracks[c][tt];//Track *

            if (t.bEnded && time > t.last) {
                var eraseMe = tt;//list<Track*>::iterator
                ++tt;
                toremove.push(eraseMe);
                //renderTracks[c].splice(eraseMe,1);
                //delete t;
            } else if (time >= t.start) {
                if (time <= t.last) {
                    t.updateM(time, synthModeOutput);
                    //for(list<SBSMSRenderer*>::iterator i = renderers.begin(); i != renderers.end(); ++i) {

                    [].interpolate(renderers.begin(), renderers.end(), function (i) {
                        var renderer = renderers[i];//SBSMSRenderer *
                        renderer.render(c, t);
                    });
                    t.step(time);
                }
                ++tt;
            } else {
                stop = true;
            }
        });
        renderTracks.removeIndices(toremove);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&trackMutex[c]);
        //#endif  
        //  for(list<SBSMSRenderer*>::iterator i = renderers.begin(); i != renderers.end(); ++i) {
        //for(list<SBSMSRenderer*>::iterator i = renderers.begin(); i != renderers.end(); ++i) {
        [].interpolate(renderers.begin(), renderers.end(), function (i) {
            var renderer = renderers[i];//SBSMSRenderer *  
            renderer.endTime(c);
        });
        synthtime[c]++;
    },
    //    TrackPoint *SMS ::    
    //TrackPoint **begin, TrackPoint *tp0, float *minCost2, float maxCost2, float maxDF, float dMCoeff2, float dNCoeff2
    nearestForward: function (begin, tp0, minCost2, maxCost2, maxDF, dMCoeff2, dNCoeff2) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        var minCost2 = TrackPointNoCont;
        var minF = tp0.f - maxDF;
        var maxF = tp0.f + maxDF;
        var maxDF2 = U.square(maxDF);
        while ((begin) && (begin).f < minF) {
            (begin) = (begin).pn;
        }
        var mintp1 = null;//TrackPoint *
        var tp1 = (begin);//TrackPoint *
        while (tp1) {
            if (tp1.bOwned) {
                continue;
            }
            else {
                var df2 = square(tp1.f - tp0.f);
                if (df2 > maxDF2) break;
                var dM2 = dBApprox(tp1.m2, tp0.m2);
                var cost2 = (df2 + dMCoeff2 * dM2);
                if (cost2 > maxCost2) continue;
                if (cost2 < (minCost2)) {
                    (minCost2) = cost2;
                    mintp1 = tp1;
                }
            }
            tp1 = tp1.pn
        }
        return mintp1;
    },
    //TrackPoint *SMS :: 
    //TrackPoint **begin, TrackPoint *tp0, float *minCost2, float maxCost2, float maxDF, float dMCoeff2, float dNCoeff2
    nearestReverse: function (begin, tp0, minCost2, maxCost2, maxDF, dMCoeff2, dNCoeff2) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        var minCost2 = TrackPointNoCont;
        var minF = tp0.f - maxDF;
        var maxF = tp0.f + maxDF;
        var maxDF2 = U.square(maxDF);
        while ((begin) && (begin).f > maxF) {
            (begin) = (begin).pp;
        }
        var mintp1 = null;
        var tp1 = (begin);
        while (tp1) {
            if (tp1.bOwned) {
                continue;
            }
            else {
                var df2 = U.square(tp1.f - tp0.f);
                if (df2 > maxDF2) break;
                var dM2 = dBApprox(tp1.m2, tp0.m2);
                var cost2 = (df2 + dMCoeff2 * dM2);
                if (cost2 > maxCost2) continue;
                if (cost2 < (minCost2)) {
                    (minCost2) = cost2;
                    mintp1 = tp1;
                }
            }
            tp1 = tp1.pp;
        }
        return mintp1;
    },
    //TrackPoint *SMS :: 
    //TrackPoint **begin, TrackPoint *tp0, float *minCost2, float maxCost2, float maxDF, float dMCoeff2, float dNCoeff2
    nearestForward2: function (begin, tp0, minCost2, maxCost2, maxDF, dMCoeff2, dNCoeff2) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        minCost2 = TrackPointNoCont;//References something outsidefunction,need to adjust

        var minF = tp0.f - maxDF;
        var maxF = tp0.f + maxDF;
        var maxDF2 = U.square(maxDF);
        while ((begin) && (begin).f < minF) {
            (begin) = (begin).pn;
        }
        var mintp1 = null;//TrackPoint *
        var tp1 = (begin);//TrackPoint *
        while (tp1) {
            if (!tp1.owner) continue;
            var df2 = U.square(tp1.f - tp0.f);
            if (df2 > maxDF2) break;
            var dM2 = dBApprox(0.25 * tp1.m2, tp0.m2);
            var cost2 = (df2 + dMCoeff2 * dM2);
            if (cost2 > maxCost2) continue;
            if (cost2 < (minCost2)) {
                (minCost2) = cost2;
                mintp1 = tp1;
            }
            tp1 = tp1.pn
        }
        return mintp1;
    },
    //TrackPoint *SMS :: 
    //TrackPoint **begin, TrackPoint *tp0, float *minCost2, float maxCost2, float maxDF, float dMCoeff2, float dNCoeff2
    nearestReverse2: function (begin, tp0, minCost2, maxCost2, maxDF, dMCoeff2, dNCoeff2) {
        var me = this;
        var U = MEPH.audio.sbsms.Util;
        var minCost2 = TrackPointNoCont;
        var minF = tp0.f - maxDF;
        var maxF = tp0.f + maxDF;
        var maxDF2 = U.square(maxDF);
        while ((begin) && (begin).f > maxF) {
            (begin) = (begin).pp;
        }
        var mintp1 = null;//TrackPoint *
        var tp1 = (begin);//TrackPoint *
        while (tp1) {
            if (!tp1.owner) continue;
            var df2 = U.square(tp1.f - tp0.f);
            if (df2 > maxDF2) break;
            var dM2 = dBApprox(tp1.m2, tp0.m2);
            var cost2 = (df2 + dMCoeff2 * dM2);
            if (cost2 > maxCost2) continue;
            if (cost2 < (minCost2)) {
                (minCost2) = cost2;
                mintp1 = tp1;
            }
            tp1 = tp1.pp
        }
        return mintp1;
    },

    //void SMS :: 
    //TrackPoint *tp0, TrackPoint *tp1, int ilo, int c
    connect: function (tp0, tp1, ilo, c) {
        var me = this;
        var time = me.assigntime[c];//TimeType 
        if (tp0.slice.band == tp1.slice.band) {
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&trackMutex[c]);
            //#endif    
            tp0.owner.push(tp1);
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&trackMutex[c]);
            //#endif
        }
        else if (tp0.slice.band < tp1.slice.band) {
            var precursor = tp0.owner;//Track *
            if (ilo === 1) {
                //#ifdef MULTITHREADED
                //        pthread_mutex_lock(&trackMutex[c]);
                //#endif
                precursor.push(tp1);
                precursor.endTrack(true);
                var time = precursor.end / res;//TimeType 
                //#ifdef MULTITHREADED
                //        pthread_mutex_unlock(&trackMutex[c]);
                //#endif
                //#ifdef MULTITHREADED
                //        pthread_mutex_lock(&lo.trackMutex[c]);
                //#endif
                me.lo.createTrack(c, tp1, time, true);
                //#ifdef MULTITHREADED
                //        pthread_mutex_unlock(&lo.trackMutex[c]);
                //#endif
            } else {
                //#ifdef MULTITHREADED
                //        pthread_mutex_lock(&trackMutex[c]);
                //#endif
                var time = precursor.end / res;//TimeType
                precursor.endTrack(true);
                last = precursor.back();//TrackPoint *
                //#ifdef MULTITHREADED
                //        pthread_mutex_unlock(&trackMutex[c]);
                //#endif
                //#ifdef MULTITHREADED
                //        pthread_mutex_lock(&lo.trackMutex[c]);
                //#endif
                var t = lo.createTrack(c, last, time, true);//Track *
                t.push(tp1);
                //#ifdef MULTITHREADED
                //        pthread_mutex_unlock(&lo.trackMutex[c]);
                //#endif
                last.owner = precursor;
            }
        } else {
            var precursor = tp0.owner;//Track *
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&trackMutex[c]);
            //#endif
            precursor.push(tp1);
            precursor.endTrack(true);
            time = precursor.end * me.hi.res;//TimeType 
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&trackMutex[c]);
            //#endif
            //#ifdef MULTITHREADED
            //    pthread_mutex_lock(&hi.trackMutex[c]);
            //#endif
            me.hi.createTrack(c, tp1, time, true);
            //#ifdef MULTITHREADED
            //    pthread_mutex_unlock(&hi.trackMutex[c]);
            //#endif
        }
        tp0.bConnected = true;
        tp1.bConnected = true;
        tp0.bOwned = true;
        tp1.bOwned = true;
        if (tp0.dupcont) {
            dup = tp0.dupcont;//TrackPoint *
            if (!dup.owner) {
                dup.bOwned = true;
                dup.bDelete = true;
            }
        }
        dup2 = tp0.dup[2];//TrackPoint *
        if (dup2 && dup2 != tp1 && !dup2.owner) {
            dup2.bOwned = true;
            dup2.bDelete = true;
        }
        for (var d = 0; d < 3; d++) {
            var dup = tp1.dup[d];//TrackPoint *
            if (dup && !dup.owner && (d < 2 || dup.slice.band < tp1.slice.band)) {
                dup.bOwned = true;
                dup.bDelete = true;
            }
        }
    },
    //void SMS :: long offset, int c
    mark: function (offset, c) {
        var me = this;
        me.$mark(offset, 0, c);
        if (offset & me.resMask) {
            me.$mark(offset, 1, c);
        }
    },

    //void SMS :: long offset, long offsetlo, int c
    $mark: function (offset, offsetlo, c) {
        var me = this;
        var lo = me.lo;
        var res = me.res;

        if (!lo) return;
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&lo.sliceMutex[c]);
        //#endif
        var sliceL1 = lo.sliceBuffer[c].read(lo.sliceBuffer[c].readPos +
            offset / res +
            offsetlo);//Slice *
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&lo.sliceMutex[c]);
        //#endif
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&sliceMutex[c]);
        //#endif
        var sliceM1 = me.sliceBuffer[c].read(me.sliceBuffer[c].readPos + offset);//Slice *
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&sliceMutex[c]);
        //#endif
        var b0 = !(offset & resMask);
        var bDone = false;
        var bLastDitch = false;
        while (!bDone) {
            var nToCont = 0;
            var nCont = 0;
            var rbegin = null;//
            var begin = sliceL1.bottom;//TrackPoint *
            var tp = sliceM1.bottom;//TrackPoint *tp = sliceM1.bottom;
            while (tp) {
                if (tp.bMarked) continue;
                if (tp.f > me.maxFMatchM) {
                    break;
                } else {
                    rbegin = tp;
                }
                var F;

                //refactor
                tp.cont = me.nearestForward(begin, tp, F, me.maxCost2Match, me.maxDFMatch, me.dMCoeff2Match);
                if (tp.cont) nToCont++;
                tp = tp.pn
            }
            if (sliceL1) {
                var tp = sliceL1.top;//TrackPoint *
                while (tp) {
                    if (tp.f < minFLo) break;
                    var F;
                    tp.cont = me.nearestReverse(rbegin, tp, F, maxCost2Match, maxDFMatch, dMCoeff2Match);
                    tp = tp.pp;
                }

            }
            //TrackPoint *tp0 = sliceM1.bottom;
            var tp0 = sliceM1.bottom;
            while (tp0) {
                if (tp0.bMarked) continue;
                if (tp0.f > maxFMatchM) {
                    break;
                }
                //TrackPoint *
                var tp1 = tp0.cont;
                if (tp1) {
                    if (bLastDitch || tp1.cont == tp0) {
                        nCont++;
                        var bAlreadyMarked = false;
                        if (b0) {
                            if (tp1.dup[1] || tp0.dup[1]) {
                                bAlreadyMarked = true;
                            }
                        } else {
                            if (tp1.dup[2 - 2 * offsetlo] || tp0.dup[2 * offsetlo]) {
                                bAlreadyMarked = true;
                            }
                        }
                        if (!bAlreadyMarked) {
                            if (b0) {
                                tp1.dup[1] = tp0;
                                tp0.dup[1] = tp1;
                            } else {
                                tp1.dup[2 - 2 * offsetlo] = tp0;
                                tp0.dup[2 * offsetlo] = tp1;
                            }
                        }
                        tp0.bMarked = true;
                    }
                }
                tp0 = tp0.pn
            }
            bDone = (nToCont == nCont);
            bLastDitch = (!bDone && nCont == 0);
        }
    },
    //void SMS :: long offset, int c
    assignStart: function (offset, c) {
        var me = this;
        me.bAssignDone[c] = false;
        //#ifdef MULTITHREADED
        //pthread_mutex_lock(&sliceMutex[c]);
        //#endif
        me.sliceM0[c] = me.sliceBuffer[c].read(me.sliceBuffer[c].readPos + offset);
        me.sliceM1[c] = me.sliceBuffer[c].read(me.sliceBuffer[c].readPos + offset + 1);
        if (me.res == 2) {
            me.sliceM2[c] = me.sliceBuffer[c].read(me.sliceBuffer[c].readPos + offset + 2);
        } else {
            me.sliceM2[c] = null;
        }
        //#ifdef MULTITHREADED
        //pthread_mutex_unlock(&sliceMutex[c]); 
        //#endif
        //TrackPoint *tp = sliceM0[c].bottom;
        var tp = sliceM0[c].bottom;
        while (tp) {
            if (!tp.owner.bEnded) {
                tp.owner.bEnd = true;
                tp.bConnected = false;
                tp.bOwned = false;
            } else {
                tp.bConnected = true;
                tp.bOwned = true;
            }
            tp = tp.pn;
        }
        //#ifdef MULTITHREADED
        //if(hi) pthread_mutex_lock(&hi.sliceMutex[c]);
        //#endif
        me.sliceH0[c] = me.hi ? me.hi.sliceBuffer[c].read(me.hi.sliceBuffer[c].readPos + (offset + 1) * me.hi.res) : null;
        me.sliceH0[c] = null;
        me.sliceH1[c] = me.hi ? me.hi.sliceBuffer[c].read(me.hi.sliceBuffer[c].readPos + (offset + 1) * me.hi.res) : null;
        //#ifdef MULTITHREADED 
        //if(hi) pthread_mutex_unlock(&hi.sliceMutex[c]);
        //#endif
        //#ifdef MULTITHREADED
        //if(lo) pthread_mutex_lock(&lo.sliceMutex[c]);
        //#endif
        me.sliceL0[c] = me.lo ? me.lo.sliceBuffer[c].read(me.lo.sliceBuffer[c].readPos + offset / me.res + 1) : null;
        me.sliceL0[c] = null;
        me.sliceL1[c] = me.lo ? me.lo.sliceBuffer[c].read(lo.sliceBuffer[c].readPos + offset / me.res + 1) : null;
        //#ifdef MULTITHREADED
        //if(lo) pthread_mutex_unlock(&lo.sliceMutex[c]);
        //#endif
    },
    //void SMS :: long offset, int c
    assignInit: function (offset, c) {
        var me = this;
        //TrackPoint *tp = sliceM1[c].bottom;
        var tp = me.sliceM1[c].bottom;
        while (tp
      ) {
            tp.cont = null;
            tp.contF = TrackPointNoCont;
            tp = tp.pn;
        }
        if (me.sliceM2[c]) {
            //TrackPoint *tp = sliceM2[c].bottom;
            var tp = me.sliceM2[c].bottom;
            while (tp) {
                tp.cont = null;
                tp.contF = TrackPointNoCont;
                tp = tp.pn;
            }
        }
    },
    //void SMS :: //long offset, int c
    assignFind: function (offset, c) {
        var me = this;
        if (me.bAssignDone[c]) return;
        var sliceM0 = this.sliceM0[c];
        //        Slice *
        var sliceM1 = this.sliceM1[c];
        var sliceM2 = this.sliceM2[c];
        var sliceL1 = this.sliceL1[c];
        var sliceH1 = this.sliceH1[c];
        var begin;
        begin = sliceM0.bottom;
        //TrackPoint *tp = sliceM1.bottom;
        var tp = sliceM1.bottom;
        while (tp) {
            if (tp.bOwned) continue;
            var F;
            tp.bConnect = false;
            var minM = nearestForward(begin, tp, F, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);//TrackPoint *
            if (minM && F < tp.contF) {
                tp.cont = minM;
                tp.contF = F;
            }
            tp = tp.pn;
        }
        if (sliceL1) {
            var rbegin = sliceM0.top;//TrackPoint *
            //TrackPoint *tp = sliceL1.top;
            var tp = sliceL1.top;
            while (tp) {
                if (tp.bOwned) continue;
                if (tp.f < me.minFLo) break;
                var F;
                var minL = me.nearestReverse(rbegin, tp, F, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);
                if (minL) {
                    F *= me.localFavorRatio;
                    if (F < tp.contF) {
                        tp.cont = minL;
                        tp.contF = F;
                    }
                }
                tp = tp.pp;
            }
        }
        begin = sliceM0.bottom;
        if (sliceH1) {
            //TrackPoint *tp = sliceH1.bottom;
            var tp = sliceH1.bottom;
            while (tp) {
                if (tp.bOwned) continue;
                if (tp.f > me.maxFHi) break;
                var F;
                //TrackPoint *
                var minH = me.nearestForward(begin, tp, F, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);
                if (minH) {
                    F *= me.localFavorRatio;
                    if (F < tp.contF) {
                        tp.cont = minH;
                        tp.contF = F;
                    }
                }
                tp = tp.pn;
            }
        }
        if (sliceM2 && !(offset & me.resMask)) {
            begin = sliceM1.bottom;
            var tp = sliceM2.bottom;
            while (tp) {
                if (tp.bOwned) continue;
                var F;
                tp.bConnect = false;
                var minM = me.nearestForward(begin, tp, F, me.maxCost2, me.maxDF, me.dMCoeff2);
                if (minM) {
                    tp.cont = minM;
                    tp.contF = F;
                }
                tp = tp.pn;
            }
            if (sliceL1) {
                //TrackPoint *tp = sliceM2.bottom;
                var tp = sliceM2.bottom;
                while (tp) {
                    if (tp.bOwned) continue;
                    if (tp.f > me.maxFMid) break;
                    var F;
                    var rbegin = sliceL1.top;//TrackPoint *
                    var minL = nearestReverse(rbegin, tp, F, me.maxCost2, me.maxDF, me.dMCoeff2);//TrackPoint *
                    if (minL) {
                        F *= me.localFavorRatio;
                        if (F < tp.contF) {
                            tp.cont = minL;
                            tp.contF = F;
                        }
                    }
                    tp = tp.pn;
                }
            }
        }
    },
    //bool SMS :: //long offset, int c, bool bLastDitch
    assignConnect: function (offset, c, bLastDitch) {
        var me = this;
        if (me.bAssignDone[c]) return false;
        var sliceM0 = this.sliceM0[c];
        var sliceM1 = this.sliceM1[c];
        var sliceL1 = this.sliceL1[c];
        var sliceH1 = this.sliceH1[c];
        var nToCont = 0;
        var nCont = 0;
        var b0 = !(offset & me.resMask);
        var ilo;
        if (me.res == 2 && b0) {
            ilo = 0;
        } else {
            ilo = 1;
        }
        //TrackPoint *
        var beginM1 = sliceM1.bottom;
        var beginH1;//TrackPoint *
        if (sliceH1) beginH1 = sliceH1.bottom;
        //TrackPoint *tp = sliceM0.bottom;
        var tp = sliceM0.bottom;
        while (tp) {
            if (tp.bOwned) continue;
            var FM1 = TrackPointNoCont;
            var FL1 = TrackPointNoCont;
            var FH1 = TrackPointNoCont;
            var minM1 = me.nearestForward(beginM1, tp, FM1, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);
            var minL1 = null;
            if (sliceL1 && tp.f < me.maxFMid) {
                var rbeginL1 = sliceL1.top;
                minL1 = me.nearestReverse(rbeginL1, tp, FL1, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);
                FL1 *= me.localFavorRatio;
            }
            var minH1 = null;
            if (sliceH1 && tp.f > me.minFMid) {
                minH1 = me.nearestForward(beginH1, tp, FH1, me.maxCost2, me.maxDF, me.dMCoeff2, me.dNCoeff2);
                FH1 *= localFavorRatio;
            }
            if (minM1 &&
               ((FM1 <= FH1 && FM1 <= FL1)
                || (minL1 && FL1 <= FH1 && FL1 <= FM1 && minL1.dup[ilo] == minM1)
                || (minH1 && FH1 <= FL1 && FH1 <= FM1 && minH1.dup[1] == minM1))) {
                if (ilo == 1 && minL1 && minL1.dup[1] == minM1) {
                    tp.dupcont = minL1;
                } else if (minH1 && minH1.dup[1] == minM1) {
                    tp.dupcont = minH1;
                } else {
                    tp.dupcont = null;
                }
                tp.contF = FM1;
                tp.cont = minM1;
                nToCont++;
            } else if (minL1 && FL1 <= FM1 && FL1 <= FH1) {
                if (minM1 && minL1.dup[ilo] == minM1) {
                    tp.dupcont = minM1;
                } else {
                    tp.dupcont = null;
                }
                tp.contF = FL1;
                tp.cont = minL1;
                nToCont++;
            } else if (minH1 && FH1 <= FM1 && FH1 <= FL1) {
                if (minM1 && minH1.dup[1] == minM1) {
                    tp.dupcont = minM1;
                } else {
                    tp.dupcont = null;
                }
                tp.contF = FH1;
                tp.cont = minH1;
                nToCont++;
            } else {
                tp.cont = null;
            }
            tp = tp.pn;
        }

        //TrackPoint *tp0 = sliceM0.bottom;
        var tp0 = sliceM0.bottom;
        while (tp0) {
            if (tp0.bOwned) continue;
            tp0.bConnect = false;
            var tp1 = tp0.cont;//TrackPoint *
            var time = me.assigntime[c];//TimeType 
            if (tp1 && !tp1.bOwned &&
               (bLastDitch ||
                (tp1.cont == tp0) ||
                ((tp1.cont && tp0.contF <= tp1.cont.contF) &&
                 ((tp1.cont.dup[0] == tp0) ||
                  (tp1.cont.dup[1] == tp0))))) {
                tp1.cont = tp0;
                tp0.bConnect = true;
                tp1.bConnect = true;
            }
            tp0 = tp0.pn
        }
        //TrackPoint *tp0 = sliceM0.bottom;
        var tp0 = sliceM0.bottom;
        while (
            tp0) {
            if (tp0.bOwned) continue;
            var tp1 = tp0.cont;//TrackPoint *
            if (tp0.bConnect && tp1 && !tp1.bOwned && tp1.bConnect && tp1.cont == tp0) {
                var dupcont = tp0.dupcont;//TrackPoint *
                if (dupcont && dupcont.bConnect) {
                    if (!tp1.bConnected && !dupcont.bConnected) {
                        if (!tp0.bConnected && (dupcont.cont == null || tp0.contF <= dupcont.cont.contF)) {
                            nCont++;
                            me.connect(tp0, tp1, ilo, c);
                            tp0.owner.bEnd = false;
                            dupcont.bConnect = false;
                        } else if (dupcont.cont && !dupcont.cont.bConnected) {
                            nCont++;
                            me.connect(dupcont.cont, dupcont, ilo, c);
                            dupcont.cont.owner.bEnd = false;
                            tp1.bConnect = false;
                        }
                    }
                } else if (!tp0.bConnected && !tp1.bConnected) {
                    nCont++;
                    me.connect(tp0, tp1, ilo, c);
                    tp0.owner.bEnd = false;
                }
            }
            tp0 = tp0.pn;
        }
        me.bAssignDone[c] = (nToCont == nCont || bLastDitch);
        return !(me.bAssignDone[c] || nCont == 0);
    },
    //void SMS :: //long offset, int c
    start: function (offset, c) {
        var me = this;
        var renderTracks = me.renderTracks;
        me.started[c].clear();
        me.ended[c].clear();
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&trackMutex[c]);
        //#endif
        //for(list<Track*>::iterator tt = assignTracks[c].begin(); 
        //    tt != assignTracks[c].end(); ) {
        var toremove = [];
        [].interpolate(me.assignTracks[c].begin(), me.assignTracks[c].end(), function (tt) {
            var t = me.assignTracks[c][(tt)];//Track *
            var bKeep;
            var jump = false;
            if (t.bEnded) {
                bKeep = ((!t.bRender) && (t.bStitch || t.size() >= me.minTrackSize));
                if (me.assigntime[c] > t.last) {
                    me.returnTrackIndex(c, t);
                    var eraseMe = tt;
                    toremove.push(eraseMe);
                    // moved: me.assignTracks[c].erase(eraseMe);
                } else {
                    ++tt;
                }
            } else if (t.bEnd) {
                bKeep = (t.bStitch || t.size() >= me.minTrackSize);
                if (bKeep) {
                    bKeep = !t.bRender;
                    t.endTrack(false);
                    ended[c].push_back(t.back());
                    ++tt;
                } else {
                    //list<Track*>::iterator eraseMe = tt;
                    //++tt;
                    toremove.push(eraseMe);
                    //assignTracks[c].erase(eraseMe);
                    me.returnTrackIndex(c, t);
                    t.absorb();
                    delete t;
                    jump = true;
                }
            } else {
                bKeep = ((!t.bRender) && (t.bStitch || t.size() >= me.minTrackSize));
                ++tt;
            }
            if (!jump)
                if (bKeep) {
                    var tt0 = renderTracks[c].rbegin();
                    while (tt0 != renderTracks[c].rend()) {
                        var t0 = renderTracks[c][tt0];
                        if (t.start >= t0.start) {
                            break;
                        }
                        tt0++;
                    }
                    renderTracks[c].insert(tt0.base(), t);
                    t.bRender = true;
                }
        });

        me.assignTracks[c].removeIndices(toremove);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&trackMutex[c]);
        //#endif
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&sliceMutex[c]);
        //#endif
        var sliceM0 = sliceBuffer[c].read(sliceBuffer[c].readPos + offset);//Slice *
        me.adjust2SliceQueue[c].push(sliceM0);
        me.adjust1SliceQueue[c].push(sliceM0);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&sliceMutex[c]); 
        //#endif
        //TrackPoint *tp = sliceM0.bottom;
        var tp = sliceM0.bottom;
        while (tp) {
            var tpn = tp.pn;
            if (tp.bOwned) {
                if (tp.bDelete) {
                    tp.destroy();
                }
            } else {
                var t = me.createTrack(c, tp, me.assigntime[c], false);
                me.started[c].push(tp);
                for (var d = 0; d < 2; d++) {
                    var dup = tp.dup[d];//TrackPoint  *
                    if (dup && !dup.owner) {
                        dup.destroy();
                    }
                }
            }
            tp = tpn;
        }
        me.assigntime[c]++;
    },
    //void SMS :: //int c
    splitMerge: function (c) {
        var me = this;
        var time = me.assigntime[c] - 1;
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&trackMutex[c]);
        //#endif
        var sliceM0 = this.sliceM0[c];
        var sliceL0 = this.sliceL0[c];
        var sliceH0 = this.sliceH0[c];
        var sliceM1 = this.sliceM1[c];
        var sliceL1 = this.sliceL1[c];
        var sliceH1 = this.sliceH1[c];
        var rbeginL0 = sliceL0 ? sliceL0.top : null;
        var beginM0 = sliceM0.bottom;
        var beginH0 = sliceH0 ? sliceH0.bottom : null;
        //for(list<TrackPoint*>::iterator i = started[c].begin();
        //    i != started[c].end();
        //++i) {
        [].interpolate(started[c].begin(), started[c].end(), function (i) {
            var tp = started[c][i];
            var F, FL, FH;
            tp.cont = me.nearestForward2(beginM0, tp, F, me.maxCost2SplitMerge,
                me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            var minL = me.nearestReverse2(rbeginL0, tp, FL, me.maxCost2SplitMerge, me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            if (minL) {
                FL *= me.localFavorRatio;
                if (FL < F) {
                    tp.cont = minL;
                    F = FL;
                }
            }
            var minH = me.nearestForward2(beginH0, tp, FH, me.maxCost2SplitMerge, me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            if (minH) {
                FH *= me.localFavorRatio;
                if (FH < F) {
                    tp.cont = minH;
                }
            }
            if (tp.cont) {
                tp.owner.point.insert(tp.owner.point.begin(), tp.cont);
                tp.owner.first--;
                tp.owner.bStitch = true;
                tp.bSplit = true;
                tp.cont.bSplit = true;
                tp.owner.bSplit = true;
                tp.cont.refCount++;
                tp.cont.owner.bStitch = true;
            }
        });

        var rbeginL1 = sliceL1 ? sliceL1.top : null;
        var beginM1 = sliceM1.bottom;
        var beginH1 = sliceH1 ? sliceH1.bottom : null;
        //for(list<TrackPoint*>::iterator i = ended[c].begin();
        //    i != ended[c].end();
        //++i) {
        [].interpolate(me.ended[c].begin(), me.ended[c].end(), function (i) {
            var tp = me.ended[c][i];
            var F, FL, FH;
            tp.cont = me.nearestForward2(beginM1, tp, F, me.maxCost2SplitMerge, me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            var minL = me.nearestReverse2(rbeginL1, tp, FL, me.maxCost2SplitMerge, me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            if (minL) {
                FL *= me.localFavorRatio;
                if (FL < F) {
                    tp.cont = minL;
                    F = FL;
                }
            }
            var minH = me.nearestForward2(beginH1, tp, FH, me.maxCost2SplitMerge, me.maxDFSplitMerge, me.dMCoeff2SplitMerge);
            if (minH) {
                FH *= me.localFavorRatio;
                if (FH < F) {
                    tp.cont = minH;
                }
            }
            if (tp.cont) {
                tp.owner.point.insert(tp.owner.point.end(), tp.cont);
                tp.owner.last++;
                tp.owner.bStitch = true;
                tp.bMerge = true;
                tp.cont.bMerge = true;
                tp.owner.bMerge = true;
                tp.cont.refCount++;
                tp.cont.owner.bStitch = true;
            }
        });
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&trackMutex[c]);
        //#endif
    },
    //void SMS :: int c
    advance: function (c) {
        var me = this;
        //#ifdef MULTITHREADED
        //    pthread_mutex_lock(&sliceMutex[c]);
        //#endif
        me.sliceBuffer[c].advance(1);
        //#ifdef MULTITHREADED
        //    pthread_mutex_unlock(&sliceMutex[c]);
        //#endif
    },
    //void SMS :: //grain *g0, grain *g1, grain *g2, int c
    add: function (g0, g1, g2, c) {
        var me = this;
        if (c == 0) {
            if (me.band >= minTrial1Band) {
                c2even(g0.x, me.x00[0], me.N);
            }
            if (me.band >= minTrial2Band) {
                c2even(g1.x, me.x10[0], me.N);
            }
            c2even(g2.x, me.x2[0], me.N);
        } else {
            if (me.band >= minTrial1Band) {
                c2odd(g0.x, me.x00[1], me.N);
            }
            if (me.band >= minTrial2Band) {
                c2odd(g1.x, me.x10[1], me.N);
            }
            c2odd(g2.x, me.x2[1], me.N);
        }

        var mag0;
        if (me.band >= minTrial1Band) {
            mag0 = [].zeros(me.Nover2 + 1);//(float*)malloc((Nover2+1)*sizeof(float));
            me.calcmags(mag0, x00[c]);
        }
        var mag1;
        if (me.band >= minTrial2Band) {
            mag1 = [].zeros(me.Nover2 + 1);//(float*)malloc((Nover2+1)*sizeof(float));
            me.calcmags(mag1, x10[c]);
        }
        var mag2sum = [].zeroes(1024);
        //memset(mag2sum,0,1024*sizeof(float));

        var mag2 = this.mag2[c];
        me.calcmags(mag2sum, g2.x);
        me.calcmags(mag2sum, me.x2[c]);
        me.calcmags(mag2, me.x2[c]);
        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&magMutex[c]);
        //#endif
        if (me.band >= minTrial1Band) me.mag0Queue[c].push(mag0);
        if (me.band >= minTrial2Band) me.mag1Queue[c].push(mag1);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&magMutex[c]);
        //#endif
        var magmax = mag2[0];
        for (var k = 1; k <= me.kEnd; k++) {
            if (magmax < mag2[k]) magmax = mag2[k];
        }
        var peakmin = magmax * me.peakThresh;

        var xt2 = 1.0;
        var bTroughN1 = false;
        var bTroughN2 = false;
        var x0 = 1.0;
        var y0 = mag2[1];
        var x1 = 0.0;
        var y1 = 0.0;
        var kEnd = me.kEnd;
        var bX0 = !me.lo;
        var bX1 = false;
        var prev = null;//TrackPoint *

        var slice = new Slice(me.band, me.addtime[c]);//Slice *

        for (var k = 1; k <= me.kEnd; k++) {
            if (mag2[k] > peakmin && mag2[k] > mag2[k - 1] && mag2[k] >= mag2[k + 1]) {
                if (k < me.kLo) {
                    x0 = me.findExtremum(mag2, mag2, k, y0);
                    bX0 = true;
                } else if (k > kHi) {
                    if (!bX1) {
                        x1 = me.findExtremum(mag2, mag2, k, y1);
                        if (prev) {
                            prev.x01 = x1;
                            prev.y01 = y1;
                        }
                        bX1 = true;
                    }
                } else {
                    var p = new TrackPoint(slice, me.peak2N, me.x2[c], mag2, mag2, k, me.N, me.band);//TrackPoint *

                    if (prev) {
                        prev.pn = p;
                        p.pp = prev;
                    } else {
                        slice.bottom = p;
                    }
                    slice.top = p;
                    prev = p;
                    p.xtn2 = me.maxK;
                    bTroughN1 = true;
                    bTroughN2 = true;
                    p.xtp2 = xt2;
                    p.x01 = x0;
                    p.y01 = y0;
                }
            } else if (mag2[k] <= mag2[k - 1] && mag2[k] <= mag2[k + 1]) {
                xt2 = me.findExtremum(mag2, mag2, k, NULL);
                xt2 = Math.max(1.0, xt2);
                xt2 = Math.min(kEnd, xt2);
                if (bTroughN2) {
                    prev.xtn2 = xt2;
                    bTroughN2 = false;
                }
            }
        }
        if (bTroughN2) {
            prev.xtn2 = kEnd;
        }
        if (!bX1 && !hi) {
            x1 = kEnd;
            y1 = mag2[kEnd];
            bX1 = true;
        }
        var dec2 = this.dec2[c];//float *
        // memset(dec2,0,(Nover2+1)*sizeof);
        if (bX0 && prev) {
            var k1 = lrintf(x0);
            var ko1 = k1 > x0 ? -1 : 1;
            var kf1 = k1 > x0 ? k1 - x0 : x0 - k1;
            var k3 = Math.min(kEnd, k1 + me.peakWidth2);
            for (var k = lrintf(slice.bottom.xtp2) ; k <= k3; k++) {
                var m = me.interp2(k - k1, ko1, kf1);
                dec2[k] += m * y0;
            }
        }
        if (bX1 && prev) {
            var k1 = lrintf(x1);
            var ko1 = k1 > x1 ? -1 : 1;
            var kf1 = k1 > x1 ? k1 - x1 : x1 - k1;
            var k3 = lrintf(slice.top.xtn2);
            for (var k = Math.max(0, k1 - me.peakWidth2) ; k <= k3; k++) {
                var m = me.interp2(k - k1, ko1, kf1);
                dec2[k] += m * y1;
            }
        }
        //TrackPoint *p = slice.bottom;
        var p = slice.bottom;
        while (p) {
            var k1 = lrintf(p.x);
            var ko1 = k1 > p.x ? -1 : 1;
            var kf1 = k1 > p.x ? k1 - p.x : p.x - k1;
            var k0 = lrintf(p.xtp2);
            var kf0 = (k0 > p.xtp2 ? k0 - p.xtp2 : p.xtp2 - k0);
            var k2 = lrintf(p.xtn2);
            var kf2 = (k2 > p.xtn2 ? k2 - p.xtn2 : p.xtn2 - k2);
            var m2 = 0.0;
            if (k0 < p.xtp2) {
                m2 += (mag2[k0] + mag2[k0 + 1]) * 0.5 * (1.0 - kf0) + 0.5 * mag2[k0 + 1];
                var i = Math.floor(k0 - k1);
                var m = me.interp2(i, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k0]) * 0.5 * (1.0 + kf0);
                m2 += m;
                dec2[k0] += m;
                m = me.interp2(i + 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k0 + 1]) * 0.5 * kf0;
                m2 += m;
                dec2[k0 + 1] += m;
                m = me.interp2(i - 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k0 - 1]);
                m2 += m;
                dec2[k0 - 1] += m;
            } else {
                m2 += (mag2[k0] + mag2[k0 - 1]) * 0.5 * kf0 + 0.5 * mag2[k0] + mag2[k0 + 1];
                var i = Math.floor(k0 - k1);
                var m = me.interp2(i, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k0]) * 0.5 * (1.0 - kf0);
                m2 += m;
                dec2[k0] += m;
                m = me.interp2(i - 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k0 - 1]) * 0.5 * (2.0 - kf0);
                m2 += m;
                dec2[k0 - 1] += m;
            }
            if (k2 < p.xtn2) {
                m2 += mag2[k2 - 1] + 0.5 * mag2[k2] + 0.5 * kf2 * (mag2[k2] + mag2[k2 + 1]);
                var i = Math.floor(k2 - k1);
                var m = me.interp2(i, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k2]) * 0.5 * (1.0 - kf2);
                m2 += m;
                dec2[k2] += m;
                m = me.interp2(i + 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k2 + 1]) * 0.5 * (2.0 - kf2);
                m2 += m;
                dec2[k2 + 1] += m;
            } else {
                m2 += (mag2[k2 - 1] + mag2[k2]) * (1.0 - kf2) * 0.5 + 0.5 * mag2[k2 - 1];
                var i = Math.floor(k2 - k1);
                var m = me.interp2(i, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k2]) * 0.5 * (1.0 + kf2);
                m2 += m;
                dec2[k2] += m;
                m = me.interp2(i - 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k2 - 1]) * 0.5 * kf2;
                m2 += m;
                dec2[k2 - 1] += m;
                m = me.interp2(i + 1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k2 + 1]);
                m2 += m;
                dec2[k2 + 1] += m;
            }
            for (var k = k0 + 2; k < k2 - 1; k++) {
                m2 += mag2[k];
            }
            if (k0 + 1 == k2 - 1) {
                m2 -= mag2[k0 + 1];
            }
            for (var k = max(0, k1 - me.peakWidth2) ; k < k0 - 1; k++) {
                var m = me.interp2(k - k1, ko1, kf1) * p.y;
                m = Math.min(m, mag2[k]);
                m2 += m;
                dec2[k] += m;
            }
            var k3 = Math.floor(min(kEnd, k1 + me.peakWidth2));
            for (var k = k2 + 2; k <= k3; k++) {
                var m = me.interp2(k - k1, ko1, kf1) * p.y;
                m = min(m, mag2[k]);
                m2 += m;
                dec2[k] += m;
            }

            p.m2 = m2;
            p = p.pn
        }
        var m2max = 0.0;
        //TrackPoint *p = slice.bottom;
        var p = slice.bottom;
        while (p) {
            var k1 = lrintf(p.x);
            var ko1 = Math.floor(k1 > p.x ? -1 : 1);
            var kf1 = k1 > p.x ? k1 - p.x : p.x - k1;
            var k0 = lrintf(p.xtp2);
            var kf0 = (k0 > p.xtp2 ? k0 - p.xtp2 : p.xtp2 - k0);
            var k2 = lrintf(p.xtn2);
            var kf2 = (k2 > p.xtn2 ? k2 - p.xtn2 : p.xtn2 - k2);
            var mdec = 0.0;
            if (k0 < p.xtp2) {
                mdec += (dec2[k0] + dec2[k0 + 1]) * 0.5 * (1.0 - kf0) + 0.5 * dec2[k0 + 1];
            } else {
                mdec += (dec2[k0] + dec2[k0 - 1]) * 0.5 * kf0 + 0.5 * dec2[k0] + dec2[k0 + 1];
            }
            if (k2 < p.xtn2) {
                mdec += dec2[k2 - 1] + 0.5 * dec2[k2] + 0.5 * kf2 * (dec2[k2] + dec2[k2 + 1]);
            } else {
                mdec += (dec2[k2 - 1] + dec2[k2]) * (1.0 - kf2) * 0.5 + 0.5 * dec2[k2 - 1];
            }
            for (var k = k0 + 2; k < k2 - 1; k++) {
                mdec += dec2[k];
            }
            if (k0 + 1 == k2 - 1) {
                mdec -= dec2[k0 + 1];
            }

            p.m2 -= mdec;
            p.m2 *= mNorm;
            if (p.m2 > m2max) {
                m2max = p.m2;
            }
            p = p.pn;
        }

        var m2min = m2max * peakThresh;
        //TrackPoint *p = slice.bottom;
        var p = slice.bottom;
        while (p) {
            var pn = p.pn;//TrackPoint *
            if (p.m2 < m2min) {
                if (p.m2 < 0) { p.m2 = 0; }
                p.absorb();
                delete p;
            }
            p = pn;
        }

        //#ifdef MULTITHREADED
        //        pthread_mutex_lock(&sliceMutex[c]);
        //#endif
        me.sliceBuffer[c].write(slice);
        //#ifdef MULTITHREADED
        //        pthread_mutex_unlock(&sliceMutex[c]);
        //#endif
        me.addtime[c]++;
    },
    //    void SMS ::     //audio *buf, long n
    prepad1: function (buf, n) {
        var me = this;
        if (me.band >= minTrial2Band) {
            me.trial2GrainBuf.write(buf, n);
        }
    },
    ///audio *buf, long n
    prepad0: function (buf, n) {
        var me = this;
        if (me.band >= minTrial1Band) {
            me.trial1GrainBuf.write(buf, n);
        }
    },

    getTrial2Latency: function () {
        var me = this;
        return me.minTrackSize;
    },

    //Track *SMS :: 
    //int c, TrackPoint *tp, const TimeType &time, bool bStitch
    createTrack:function(c, tp, time, bStitch) 
    {
        var index;//TrackIndexType
        if(me.trackIndex[c].empty()) {
            index = trackIndexNone;
        } else {
            index = me.trackIndex[c].front();
            me.trackIndex[c].pop();
        }
        var t = new Track(me.h1,index,tp,time,bStitch);//Track *t 
        me.assignTracks[c].push_back(t);
        return t;
    },
    //void SMS :: //int c, Track *t
    returnTrackIndex:function( c,  t)
    {var me= this;
        if(t.index != trackIndexNone) {
            me.   trackIndex[c].push(t.index);
            t.index = trackIndexNone;
        }
    },
    //float SMS :: //int k, int ko, float kf
    interp2:function( k,  ko,  kf) {
        var me= this;
        return (1.0-kf)*me.peak2N[k] + kf*me.peak2N[k+ko];
    },
    //float SMS :: /float *mag, float *mag2, int k, float *y
    findExtremum:function( mag,  mag2,  k,  y)
    {
        var y0 = mag[k-1];
        var y1 = mag[k];
        var y2 = mag[k+1];
        var d = (y0 + y2 - y1 - y1);
        var x = (d==0.0?k:k + 0.5 * (y0 - y2) / d);
        if(y) {
            var ki = lrintf(x);
            var kf = ki<x?x-ki:ki-x;
            var ki1 = Math.floor(ki<k?ki+1:ki-1);
            y = ((1.0 -kf)*mag2[ki] + kf*mag2[ki1]);//output:
        }
        return x;
    },
    //void SMS :: float *mag, audio *x
    calcmags:function(mag, x) {
        var me= this;
        var U = MEPH.audio.sbsms.Util;
        for(var k=0;k<=me.Nover2;k++) {
            mag[k] = U.norm2(x[k]);
        }
    }

}).then(function () {
window.minTrial2Band = 1;
window.minTrial1Band = 2;
})