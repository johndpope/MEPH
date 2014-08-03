﻿MEPH.define('MEPH.math.Expression', {
    alternateNames: 'Expression',
    requires: ['MEPH.math.ExpressionMatch'],
    statics: {
        type: {
            variable: 'variable',
            integral: 'integral',
            addition: 'addition',
            power: 'power',
            limit: 'limit',
            fraction: 'fraction',
            sin: 'sin',
            cos: 'cos',
            tan: 'tan',
            csc: 'csc',
            cot: 'cot',
            sec: 'sec',
            tan: 'tan',
            func: 'func',
            mod: 'mod',
            modulo: 'modulo',
            theta: 'theta',
            subtraction: 'subtraction',
            plusminus: 'plusminus',
            multiplication: 'multiplication',
            division: 'division'
        },
        'function': {
            input: 'input',
            start: 'start',
            end: 'end',
            name: 'name',
            denominator: 'denominator',
            numerator: 'numerator',
            base: 'base',
            expression: 'exp',
            power: 'power',
            respectTo: 'respectTo'
        },
        getMatch: function (expression) {
            return ExpressionMatch.getMatch(expression);
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
        plusminus: function (a, b) {
            var expression = new Expression();
            expression.setExp(Expression.type.plusminus);
            expression.addPart(Expression.function.input, a);
            expression.addPart(Expression.function.input, b);
            return expression
        },
        variable: function (variable) {
            var expression = new Expression();
            expression.setExp(Expression.type.variable, variable);
            return expression;
        },
        limit: function (exp, a, b) {
            var expression = new Expression();
            expression.setExp(Expression.type.limit);
            expression.addPart(Expression.function.expression, exp);
            expression.addPart(Expression.function.start, a);
            expression.addPart(Expression.function.end, b);
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
            expression.addPart(Expression.function.numerator, numerator)
            MEPHArray.convert(arguments).subset(1).foreach(function (x) {
                expression.addPart(Expression.function.denominator, x);
            });
            return expression;
        },
        /**
         * Expresses a modulo function
         **/
        mod: function (a, b) {
            var expression = new Expression();
            expression.setExp(Expression.type.modulo);
            expression.addPart(Expression.function.input, a)

            expression.addPart(Expression.function.input, b)
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
        /**
         * Expresses cos
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        cos: function (exp, power) {
            return Expression.trigonometric(Expression.type.cos, exp, power);
        },
        /**
         * Expresses tan
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        tan: function (exp, power) {
            return Expression.trigonometric(Expression.type.tan, exp, power);
        },
        /**
         * Expresses sin
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        sin: function (exp, power) {
            return Expression.trigonometric(Expression.type.sin, exp, power);
        },
        /**
         * Expresses csc
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        csc: function (exp, power) {
            return Expression.trigonometric(Expression.type.csc, exp, power);
        },
        /**
         * Expresses sec
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        sec: function (exp, power) {
            return Expression.trigonometric(Expression.type.sec, exp, power);
        },
        /**
         * Expresses cot
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        cot: function (exp, power) {
            return Expression.trigonometric(Expression.type.cot, exp, power);
        },
        /**
         * Expresses a trigonemtric function like, cos, sin and tan
         * @param {String} type
         * @param {MEPH.expression.Expression} exp
         * @param {Number} power
         **/
        trigonometric: function (type, exp, power) {
            var expression = new Expression();
            expression.setExp(type);
            expression.addPart(Expression.function.input, exp);
            if (power !== undefined) {
                expression.addPart(Expression.function.power, power);
            }
            return expression;

        },
        func: function (func) {
            var expression = new Expression();
            expression.setExp(Expression.type.func);
            expression.addPart(Expression.function.name, MEPHArray.convert(arguments).first());
            MEPHArray.convert(arguments).subset(1).foreach(function (x) {
                expression.addPart(Expression.function.input, x);
            });
            return expression;
        },
        theta: function () {
            var expression = new Expression();
            expression.setExp(Expression.type.theta);
            return expression;
        },
        /**
         * Expresses an integral
         **/
        integral: function (exp, dx, a, b) {
            var expression = new Expression();
            expression.setExp(Expression.type.integral);
            expression.addPart(Expression.function.input, exp);
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
            case Expression.type.func:
                return me.partLatex(Expression.function.name) + '(' + me.parts.subset(1).select(function (x) {
                    return x.val;
                }).join(',') + ')';
                break;
            case Expression.type.multiplication:
                if (me.parts.unique(function (x) { return x.val.latex(); }).length !== me.parts.length ||
                    me.parts.where(function (x) { return parseFloat(x.val.latex()); }).length !== me.parts.length || x.val.latex() === '0') {
                    return me.parts.select(function (x, index) {
                        return x.val.latex();
                    }).join('');
                }
                else
                    return me.parts.select(function (x, index) {
                        return x.val.latex();
                    }).join(' * ');
                break;
            case Expression.type.modulo:
                return me.latexPart(me.parts.nth(1)) +
                    ' \\bmod ' +
                    me.latexPart(me.parts.nth(2));
                break;
            case Expression.type.limit:
                var exp = me.partLatex(Expression.function.expression);
                var a = me.partLatex(Expression.function.start);
                var b = me.partLatex(Expression.function.end);
                return '\\lim_{' + a + ' \\to ' + b + '} ' + exp
                break;
            case Expression.type.division:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' / ');
                break;
            case Expression.type.fraction:
                if (me.parts.length === 2) {
                    return '\\frac{' + me.partLatex(Expression.function.numerator) +
                        '}{' + me.partLatex(Expression.function.denominator) + '}';
                }
                else {
                    var start = '\\begin{equation}';
                    var end = ' \\end{equation}';
                    me.parts.subset(0, me.parts.length - 1).foreach(function (part) {
                        start += ' \\cfrac{' + me.latexPart(part) + '}{';

                        end = '}' + end;
                    });
                    return start + me.latexPart(me.parts.last()) + end;
                }
                break;
            case Expression.type.plusminus:
                var a = me.parts.first(function (x) { return x.type === Expression.function.input; });
                var b = me.parts.second(function (x) { return x.type === Expression.function.input; });

                return me.latexPart(a) + ' \\pm ' + me.latexPart(b);
                break;
            case Expression.type.theta:
                return '\\theta';
            case Expression.type.tan:
            case Expression.type.sin:
            case Expression.type.cos:
            case Expression.type.sec:
            case Expression.type.cot:
            case Expression.type.csc:
                var power = me.partLatex(Expression.function.power);
                if (power) {
                    power = '^' + power;
                }
                else { power = '' }
                return '\\' + me.type + power + ' (' + me.partLatex(Expression.function.input) + ')';
            case Expression.type.power:
                return me.partLatex(Expression.function.base) + '^' + me.partLatex(Expression.function.power);
                break;
        }
    },
    latexPart: function (start) {
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
    partLatex: function (type) {
        var me = this;
        var start = me.part(type);
        return me.latexPart(start);
    },
    part: function (type) {
        var me = this;
        return me.parts.first(function (x) { return x.type === type; });
    },
    getParts: function () {
        var me = this;
        return me.parts;
    },
    initialize: function (type) {
        var me = this;
        me.expression = {
        };
        me.parts = [];
    },
    /**
     * Returns true if the equation are equal
     * @param {Object} options
     * @param {Boolean} options.formEquals
     */
    equals: function (expression, options) {
        var me = this;
        options = options || { formEquals: true };

        if (me.type === expression.type) {
            var meparts = me.getParts().select(function (x) { return x; });
            var expparts = expression.getParts().select(function (x) { return x; });
            if (meparts.length !== expparts.length) return false;
            meparts.foreach(function (x) {
                var first = expparts.first(function (y) {
                    if (y.type !== x.type) {
                        return false;
                    }
                    if (y.val && x.val && y.val.equals && x.val.equals) {
                        return y.val.equals(x.val);
                    }
                    else if (y.val && !x.val || !y.val && x.val) {
                        return false;
                    }
                    else {
                        return true
                    }
                });
                if (first) {
                    expparts.removeWhere(function (t) { return t === first; });
                }
                else return false;
            });
            if (expparts.length > 0) return false;
            return true;
        }
    }
});