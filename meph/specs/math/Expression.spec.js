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
});