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

    it('a selection of prime numbers can be computed up to a val', function (done) {
        MEPH.requires('MEPH.math.Util').then(function () {
            
            var primes = MEPH.math.Util.primes(10);
            
            expect(primes.length === 4).theTruth('the number of primes was incorrect.');
        }).catch(function (e) {
            expect(new Error(e)).caught();
        }).then(function (x) {
            done();
        });
    });



    it('a selection of prime numbers can be computed up to a val', function (done) {
        MEPH.requires('MEPH.math.Util').then(function () {
            
            var primes = MEPH.math.Util.primes(100);

            expect(primes.length === 25).theTruth('the number of primes was incorrect.');
        }).catch(function (e) {
            expect(new Error(e)).caught();
        }).then(function (x) {
            done();
        });
    });

});