describe("MEPH/math/expression/Factor.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('an expression can be created', function (done) {

        MEPH.requires('MEPH.math.expression.Factor').then(function ($class) {

            var factor = new MEPH.math.expression.Factor();

            expect(factor).theTruth('a factor was not created');

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can get factors of a "variable" ', function (done) {

        MEPH.requires('MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {

            var variable = Expression.variable('x');
            var factors = MEPH.math.expression.Factor.getFactors(variable);
            expect(factors).toBeTruthy();
            expect(factors.length === 1).toBeTruthy();
            expect(factors.first().exp.equals(Expression.variable('x'))).toBeTruthy();
            expect(factors.first().count === 1).toBeTruthy();

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can get factors of a "power" x^2 ', function (done) {

        MEPH.requires('MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {

            var power = Expression.power(Expression.variable('x'), Expression.variable('2'));
            var factors = MEPH.math.expression.Factor.getFactors(power);
            expect(factors).toBeTruthy();
            expect(factors.length === 1).toBeTruthy();
            expect(factors.first().exp.type === Expression.type.variable).toBeTruthy();
            expect(factors.first().count === 2).toBeTruthy();

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can get factors of a "power" (x^2)^2 ', function (done) {

        MEPH.requires('MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {

            var power = Expression.power(Expression.power(Expression.variable('x'), Expression.variable('2')), Expression.variable('2'));
            var factors = MEPH.math.expression.Factor.getFactors(power);
            expect(factors).toBeTruthy();
            expect(factors.length === 1).toBeTruthy();
            expect(factors.first().exp.type === Expression.type.variable).toBeTruthy();
            expect(factors.first().count === 4).toBeTruthy();

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can get factors of a "power" x^a ', function (done) {

        MEPH.requires('MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {

            var power = Expression.power(Expression.variable('x'), Expression.variable('a'));
            var factors = MEPH.math.expression.Factor.getFactors(power);
            expect(factors).toBeTruthy();
            expect(factors.length === 1).toBeTruthy();
            expect(factors.first().exp.type === Expression.type.variable).toBeTruthy();
            expect(factors.first().count === 'a').toBeTruthy();

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

});