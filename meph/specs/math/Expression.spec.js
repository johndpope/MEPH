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

    it('represent an integration without start an end', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(Expression.variable('f(x)'), 'x');
            var latexp = '\\int_ \\! f(x) \\, \\mathrm{d}x.';
            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represents an addition', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.addition(Expression.variable('f(x)'), Expression.variable('x'));
            var latexp = 'f(x) + x';
            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represents an addition with multiple parts', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.addition(Expression.variable('f(x)'),
                Expression.variable('x'),
                Expression.variable('x'),
                Expression.variable('b'),
                Expression.variable('a'),
                Expression.variable('y'));
            var latexp = 'f(x) + x + x + b + a + y';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represents an substitute with subtraction parts', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.subtraction(Expression.variable('f(x)'),
                Expression.variable('x'),
                Expression.variable('x'),
                Expression.variable('b'),
                Expression.variable('a'),
                Expression.variable('y'));
            var latexp = 'f(x) - x - x - b - a - y';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represents an substitute with division parts', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.division(Expression.variable('f(x)'),
                Expression.variable('x'),
                Expression.variable('x'),
                Expression.variable('b'),
                Expression.variable('a'),
                Expression.variable('y'));
            var latexp = 'f(x) / x / x / b / a / y';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('represents an substitute with multiplication parts, if two variables are the same', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.multiplication(Expression.variable('f(x)'),
                Expression.variable('x'),
                Expression.variable('x'),
                Expression.variable('b'),
                Expression.variable('a'),
                Expression.variable('y'));
            var latexp = 'f(x)xxbay';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('represents an substitute with multiplication parts, if two variables are the same', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.multiplication(
                Expression.variable('x'),
                Expression.variable('b'),
                Expression.variable('a'),
                Expression.variable('y'));
            var latexp = 'xbay';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('requires parenthesis ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;

            expect(Expression.requiresParenthesis(Expression.type.addition)).toBeTruthy();
            expect(Expression.requiresParenthesis(Expression.type.subtraction)).toBeTruthy();
            expect(Expression.requiresParenthesis(Expression.type.multiplication)).toBeTruthy();
            expect(Expression.requiresParenthesis(Expression.type.division)).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('expression power ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.power(Expression.variable('f(x)'), Expression.variable('y'));
            var latexp = 'f(x)^y';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression fraction ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.fraction(Expression.variable('f(x)'), Expression.variable('y'));
            var latexp = '\\frac{f(x)}{y}';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression fraction continuous', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.fraction(Expression.variable('f(x)'),
                Expression.variable('f(x)'),
                Expression.variable('f(x)'),
                Expression.variable('f(x)'),
                Expression.variable('y'));
            var latexp = '\\begin{equation}' +
                        ' \\cfrac{f(x)}{' +
                        ' \\cfrac{f(x)}{' +
                        ' \\cfrac{f(x)}{' +
                        ' \\cfrac{f(x)}{y}}}}' +
                        ' \\end{equation}';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression cos', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.cos(Expression.theta());
            var latexp = '\\cos (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression sin', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.sin(Expression.theta());
            var latexp = '\\sin (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression tan', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.tan(Expression.theta());
            var latexp = '\\tan (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('expression csc', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.csc(Expression.theta());
            var latexp = '\\csc (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression sec', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.sec(Expression.theta());
            var latexp = '\\sec (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression cot', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.cot(Expression.theta());
            var latexp = '\\cot (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression sin^2', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.sin(Expression.theta(), 2);
            var latexp = '\\sin^2 (\\theta)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression mod', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.mod(Expression.theta(), Expression.variable('f'));
            var latexp = '\\theta \\bmod f';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });



    it('expression limit', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.limit(Expression.variable('f(x)'), Expression.variable('a'), Expression.variable('b'));
            var latexp = '\\lim_{a \\to b} f(x)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression is the same form as', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.sec(Expression.variable('a'));
            var exp2 = Expression.sec(Expression.variable('b'));

            expect(expression.equals(exp2)).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('expression is equal to sin2 θ + cos2 θ === sin2 f(x) + cos2 f(x)  ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.addition(Expression.sin('theta', 2), Expression.cos('theta', 2));
            var exp2 = Expression.addition(Expression.sin(Expression.variable('y'), 2), Expression.cos(Expression.variable('x'), 2));

            expect(expression.equals(exp2)).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('expression is equal to sin2 θ + cos2 θ + cos2 θ !== sin2 f(x) + cos2 f(x)  ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.addition(Expression.sin('theta', 2), Expression.cos('theta', 2), Expression.cos('theta', 2));
            var exp2 = Expression.addition(Expression.sin(Expression.variable('y'), 2), Expression.cos(Expression.variable('x'), 2));

            expect(expression.equals(exp2)).toBeFalsy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('expression function', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.func('f', 'x');

            var latexp = 'f(x)';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('expression plusorminus', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.plusminus(Expression.variable('a'), Expression.variable('b'));
            var latexp = 'a \\pm b';

            expect(latexp === expression.latex()).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can detect  Integration(a)dx = ax + c ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(Expression.variable('a'), 'x');

            var results = Expression.getMatch(expression);
            var exp2 = Expression.addition(
                        Expression.multiplication(
                            Expression.variable('a'),
                            Expression.variable('x')),
                        Expression.variable('c'));
            expect(results.length).toBe(1);
            var r = results.some(function (x) {
                return x.equals(exp2);
            });
            expect(r).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });


    it('can detect Integration(ax)dx = ax + c ', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(Expression.multiplication(
                                                    Expression.variable('a'),
                                                    Expression.variable('x')),
                                'x');

            var results = Expression.getMatch(expression);
            var exp2 = Expression.addition(
                        Expression.multiplication(
                            Expression.variable('a'),
                            Expression.variable('x')),
                        Expression.variable('c'));
            expect(results.length).toBe(0);
            var r = results.some(function (x) {
                return x.equals(exp2);
            });
            expect(r).toBeFalsy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });

    xit('can detect Integration(af(x)) dx = a integrate(f(x))', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function ($class) {
            var Expression = MEPH.math.Expression;
            var expression = Expression.integral(Expression.multiplication(Expression.variable('a'),
                Expression.func('f', 'x')), 'x');

            var results = Expression.getMatch(expression);
            var exp2 = Expression.multiplication(
                            Expression.variable('a'),
                            Expression.integral(
                                Expression.func('f', 'x'),
                                'x'
                            )
                       );
            var r = results.some(function (x) {
                return x.equals(exp2);
            });
            expect(r).toBeTruthy();
        }).catch(function () {
            expect(new Error('something went wrong while creating an expression')).caught();
        }).then(function (x) {
            done();
        });
    });
});