describe("MEPH/audio/AudioResources.spec.js", 'MEPH.audio.AudioResources', function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can create an audioresources', function () {
        var audioresources = new MEPH.audio.AudioResources();

        expect(audioresources).toBeTruthy();
    });

    it('can collect audioresources from the audio objects', function () {
        var audioresources = new MEPH.audio.AudioResources();
        MEPH.publish(MEPH.audio.Audio.CHANGED_BUFFER_SOURCE, null, [{}]);
        expect(audioresources.getResources()).toBeTruthy();
        expect(audioresources.getResources().length).toBe(1);
    })
});