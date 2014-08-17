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
            return printExpressionToScreen(result);
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

});