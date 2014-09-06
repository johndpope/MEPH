describe("MEPH/math/expression/Evaluator.spec.js", 'MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor', function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
    });

    it('can evaluate an addition = Expression.addition(1, 2)', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(1, 2);
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.variable).toBeTruthy();
            expect(result.partOrDefault(Expression.type.variable) === 3).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can evaluate an addition = Expression.addition(1, 2 , Expression.variable(3))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(1, 2, Expression.variable(3));
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.variable).toBeTruthy();
            expect(result.partOrDefault(Expression.type.variable) === 6).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate an addition = Expression.addition(Expression.variable(3), Expression.variable(3), Expression.variable(3))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(Expression.variable(3), Expression.variable(3), Expression.variable(3));
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.variable).toBeTruthy();
            expect(result.partOrDefault(Expression.type.variable) === 9).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can evaluate an addition = Expression.addition(Expression.variable(3), Expression.variable(a))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(Expression.variable(3), Expression.variable('a'));
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.addition).toBeTruthy();
            expect(result.getParts().length === 2).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate an addition = Expression.addition(Expression.variable(3), Expression.variable(3), Expression.variable(a))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(Expression.variable(3), Expression.variable(3), Expression.variable('a'));
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.addition).toBeTruthy();
            expect(result.getParts().length === 2).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can evaluate an addition = Expression.addition(Expression.variable(3), Expression.variable(a), Expression.variable(3), Expression.variable(a))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var additionExp = Expression.addition(Expression.variable(3), Expression.variable('a'), Expression.variable(3), Expression.variable('a'));
            var result = MEPH.math.expression.Evaluator.evaluate(additionExp);

            expect(result.type === Expression.type.addition).toBeTruthy();
            expect(result.getParts().length === 3).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can evaluate an subtraction = Expression.subtraction(Expression.variable(3), Expression.variable(2))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var subtractionExp = Expression.subtraction(Expression.variable(3), Expression.variable(2));
            var result = MEPH.math.expression.Evaluator.evaluate(subtractionExp);
            expect(result.type === Expression.type.variable).toBeTruthy();
            expect(result.getParts().length === 1).toBeTruthy();
            expect(result.partOrDefault(Expression.type.variable) === 1).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate an subtraction = Expression.subtraction(Expression.variable(3), Expression.variable(2), Expression.variable(2))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var subtractionExp = Expression.subtraction(Expression.variable(3), Expression.variable(2), Expression.variable(2));
            var result = MEPH.math.expression.Evaluator.evaluate(subtractionExp);
            expect(result.type === Expression.type.variable).toBeTruthy();
            expect(result.getParts().length === 1).toBeTruthy();
            expect(result.partOrDefault(Expression.type.variable) === -1).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate an subtraction = Expression.subtraction(Expression.variable(3), Expression.variable(a))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var subtractionExp = Expression.subtraction(Expression.variable(3), Expression.variable('a'));
            var result = MEPH.math.expression.Evaluator.evaluate(subtractionExp);


            expect(result.type === Expression.type.subtraction).toBeTruthy();
            expect(result.getParts().length === 2).toBeTruthy();

        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate an subtraction = Expression.subtraction(Expression.variable(3), Expression.variable(a), Expression.variable(a), Expression.variable(3))', function (done) {
        MEPH.requires('MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor').then(function ($class) {
            var subtractionExp = Expression.subtraction(Expression.variable(3), Expression.variable('a'), Expression.variable(3), Expression.variable('a'));
            var result = MEPH.math.expression.Evaluator.evaluate(subtractionExp);


            expect(result.type === Expression.type.subtraction).toBeTruthy();
            expect(result.getParts().length === 3).toBeTruthy();
            expect(result.getParts().first().val.partOrDefault(Expression.type.variable) === 0).toBeTruthy()
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can evaluate a division = Expression.division(Expression.variable(9),Expression.variable(3))', function () {
        var division = Expression.division(Expression.variable(9), Expression.variable(3));
        var result = MEPH.math.expression.Evaluator.evaluate(division);
        expect(result.partOrDefault(Expression.type.variable) === 3).toBeTruthy();
        expect(result.type === Expression.type.variable).toBeTruthy();
    });


    it('can evaluate a division = Expression.division(Expression.variable(9),Expression.variable(3),Expression.variable(a),Expression.variable(b))', function () {
        var division = Expression.division(Expression.variable(9), Expression.variable(3), Expression.variable('a'), Expression.variable('b'));
        var result = MEPH.math.expression.Evaluator.evaluate(division);
        expect(result.parts.length === 3).toBeTruthy();
        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evaluate a multiplication = 4*5*3', function () {
        var multiplication = Expression.multiplication(4, 5, 3);
        var result = MEPH.math.expression.Evaluator.evaluate(multiplication);

        expect(result.partOrDefault(Expression.type.variable).val === 60);
    });

    it('can evaluate a multiplication = 4*a*3', function () {
        var multiplication = Expression.multiplication(4, 'a', 3);
        var result = MEPH.math.expression.Evaluator.evaluate(multiplication);
        expect(result.parts.length === 2).toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });
});