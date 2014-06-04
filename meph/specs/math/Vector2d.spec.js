describe("MEPH/math/Vector2d.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('a vector can be created', function (done) {
        MEPH.requires('MEPH.math.Vector2d').then(function () {
            var vector = new MEPH.math.Vector2d();
            expect(vector).theTruth('a list was not created');
        }).catch(function () {
            expect(new Error('something went wrong while creating a list')).caught();
        }).then(function (x) {
            done();
        });
    });
});