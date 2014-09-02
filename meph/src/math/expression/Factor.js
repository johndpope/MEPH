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
            }
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
                    result = isNaN(result) ? result : parseFloat(result);
                }
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
    properties: {
        exp: null,
        count: null
    }
});