describe("MEPH/math/Expression.spec.js", 'MEPH.math.Expression', function () {
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

    it('when anything is matched, it can be more than one things matching the anything.', function () {
        // MultiplyIntegralofFx
        var rule = Expression.Rules.IntegralConstMultiply();

        var c = Expression.variable('A');
        var t = Expression.variable('x');
        var y = Expression.variable('x');

        var expression = Expression.integral(Expression.multiplication(c, t, y), 'x');

        expect(Expression.matchRule(expression, rule)).toBeTruthy();
    });

    it('when anything is matched, it can be more than one things matching the anything.', function () {
        // MultiplyIntegralofFx
        var rule = Expression.Rules.IntegralConstMultiply();

        var c = Expression.variable('c');
        var t = Expression.variable('t');
        var y = Expression.variable('y');

        var expression = Expression.integral(Expression.multiplication(c, t, y), 'x');

        expect(!Expression.matchRule(expression, rule)).toBeTruthy();
    });

    it('a dependency can describe a relation from a child to a parent using upTo:[type of function]', function () {
        var c = Expression.variable('A');
        var a = Expression.anything();
        var expression = Expression.integral(Expression.multiplication(c, a), 'x');

        var res = Expression.select(c, { offset: 'up:.integral' });
        expect(expression === res).toBeTruthy();
    });


    it('can translate with more than the expect parts.', function () {
        var Expression = MEPH.math.Expression;

        var rule1 = Expression.Rules.IntegralConstMultiply();
        var rule2 = Expression.Rules.MultiplyIntegralofFx();

        var expression = Expression.integral(
                            Expression.multiplication(
                                Expression.variable('a'),
                                Expression.variable('b'),
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
        
        expect(result.getMarks().A.parts.length === 2).toBeTruthy();

    });
});