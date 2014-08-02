MEPH.define('MEPH.math.Expression', {
    alternateNames: 'Expression',
    statics: {
        type: {
            variable: 'variable',
            integral: 'integral',
            addition: 'addition',
            power: 'power',
            subtraction: 'subtraction',
            multiplication: 'multiplication',
            division: 'division'
        },
        'function': {
            input: 'input',
            start: 'start',
            end: 'end',
            denominator: 'denominator',
            numerator: 'numerator',
            base: 'base',
            power: 'power',
            respectTo: 'respectTo'
        },
        /**
         * When printing an expression, sub expressions of certain types should be wrapped in parenthesis,
         * for readability purposes.
         * @param {String} type
         **/
        requiresParenthesis: function (type) {
            switch (type) {
                case Expression.type.subtraction:
                case Expression.type.division:
                case Expression.type.multiplication:
                case Expression.type.addition:
                    return true;
                default: return false;
            }
        },
        power: function (base, power) {
            var expression = new Expression();
            expression.setExp(Expression.type.power);
            expression.addPart(Expression.function.base, base);
            expression.addPart(Expression.function.power, power);
            return expression;
        },
        variable: function (variable) {
            var expression = new Expression();
            expression.setExp(Expression.type.variable, variable);
            return expression;
        },
        /**
         * Expresses an addition function, a + b + c + ... + n
         **/
        addition: function (a, b) {
            return Expression.arithmetic.apply(null, [Expression.type.addition].concat(MEPHArray.convert(arguments)));
        },
        /**
         * Expresses an addition function, a - b - c - ... - n
         **/
        subtraction: function (a, b) {
            return Expression.arithmetic.apply(null, [Expression.type.subtraction].concat(MEPHArray.convert(arguments)));
        },
        /**
         * Expresses an multiplication function, a * b * c * ... * n
         **/
        multiplication: function (a, b) {
            return Expression.arithmetic.apply(null, [Expression.type.multiplication].concat(MEPHArray.convert(arguments)));
        },
        /**
         * Expresses an multiplication function, a * b * c * ... * n
         **/
        division: function (a, b) {
            return Expression.arithmetic.apply(null, [Expression.type.division].concat(MEPHArray.convert(arguments)));
        },
        /**
         * Expresses a fraction
         **/
        fraction: function (numerator, denominator) {
            var expression = new Expression(); 
            expression.setExp(Expression.type.fraction);
            expression.addPart(Expression.function.numerator, x)
            MEPHArray.convert(arguments).subset(1).foreach(function (x) {
                ;
            });
            return expression;
        },
        /**
         * Expresses an arithemetic like function, a - b - c - ... - n
         **/
        arithmetic: function (type, a, b) {
            var expression = new Expression();
            expression.setExp(type);
            MEPHArray.convert(arguments).subset(1).foreach(function (x) {
                expression.addPart(Expression.function.input, x);
            });
            return expression;
        },
        integral: function (exp, dx, a, b) {
            var expression = new Expression();
            expression.setExp(Expression.type.integral, exp);
            if (a)
                expression.addPart(Expression.function.start, a);
            if (b)
                expression.addPart(Expression.function.end, b);
            if (dx)
                expression.addPart(Expression.function.respectTo, dx);
            return expression;
        }
    },
    properties: {
        expression: null,
        parts: null,
        type: null
    },
    setExp: function (type, val) {
        var me = this;
        me.type = type;
        if (val !== undefined) {
            me.parts.push({ type: type, val: val });
        }
    },
    addPart: function (type, val) {
        var me = this;
        me.parts.push({ type: type, val: val });
    },
    latex: function () {
        var me = this,
            result;
        switch (me.type) {
            case Expression.type.variable:
                return me.parts.first().val;
            case Expression.type.integral:
                //\int_a^b \! f(x) \, \mathrm{d}x.
                var start = me.partLatex(Expression.function.start);
                var end = me.partLatex(Expression.function.end);
                var middle = '';
                if (start && end) {
                    middle = start + '^' + end;
                }
                result =
                    '\\int_' +
                    middle + ' ' +
                '\\! ' +
                me.parts.first().val.latex() + ' ' +
                '\\,' + ' ' +
                '\\mathrm{d}' +
                me.partLatex(Expression.function.respectTo) + '.'
                return result;
            case Expression.type.addition:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' + ');
                break;
            case Expression.type.subtraction:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' - ');
                break;
            case Expression.type.multiplication:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' * ');
                break;
            case Expression.type.division:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' / ');
                break;
            case Expression.type.fraction:
                return '\\frac{' + me.partLatex(Expression.function.numerator) +
                    '}{' + me.partLatex(Expression.function.denominator) + '}';
                break;
            case Expression.type.power:
                return me.partLatex(Expression.function.base) + '^' + me.partLatex(Expression.function.power);
                break;
        }
    },
    partLatex: function (type) {
        var me = this;
        var start = me.part(type);
        if (start && start.val) {
            if (start.val.latex) {
                start = start.val.latex();
            }
            else {
                start = start.val;
            }
        }
        return start || '';
    },
    part: function (type) {
        var me = this;
        return me.parts.first(function (x) { return x.type === type; });
    },
    initialize: function (type) {
        var me = this;
        me.expression = {
        };
        me.parts = [];
    }
});