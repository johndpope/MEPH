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

    it('can create a flat  addition expression, from a tree', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function () {
            var addition = Expression.addition(Expression.variable('a'),
                                                Expression.addition(Expression.variable('b'),
                                                                    Expression.variable('c')));
            var flattenedAddition = Expression.Flatten(addition, 'addition');

            expect(flattenedAddition.parts.length === 3).theTruth('wrong number of parts ');
        }).catch(function (e) {
            expect(e).caught();
        }).then(function (x) {
            done();
        });
    });

    it('can create all the possible associative groupings for an expression', function (done) {
        MEPH.requires('MEPH.math.Expression').then(function () {
            var addition = Expression.addition(Expression.variable('a'), Expression.variable('b'), Expression.variable('c'));

            var groupings = Expression.createAssociativeGroupings(addition);
            expect(groupings).toBeTruthy();
        }).catch(function (e) {
            expect(e).caught();
        }).then(done);
    });
});