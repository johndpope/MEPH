describe("MEPH/math/Expression.spec.js", function () {
    beforeEach(function () {
        jasmine.addMatchers(MEPH.customMatchers);
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
    it('match rule Integration(a*f(x)) dx === Integration(a (g(x) + f(x)) dx, and marks the expression, then' +
        'translate a Integration(a (g(x) + f(x)) dx => a * Integration((g(x) + f(x)) dx ', function (done) {
            MEPH.requires('MEPH.math.Expression').then(function ($class) {
                var Expression = MEPH.math.Expression;
                var rule1 = Expression.Rules.IntegralConstMultiply();
                var rule2 = Expression.Rules.MultiplyIntegralofFx();

                var expression = Expression.integral(
                                    Expression.multiplication(
                                        Expression.variable('a'),
                                        Expression.addition(
                                            Expression.func('g', 'x'),
                                            Expression.func('f', 'x')
                                        )),
                                'x');

                var rule = Expression.matchRule(expression, rule1, true);

                var transformation = {
                    transformation: {
                        from: Expression.RuleType.IntegralConstMultiply,
                        to: Expression.RuleType.MultiplyIntegralofFx
                    },
                    C: 'C',
                    A: 'A'
                };
                var rule = Expression.matchRule(expression, Expression.Rules.IntegralConstMultiply(), true);
                var result = Expression.translation.Transform(transformation, expression, rule2);
                expect(result).toBeTruthy();

            }).catch(function () {
                expect(new Error('something went wrong while creating an expression')).caught();
            }).then(function (x) {
                done();
            });
        });
    it('can translate integralConstMultiply ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;

            var rule1 = Expression.Rules.IntegralConstMultiply();
            var rule2 = Expression.Rules.MultiplyIntegralofFx();

            var expression = Expression.integral(
                                Expression.multiplication(
                                    Expression.variable('a'),
                                    Expression.addition(
                                        Expression.func('g', 'x'),
                                        Expression.func('f', 'x')
                                    )),
                            'x');
            expression.name(Expression.Rules.IntegralConstMultiply().name());
            var rule = Expression.matchRule(expression, rule1, true);
            var result = Expression.translation.Translate(expression, rule2);
            var matches = Expression.matchRule(result, rule2);
            expect(matches).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('translate a Power => PowerIntegrate ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.Rules.IntegrationAddition();
            var rule1 = Expression.Rules.Power();
            var rule2 = Expression.Rules.PowerIntegrate();

            var transformation = {
                transformation: {
                    from: Expression.RuleType.PowerIntegrate,
                    to: Expression.RuleType.Power
                },
                n_pre: 'n',
                n_post: 'n',
                x: 'x'
            };
            var result = Expression.translation.Transform(transformation, rule1, rule2);
            console.log(result.latex());

            expect(result).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });
    it('can translate Power.', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;

            var rule1 = Expression.Rules.Power();
            var rule2 = Expression.Rules.PowerIntegrate();

            rule1.swap('n', Expression.variable('t'));

            rule1.name(Expression.Rules.Power().name());

            var result = Expression.translation.Translate(rule1, rule2);
            var matches = Expression.matchRule(result, rule2);
            expect(matches).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });



    it('get the repeating parts of int(u +/- v +/- w) -> u,v,w', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(
                            Expression.addition(Expression.func('f', 'x'),
                                Expression.func('g', 'x'),
                                Expression.func('h', 'x')), 'x');
            var rule = Expression.matchRule(expression, Expression.Rules.IntegrationAddition(), true);

            var parts = expression.getMark('A').getRepeatParts();
            expect(parts.length).toBe(3);
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('match int(u +/- v +/- w) -> int(u) +/- int(v) +/- int(w)', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(
                            Expression.addition(Expression.func('f', 'x'),
                                Expression.func('g', 'x'),
                                Expression.func('h', 'x')), Expression.variable('x'));
            var rule2 = Expression.Rules.AdditionIntegral();
            var rule = Expression.matchRule(expression, Expression.Rules.IntegrationAddition(), true);
            expect(expression.getMarks().dx).toBeTruthy();
            var transformation = {
                repeat: {
                    A: {
                        target: 'A',

                        trans: {
                            transformation: {
                                from: Expression.RuleType.IntegrationAddition,
                                to: Expression.RuleType.AdditionIntegral
                            },
                            f: 'f'
                        }
                    },
                    dx: {
                        scatter: {
                            transformation: {
                                from: Expression.RuleType.IntegrationAddition,
                                to: Expression.RuleType.AdditionIntegral
                            },
                            dx: 'dx'
                        }
                    }
                },
                transform: {
                    from: 'A',
                    to: 'A'
                }
            };
            var result = Expression.translation.Transform(transformation, expression, rule2);
            console.log(result.latex());
            expect(result.getMarks().A.parts.length === 3).toBeTruthy();
            expect(result).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('match int(u +/- v +/- w) -> int(u) +/- int(v) +/- int(w)', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(
                            Expression.addition(Expression.func('f', 't'),
                                Expression.func('g', 'y'),
                                Expression.func('h', 'x')), Expression.variable('x'));
            var rule2 = Expression.Rules.AdditionIntegral();

            var rule = Expression.matchRule(expression, Expression.Rules.IntegrationAddition(), true);
            expect(expression.getMarks().dx).toBeTruthy();
            var result = Expression.translation.Translate(expression, rule2);
            console.log(result.latex());
            expect(result.getMarks().A.parts.length === 3).toBeTruthy();
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });



    it(' do Integration By Parts ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.IntegrationByParts();
            var rule2 = Expression.Rules.IntegrationByPartsComplete();
            var transformation = {
                transformation: {
                    from: Expression.RuleType.IntegraionByPartsComplete,
                    to: Expression.RuleType.IntegrationByParts
                },
                v_2: 'dv',
                v_1: 'dv',
                u_1: 'du',
                u_2: 'du'
            };

            var result = Expression.translation.Transform(transformation, rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it(' translateIntegrationByParts ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.IntegrationByParts();
            var rule2 = Expression.Rules.IntegrationByPartsComplete();

            var result = Expression.translation.Translate(rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });



    it(' OneOverX -> NaturalLogAbsX ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.OneOverX();
            var rule2 = Expression.Rules.NaturalLogAbsX();
            var transformation = {
                transformation: {
                    from: Expression.RuleType.OneOverX,
                    to: Expression.RuleType.NaturalLogAbsX
                },
                x: 'x'
            };

            var result = Expression.translation.Transform(transformation, rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it(' OneOverX -> NaturalLogAbsX ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.OneOverX();
            var rule2 = Expression.Rules.NaturalLogAbsX();
            var transformation = {
                transformation: {
                    from: Expression.RuleType.OneOverX,
                    to: Expression.RuleType.NaturalLogAbsX
                },
                x: 'x'
            };

            var result = Expression.translation.Transform(transformation, rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it(' Translate OneOverX -> NaturalLogAbsX ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.OneOverX();
            var rule2 = Expression.Rules.NaturalLogAbsX();

            var result = Expression.translation.Translate(rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it(' Translate GeneralFormula8A -> GeneralFormula8B ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.GeneralFormula8A();
            var rule2 = Expression.Rules.GeneralFormula8B();

            var result = Expression.translation.Translate(rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it(' Translate GeneralFormula9A -> GeneralFormula9B ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.GeneralFormula9A();
            var rule2 = Expression.Rules.GeneralFormula9B();

            var result = Expression.translation.Translate(rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
            return printExpressionToScreen(result);
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });


    it(' Translate GeneralFormula9B  -> GeneralFormula9A', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.GeneralFormula9A();
            var rule2 = Expression.Rules.GeneralFormula9B();

            var result = Expression.translation.Translate(rule2, rule1);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('TrigonometricFormula10A -> TrigonometricFormula10B', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.TrigonometricFormula10A();
            var rule2 = Expression.Rules.TrigonometricFormula10B();

            var result = Expression.translation.Translate(rule2, rule1);

            console.log(result.latex());
            expect(result).toBeTruthy();
            return printExpressionToScreen(result);
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('TrigonometricFormula11A -> TrigonometricFormula11B', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.TrigonometricFormula11A();
            var rule2 = Expression.Rules.TrigonometricFormula11B();

            var result = Expression.translation.Translate(rule1, rule2);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('TrigonometricFormula11B -> TrigonometricFormula11A ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var rule1 = Expression.Rules.TrigonometricFormula11A();
            var rule2 = Expression.Rules.TrigonometricFormula11B();

            var result = Expression.translation.Translate(rule2, rule1);

            console.log(result.latex());
            expect(result).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });
});