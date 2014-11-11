﻿describe("MEPH/audio/music/theory/Notes.spec.js", 'MEPH.audio.music.theory.Notes', function () {
    var Notes;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        Notes = MEPH.audio.music.theory.Notes;
    });

    it('can create an nodes', function () {
        var audio = new MEPH.audio.music.theory.Notes();

        expect(audio).toBeTruthy();
    });

    it('can create an createScaleLib', function () {
        var lib = new MEPH.audio.music.theory.Notes.createScaleLib();

        expect(lib).toBeTruthy();
        expect(lib.length).toBeTruthy();
    });

    it('can get metric ', function () {
        var lib = MEPH.audio.music.theory.Notes.getMetric('+7');

        expect(lib).toBe(12);
    })

    it('has a not library ', function () {
        var lib = MEPH.audio.music.theory.Notes.library;

        expect(lib).toBeTruthy();
    });
    it('can get key', function () {

        var key = Notes.getKey(10, Notes.sharp);
        expect(key).toBe('A' + Notes.sharp);
    });

    it('has signature points ', function () {
        var sig = Notes.signaturePoints;
        expect(sig).toBeTruthy();
    })
});