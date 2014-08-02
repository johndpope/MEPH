describe("MEPH/math/Expression.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('an expression can be created', function (done) {

        MEPH.requires('MEPH.math.Expression').then(function ($class) {

            var expression = new MEPH.math.Expression();

            expect(expression).theTruth('a quaternion was not created');

        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represent a variable ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.variable('a');
            var latexp = expression.latex();
            expect(latexp === 'a').toBeTruthy();

        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represent an integration function', function (done) {

        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(Expression.variable('f(x)'), 'x', Expression.variable('a'), Expression.variable('b'));
            var latexp = '\\int_a^b \\! f(x) \\, \\mathrm{d}x.';
            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });
});