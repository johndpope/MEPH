describe("MEPH/audio/music/theory/Scales.spec.js", 'MEPH.audio.music.theory.Scales', function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create an scales', function () {
        var audio = new MEPH.audio.music.theory.Scales();

        expect(audio).toBeTruthy();
    });

    it('has majorscale static property', function () {
        var audio = MEPH.audio.music.theory.Scales.scales.majorscale;

        expect(audio).toBeTruthy();
    });

    it('can get the chorddata', function () {
        var data = MEPH.audio.music.theory.Scales.getChordData();
        expect(data).toBeTruthy();
    })

    it('can get the voices', function () {
        var data = MEPH.audio.music.theory.Scales.getVoices();
        expect(data).toBeTruthy();
    })

    it('can create a bosslist', function () {
        var data = MEPH.audio.music.theory.Scales.bossList();

        expect(data).toBeTruthy();
    })

    it('can init scales', function () {
        var data = MEPH.audio.music.theory.Scales.init();

        expect(data).toBeTruthy();
    })

    it('can get scale by id ', function () {
        var data = MEPH.audio.music.theory.Scales.init();
        var scale = MEPH.audio.music.theory.Scales.getScaleById(384);
        expect(scale.name).toBe("augmented 0");
    })
});