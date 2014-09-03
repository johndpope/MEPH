/**
 * @class MEPH.math.Expression
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.expression.Factor', {
    statics: {
        /**
         * Gets factors from the expression.
         * @param {MEPH.math.Expression} expression
         * @return {Array}
         **/
        getFactors: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            switch (expression.type) {
                case Expression.type.variable:
                    return Factor.getVariableFactors(expression);
                case Expression.type.power:
                    return Factor.getPowerFactors(expression);
                case Expression.type.multiplication:
                    return Factor.getMultiplicationFactors(expression);
            }
        },
        /**
         * Removes factors from an expression
         * @param {MEPH.math.Expression} expression
         * @param {Array} of factors
         * @return {MEPH.math.Expression}
         ***/
        removeFactors: function (expression, factors) {
            var Factor = MEPH.math.expression.Factor;
            var $factors = factors.select(function (x) { return x.copy(); })

            $factors.foreach(function (factor) {
                if (factor.count) {
                    var toremove = expression.getParts().where(function (part) {
                        return Factor.getExp(part.val).equals(factor.exp, { exact: true });
                    });

                    toremove.foreach(function (part) {
                        var count = Factor.getCount(part.val);
                        if (isNaN(factor.count) || isNaN(count)) {
                            throw new Error('unhandled exception: requires expression addition/subtraction logic');
                        } else
                            factor.count -= count;
                        expression.remove(part.val);
                    });
                }
            });
            if (expression.parts.length === 1) {
                switch (expression.type) {
                    case Expression.type.multiplication:
                        expression = expression.getParts().first().val;
                        break;
                }
            }
            return expression;
        },
        /**
         * Gets the number of factors it accounts for.
         * @param {MEPH.math.Expression} expression
         * @return {Number}
         **/
        getCount: function (expression) {
            switch (expression.type) {
                case Expression.type.power:
                    return expression.partOrDefault(Expression.function.power);
                default:
                    return 1;
            }
        },
        /**
         * Get expression.
         * @param {MEPH.math.Expression} expression
         * @return {MEPH.math.Expression}
         */
        getExp: function (expression) {
            switch (expression.type) {
                case Expression.type.power:
                    return expression.partOrDefault(Expression.function.base);
                default:
                    return expression;
            }
        },
        /**
         * Gets the multiplication factors.
         * @param {MEPH.math.Expression} expression
         * @return {Array} of Factors
         **/
        getMultiplicationFactors: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var factors = [],
                result = expression.getParts().select(function (x) {
                    return Factor.getFactors(x.val);
                }).concatFluent(function (x) {
                    return x;
                });

            result.foreach(function (x) {
                var f = factors.first(function (y) { return y.exp.equals(x.exp, { exact: true }); });
                if (f) {
                    if (!isNaN(f.count) && !isNaN(x.count)) {
                        f.count += x.count;
                    }
                    else {
                        var t = typeof f.count === 'object' ? f.count : Expression.variable(f.count);
                        f.count = Expression.addition(Expression.variable(x.count), t);
                    }
                }
                else {
                    factors.push(x);
                }
            });

            return factors;
        },
        /**
         * Gets variable factors.
         * @param {MEPH.math.Expression} expression
         * @return {Array}
         **/
        getVariableFactors: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var factor = new Factor(expression, 1);
            return [factor];
        },
        /**
         * Gets power factors.
         * @param {MEPH.math.Expression} expression
         * @return {Array}
         **/
        getPowerFactors: function (expression) {
            var Factor = MEPH.math.expression.Factor;
            var copy = expression.copy();
            var flattenedCopy = Expression.FlattenPower(copy);
            var power = flattenedCopy.partOrDefault(Expression.function.power);
            var num = Factor.getNumerical(power)
            var factor = new Factor(flattenedCopy.partOrDefault(Expression.function.base), num);
            return [factor];
        },
        /**
         * Gets a numerical value or string or expression.
         * @param {Object} obj
         * @return {Object/Number/String}
         **/
        getNumerical: function (obj) {
            var result;
            if (typeof obj === 'object') {
                if (obj.type === Expression.type.variable) {
                    result = obj.partOrDefault(Expression.type.variable);
                    result = isNaN(result) ? obj : parseFloat(result);
                }
                else result = obj;
            }
            else if (typeof obj === 'number') {
                result = obj;
            }
            else if (typeof obj === 'string') {
                result = parseFloat(obj);
            }
            return result;
        }
    },
    initialize: function (exp, count) {
        var me = this;
        me.exp = exp;
        me.count = count;
    },
    copy: function () {
        var me = this;
        return new MEPH.math.expression.Factor(me.exp, me.count);
    },
    properties: {
        exp: null,
        count: null
    }
});