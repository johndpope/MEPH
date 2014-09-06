/**
 * @class MEPH.math.expression.Evaluator
 * Evaulates mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.expression.Evaluator', {
    statics: {
        /**
         * Evaluate an expression.
         * @param {MEPH.math.Expression}
         * @return {MEPH.math.Expression}
         **/
        evaluate: function (expression) {
            var Evaluator = MEPH.math.expression.Evaluator;
            switch (expression.type) {
                case Expression.type.addition:
                    return Evaluator.evalAddition(expression);
                case Expression.type.subtraction:
                    return Evaluator.evalSubtraction(expression);
                case Expression.type.division:
                    return Evaluator.evalDivision(expression);
                case Expression.type.multiplication:
                    return Evaluator.evalMultiplication(expression);
                default:
                    throw new Error('unhandled case');
            }
        },
        evalMultiplication: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var Evaluator = MEPH.math.expression.Evaluator;
            var multiplyNums = function (exps) {
                return exps.summation(function (x, t, i) {
                    if (i === 0) {
                        return Factor.getNumerical(x.val);
                    }
                    return t * Factor.getNumerical(x.val);
                });
            }
            if (Evaluator.allNumbers(expression)) {
                var result = multiplyNums(expression.getParts());
                return Expression.variable(result);
            }

            var numerparts = expression.getParts().where(function (x) {
                return Factor.isNumerical(x.val);
            });
            var notnumbers = expression.getParts().where(function (x) {
                return !Factor.isNumerical(x.val);
            });

            var numexp = Expression.variable(multiplyNums(numerparts));
            return Expression.multiplication.apply(this, [numexp].concat(notnumbers));

        },
        /**
         * Evaluates a division expression.
         * @param {MEPH.math.Expression} expression
         * @return {MEPH.math.Expression}s
         **/
        evalDivision: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var Evaluator = MEPH.math.expression.Evaluator;
            var divideNums = function (exps) {
                return exps.summation(function (x, t, i) {
                    if (i === 0) {
                        return Factor.getNumerical(x.val);
                    }
                    return t / Factor.getNumerical(x.val);
                });
            }
            if (Evaluator.allNumbers(expression)) {
                var result = divideNums(expression.getParts());
                return Expression.variable(result);
            }
            else {
                var index = expression.getParts().indexWhere(function (x) {
                    return !Factor.isNumerical(x.val);
                }).first();
                if (index !== null) {
                    var numerparts = expression.getParts().subset(0, index);
                    var numexp = Expression.variable(divideNums(numerparts));
                    var therest = expression.getParts().subset(index);
                    return Expression.division.apply(this, [numexp].concat(therest));
                }
                else {
                    return expression;
                }
            }
        },
        /**
         * Evalues an addition expression.
         * @param {MEPH.math.Expression}
         * @return {MEPH.math.Expression}
         **/
        evalAddition: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var Evaluator = MEPH.math.expression.Evaluator;
            if (Evaluator.allNumbers(expression)) {
                var result = expression.getParts().summation(function (x, t) {
                    return Factor.getNumerical(x.val) + t;
                });
                return Expression.variable(result);
            }
            else {
                var copied = expression.copy();
                var number = copied.getParts().where(function (x) {
                    return typeof (Factor.getNumerical(x.val)) === 'number';
                }).summation(function (x, t) {
                    return Factor.getNumerical(x.val) + t;
                });
                var notnumbers = copied.getParts().where(function (x) {
                    return typeof (Factor.getNumerical(x.val)) !== 'number';
                }).select(function (x) { return x.val; });
                return Expression.addition.apply(this, [Expression.variable(number)].concat(notnumbers));
            }
        },
        /**
         * Evalues an subtraction expression.
         * @param {MEPH.math.Expression} expression
         * @reurn {MEPH.math.Expression}
         **/
        evalSubtraction: function (expression) {
            var Evaluator = MEPH.math.expression.Evaluator;
            var Factor = MEPH.math.expression.Factor;
            if (Evaluator.allNumbers(expression)) {
                var result = expression.getParts().summation(function (x, t, i) {
                    if (i === 0) {
                        return Factor.getNumerical(x.val) + t;
                    }
                    else
                        return t - Factor.getNumerical(x.val);
                });
                return Expression.variable(result);
            }
            else {
                var copied = expression.copy(),
                    numberfirst;

                var number = copied.getParts().where(function (x, index) {
                    x.index = index;
                    return typeof (Factor.getNumerical(x.val)) === 'number';
                }).summation(function (x, t, i) {
                    if (x.index === 0) {
                        numberfirst = true;
                        return Factor.getNumerical(x.val) + t
                    }
                    else
                        return -Factor.getNumerical(x.val) + t;
                });

                var notnumbers = copied.getParts().where(function (x) {
                    return typeof (Factor.getNumerical(x.val)) !== 'number';
                });

                if (numberfirst) {
                    return Expression.subtraction.apply(this, [Expression.variable(number)].concat(notnumbers));
                }
                else {
                    var first = notnumbers.first(function (x) { return x.index === 0; });
                    var start = number ? [first] : [first, number];
                    return Expression.subtraction.apply(this, start.concat(notnumbers.where(function (x) {
                        return x !== first;
                    }).select(function (x) { return x.val; })));
                }
            }
        },
        /**
         * All the parts of the expression are numerical.
         * @param {MEPH.math.Expression}
         * @return {Boolean}
         */
        allNumbers: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            return expression.getParts().all(function (x) {
                return typeof (Factor.getNumerical(x.val)) === 'number';
            })
        }
    }
});