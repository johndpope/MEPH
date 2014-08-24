describe("MEPH/math/Util.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('a factorial can be calculated.', function (done) {
        MEPH.requires('MEPH.math.Util').then(function () {
            var vector = MEPH.math.Util.factorial(3);
            expect(vector === 6).theTruth('the factorial was incorrect.');
        }).catch(function (e) {
            expect(new Error(e)).caught();
        }).then(function (x) {
            done();
        });
    });

});