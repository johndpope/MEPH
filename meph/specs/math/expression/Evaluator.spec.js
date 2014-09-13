describe("MEPH/math/expression/Evaluator.spec.js", 'MEPH.math.expression.Evaluator', 'MEPH.math.Expression', 'MEPH.math.expression.Factor', function () {
    var Evaluator;
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
        Evaluator = MEPH.math.expression.Evaluator;
    });

    var printExpressionToScreen = function (result) {
        return MEPH.requires('MEPH.math.jax.MathJax', 'MEPH.math.Expression').then(function () {
            return MEPHJax.ready().then(function () {
                var dom = document.createElement('div');
                document.body.appendChild(dom);
                return MEPHJax.load(result.latex(), dom)
            });
        })
    };

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

    it('can evaluate a integral of a constant:general formula 1 of Integration rules', function () {
        var integral = Expression.integral(Expression.variable('f'), Expression.variable('x'));

        var result = Evaluator.evaluate(integral);
        console.log(integral.latex() + ' => ' + result.latex());
        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate an integral of general formula 2 of Integration rules.', function () {
        var integral = Expression.integral(Expression.multiplication('a', 'x'), 'x');
        var result = Evaluator.evaluate(integral);
        console.log(result.latex());

        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });

    it('can evaluate a fraction', function () {
        var fraction = Expression.fraction(4, 2);
        var result = Evaluator.evaluate(fraction);

        expect(result.value() === 2).toBeTruthy();
    });


    it('can evaluate a fraction', function () {
        var fraction = Expression.fraction(2, 3);
        var result = Evaluator.evaluate(fraction);

        expect(result.getParts().first().val.value() === 2).toBeTruthy();
    });

    it('can evaluate an integral of general formula 3 of Integration rules ', function () {
        var integral = Expression.integral(Expression.power(Expression.variable('x'), Expression.variable(3)), 'x');

        var result = Evaluator.evaluate(integral);
        console.log(result.latex());

        expect(result.type === Expression.type.addition).toBeTruthy();
    });


    it('can evaluate an integral of general formula 4 of Inetegration rules', function () {
        var integral = Expression.integral(Expression.addition('a', 'b', 'c'), 'x');

        var result = Evaluator.evaluate(integral);
        console.log(result.latex());

        expect(result.type === Expression.type.addition).toBeTruthy();
    });


    it('can evaluate an integral of general formula 4 of Inetegration rules', function () {
        var integral = Expression.integral(Expression.addition('5', '0', '2'), 'x');

        var result = Evaluator.evaluate(integral);
        console.log(result.latex());

        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 1 of Derivative rules', function () {
        var derivative = Expression.derivative(Expression.variable('a'), 1, null, 'x');

        var result = Evaluator.evaluate(derivative);

        expect(result === 0).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 1 of Derivative rules', function () {
        var derivative = Expression.derivative(Expression.multiplication(
            Expression.variable('a'), Expression.variable('b')), 1, null, 'x');

        var result = Evaluator.evaluate(derivative);

        expect(result === 0).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 2 of Derivative rules', function () {
        var derivative = Expression.derivative(
            Expression.multiplication(Expression.variable('c'), Expression.variable('x'))
            , 1, null, 'x');

        var result = Evaluator.evaluate(derivative, {
            strategy: function (rules) {
                return rules.where(function (x) { return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula2a; });
            }
        });

        expect(result === 'c').toBeTruthy();

    });

    it('can evaluate a derivative of general formula 2 of Derivative rules', function () {
        var derivative = Expression.derivative(
            Expression.multiplication(Expression.variable('d'), Expression.variable('c'), Expression.variable('x'))
            , 1, null, 'x');

        var result = Evaluator.evaluate(derivative, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula2a;
                });
            }
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });

    it('can evaluate a derivative of general formula 3 of Derivative rules', function () {
        var d = Expression.derivative(Expression.multiplication(Expression.variable('c')
            , Expression.multiplication('d', 'x', 'f')), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                if (rules.length === 2) {
                    return [rules.first()]
                }
                return rules.where(function (x) { return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula3a; });
            }
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 4 of Derivative rules', function () {
        var d = Expression.derivative(Expression.addition('x', 'x'), 1, null, 'x');
        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return [rules.first(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula4a;
                })];
            }
        });
        expect(result.parts.length === 2).toBeTruthy();
        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 4 of Derivative rules', function () {
        var d = Expression.derivative(Expression.addition('x', 'x', 'x'), 1, null, 'x');
        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return [rules.first(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula4a;
                })];
            }
        });
        expect(result.parts.length === 3).toBeTruthy();
        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 5 of Derivative rules', function () {
        var d = Expression.derivative(Expression.multiplication('x', 'x', 'x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.parts.length === 3).toBeTruthy();
        expect(result.type === Expression.type.addition).toBeTruthy();
    });
});