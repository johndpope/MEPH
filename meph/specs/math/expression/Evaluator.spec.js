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
        expect(result.parts.length === 1).toBeTruthy();
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
        expect(result.parts.length === 1).toBeTruthy();
        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 5 of Derivative rules', function () {
        var d = Expression.derivative(Expression.multiplication('x', 'x', 'x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.parts.length === 3).toBeTruthy();
        expect(result.type === Expression.type.addition).toBeTruthy();
    });

    it('can evaluate a single variable in a derivative', function () {
        var d = Expression.derivative(Expression.variable('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result === 1).toBeTruthy();
    });

    it('can evaluate a quotient rule , derivative of general formula 7 of derivative rules', function () {
        var d = Expression.derivative(Expression.division(Expression.multiplication(2, 'x'), Expression.multiplication(4, 'x')), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evaluate the power rule , derivative of general formula 10 of derivative rules', function () {
        var d = Expression.derivative(Expression.power(Expression.variable('x'), 10), 1, null, 'x');

        var result = Evaluator.evaluate(d);
        expect("10x^{9}" === result.latex()).toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });

    it('can evaluate the power rule , derivative of general formula 10 of derivative rules', function () {
        var d = Expression.derivative(Expression.power(Expression.power(Expression.variable('x'), 2), 4), 1, null, 'x');

        var result = Evaluator.evaluate(d);
        expect("4x^{2}^{3}2x^{1}" === result.latex()).toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });



    it('can translate with more than the expect parts.', function () {
        var Expression = MEPH.math.Expression;

        var rule1 = Expression.Rules.Integration.IntegralConstMultiply();
        var rule2 = Expression.Rules.Integration.MultiplyIntegralofFx();

        var expression = Expression.integral(
                            Expression.multiplication(
                                Expression.variable('a'),
                                Expression.variable('b'),
                                Expression.addition(
                                    Expression.variable('x'),
                                    Expression.variable('x')
                                )),
                        'x');


        var result = Evaluator.evaluate(expression);

        expect(result).toBeTruthy();

    });

    it('can evaluate a derivative of general formula 12 of derivative rules', function () {
        var d = Expression.derivative(Expression.e('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.e).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 13 of derivatives rules', function () {
        var d = Expression.derivative(Expression.power('a', 'x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.latex() === 'a^{x}\\ln a').toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 14 of derivative rules', function () {
        var d = Expression.derivative(Expression.ln(Expression.abs(Expression.variable('x'))), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evaluate an absolute value expression', function () {
        var d = Expression.abs('-4');

        var result = Evaluator.evaluate(d);

        expect(result === 4).toBeTruthy();
    });

    it('can evalute a log a x => ', function () {
        var d = Expression.log(Expression.variable('10'), Expression.variable('10'));

        var result = Evaluator.evaluate(d);

        expect(result === 1).toBeTruthy();

    });

    it('can evaluate a derivative of general formula 15 of derivative rules', function () {
        var d = Expression.derivative(Expression.log(Expression.variable('x'), Expression.variable('a')), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evaluate a derivative of general formula 17 of derivative rules', function () {
        var d = Expression.derivative(Expression.sin('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.cos).toBeTruthy();
    });

    it('can evalute a derivative of general formula 18 of derivative rules ', function () {
        var d = Expression.derivative(Expression.cos('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.latex() === '-1\\cos (x)').toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalute a derivative of general formula 19 of derivative rules ', function () {
        var d = Expression.derivative(Expression.tan('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.power).toBeTruthy();
    });

    it('can evalutate a derivative of general formula 20 of derivative rules ', function () {
        var d = Expression.derivative(Expression.cot('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 21 of derivative rules ', function () {
        var d = Expression.derivative(Expression.csc('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 22 of derivative rules ', function () {
        var d = Expression.derivative(Expression.sec('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 23 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.sin('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula23a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 24 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.cos('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula24a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evalutate a derivative of general formula 25 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.tan('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula25a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evalutate a derivative of general formula 26 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.cot('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula26a;
                });
            }
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 27 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.csc('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula27a;
                });
            }
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 28 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.sec('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula28a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();

    });


    it('can evalutate a derivative of general formula 29 of derivative rules ', function () {
        var d = Expression.derivative(Expression.sinh('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula29a;
                });
            }
        });

        expect(result.type === Expression.type.cosh).toBeTruthy();

    });

    it('can evalutate a derivative of general formula 30 of derivative rules ', function () {
        var d = Expression.derivative(Expression.cosh('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula30a;
                });
            }
        });

        expect(result.type === Expression.type.sinh).toBeTruthy();

    });

    it('can evalutate a derivative of general formula 31 of derivative rules ', function () {
        var d = Expression.derivative(Expression.tanh('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula31a;
                });
            }
        });

        expect(result.type === Expression.type.sech).toBeTruthy();

    });

    it('can evalutate a derivative of general formula 32 of derivative rules ', function () {
        var d = Expression.derivative(Expression.coth('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });

    it('can evalutate a derivative of general formula 33 of derivative rules ', function () {
        var d = Expression.derivative(Expression.csch('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });

    it('can evalutate a derivative of general formula 34 of derivative rules ', function () {
        var d = Expression.derivative(Expression.sech('x'), 1, null, 'x');

        var result = Evaluator.evaluate(d);

        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });



    it('can evalutate a derivative of general formula 35 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.sinh('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula35a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evalutate a derivative of general formula 36 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.cosh('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula36a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 37 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.tanh('x'), -1), 1, null, 'x');
        var called;
        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    called = true;
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula37a;
                });
            }
        });
        expect(called).toBeTruthy();
        expect(result.type === Expression.type.division).toBeTruthy();
    });

    it('can evalutate a derivative of general formula 38 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.coth('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula38a;
                });
            }
        });

        expect(result.type === Expression.type.division).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 39 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.csch('x'), -1), 1, null, 'x');

        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula39a;
                });
            }
        });

        expect(result.type === Expression.type.multiplication).toBeTruthy();
    });


    it('can evalutate a derivative of general formula 40 of derivative rules ', function () {
        var d = Expression.derivative(Expression.power(Expression.sech('x'), -1), 1, null, 'x');
        var called;
        var result = Evaluator.evaluate(d, {
            strategy: function (rules) {
                return rules.where(function (x) {
                    called = true;
                    return x.rule.name() === Expression.RuleType.Derivation.GeneralFormula40a;
                });
            }
        });
        expect(called).toBeTruthy();
        expect(result.type === Expression.type.multiplication).toBeTruthy();

    });

});
