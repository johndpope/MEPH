MEPH.define('MEPH.math.ExpressionMatch', {
    alternateNames: 'ExpressionMatch',
    statics: {
        getMatch: function (expression) {
            var result = [];
            switch (expression.type) {
                case Expression.type.integral:
                    //Integral of a constant
                    var integral = Expression.integral(Expression.variable('#C'), expression.part(Expression.function.respectTo).val);
                    if (expression.equals(integral)) {
                        var v = expression.part(Expression.function.input);
                        var dx = expression.part(Expression.function.respectTo);
                        var variable = Expression.variable(v.val);
                        result.push(Expression.addition(Expression.multiplication(variable, Expression.variable(dx)), Expression.variable('c')));
                    }
                    break;
            }
            return result;
        }
    }
});