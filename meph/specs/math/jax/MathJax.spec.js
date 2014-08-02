describe("MEPH/math/jax/MathJax.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('MathJax can load its requirements', function (done) {
        MEPH.requires('MEPH.math.jax.MathJax').then(function () {
            return MEPHJax.ready().then(function () {
                expect(true).toBeTruthy();
            });
        }).catch(function () {
            expect(new Error('something went wrong with setting up MEPHJax')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('MathJax can load J_\alpha(x)', function (done) {
        var dom = document.createElement('div');
        document.body.appendChild(dom);
        MEPH.requires('MEPH.math.jax.MathJax').then(function () {
            return MEPHJax.ready().then(function () {
                return MEPHJax.load('x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.', dom)
                    .then(function (success) {
                        expect(success).toBeTruthy();
                    });
            });
        }).catch(function () {
            expect(new Error('something went wrong with loading mathml')).caught();
        }).then(function (x) {
            done();
        });
    });
});