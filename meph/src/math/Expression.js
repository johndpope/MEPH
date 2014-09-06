/**
 * @class MEPH.math.Expression
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.Expression', {
    alternateNames: 'Expression',
    requires: ['MEPH.math.ExpressionMatch',
                'MEPH.math.Set',
                'MEPH.math.expression.Factor',
                'MEPH.math.ExpressionTranslation'],
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
            ln: 'ln',
            negative: 'negative',
            abs: 'abs',
            func: 'func',
            mod: 'mod',
            modulo: 'modulo',
            theta: 'theta',
            subtraction: 'subtraction',
            plusminus: 'plusminus',
            multiplication: 'multiplication',
            division: 'division',
            anything: 'anything',
            derivative: 'derivative'
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
            respectTo: 'respectTo',
            derivative: 'derivative'
        },
        translation: {
            Translate: function (a, b) {
                return ExpressionTranslation.translate(a, b)
            },
            Transform: function (transform, a, b) {
                return ExpressionTranslation.transform(transform, a, b);
            }
        },
        RuleType: {
            IntegralConstMultiply: 'IntegralConstMultiply',
            MultiplyIntegralofFx: 'MultiplyIntegralofFx',
            IntegralConst: 'IntegralConst',
            AxPlusC: 'AxPlusC',
            Power: 'Power',
            PowerIntegrate: 'PowerIntegrate',
            IntegrationAddition: 'IntegrationAddition',
            AdditionIntegral: 'AdditionIntegral',
            IntegrationByParts: 'IntegrationByParts',
            IntegrationByPartsComplete: 'IntegrationByPartsComplete',
            Fudx: 'Fudx',
            FuOveruprimedx: 'FuOveruprimedx',
            OneOverX: 'OneOverX',
            NaturalLogAbsX: 'NaturalLogAbsX',
            GeneralFormula8A: 'GeneralFormula8A',
            GeneralFormula8B: 'GeneralFormula8B',
            GeneralFormula9A: 'GeneralFormula9A',
            GeneralFormula9B: 'GeneralFormula9B',
            TrigonometricFormula10A: 'TrigonometricFormula10A',
            TrigonometricFormula10B: 'TrigonometricFormula10B',
            TrigonometricFormula11A: 'TrigonometricFormula11A',
            TrigonometricFormula11B: 'TrigonometricFormula11B'
        },
        Dependency: {
            ConstRelation: function (c, x) {
                var inRespectTo = x && x.val && x.val.part ? x.val.part('variable').val : x.val;
                return !c.respects().contains(function (x) { return x === inRespectTo; });
            },
            VariableRelation: function (c, x) {
                var inRespectTo = x && x.val && x.val.part ? x.val.part('variable').val : x.val;
                return c.respects().contains(function (x) { return x === inRespectTo; });
            },
            SiblingIndependence: function (c, t) {
                var inRespectTo = t.select(function (x) {
                    var inRespectTo = x && x.val && x.val.part ? x.val.respects() : [x.val];
                    return inRespectTo;
                }).concatFluent(function (x) { return x; });
                return !inRespectTo.intersection(c.respects()).count();
            },
            SiblingDependence: function (c, t) {
                var inRespectTo = t.select(function (x) {
                    var inRespectTo = x && x.val && x.val.part ? x.val.respects() : [x.val];
                    return inRespectTo;
                }).concatFluent(function (x) { return x; });
                return inRespectTo.intersection(c.respects()).count();
            }
        },
        /**
         * Gets the greatest common factor from an array of expressions.
         * @param {MEPH.math.Expression} expression
         * @return {Array} of MEPH.math.expression.Factor
         */
        GreatestCommomFactor: function (expression) {

            var flattenedExpression = Expression.Flatten(expression.copy(), Expression.type.multiplication);
            var factors = [];
            var collectedFactors = flattenedExpression.getParts().select(function (x) {
                return MEPH.math.expression.Factor.getFactors(x.val);
            })
            var preCompactedFactors = collectedFactors.intersectFluent(function (x, y) {
                return x.exp.equals(y.exp, { exact: true });
            });

            var ret = preCompactedFactors.select(function (gh) {
                return collectedFactors.concatFluent(function (x) { return x; }).where(function (x) {
                    return x.exp.equals(gh.exp, { exact: true });
                }).minSelect(function (y) {
                    return y.count;
                });
            });

            return ret;
        },
        /**
         * The expression will have the factors removed from a flattened expression, and 
         * multiplied by those factors.
         * @param {MEPH.math.Expression} expression
         * @param {Array} factors 
         * @return {MEPH.math.Expression}
         ***/
        Refactor: function (expression, factors) {
            var flattenedExpression = Expression.Flatten(expression.copy(), Expression.type.multiplication);
            flattenedExpression.getParts().select(function (part) {
                var replacement = MEPH.math.expression.Factor.removeFactors(part.val, factors);
                return { r: replacement, p: part.val };
            }).foreach(function (t) {
                Expression.SwapPart(t.p, t.r);
            });

            return Expression.multiplication.apply(this, factors.select(function (x) { return x.exp }).concat(flattenedExpression))
        },

        /**
         * Swaps a for b.
         * @param {MEPH.math.Expression} b
         * @param {MEPH.math.Expression} a
         * @return {Boolean}s
         ***/
        SwapPart: function (a, b) {
            if (a.parent()) {
                var parent = a.parent();
                var part = parent.remove(a).first();
                parent.addPart(part.type, b);
                b.parent(parent);
                return true;
            }
            return false;
        },
        Rules: {
            IntegralConstMultiply: function () {
                var c = Expression.variable('A');
                c.mark('C');
                var a = Expression.anything();
                a.mark('A');
                var expression = Expression.integral(Expression.multiplication(c, a), 'x');
                expression.mark('I');

                expression.name(Expression.RuleType.IntegralConstMultiply);

                return expression;
            },
            MultiplyIntegralofFx: function () {
                var c = Expression.variable('#C');
                c.mark('C');
                var a = Expression.anything();
                a.mark('A');
                var I = Expression.integral(a, 'x');
                I.mark('I');
                var expression = Expression.multiplication(c, I);

                expression.name(Expression.RuleType.MultiplyIntegralofFx);

                return expression;
            },
            IntegralConst: function () {
                var c = Expression.anything();
                c.mark('C');
                c.dependency('parent', 'respectTo', Expression.Dependency.ConstRelation);

                var dx = Expression.variable('x');
                dx.mark('dx');
                var expression = Expression.integral(c, dx);
                expression.mark('I');
                expression.name(Expression.RuleType.IntegralConst);
                return expression;
            },
            AxPlusC: function () {
                var a = Expression.anything('A');
                a.mark('A');

                a.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var x = Expression.variable('x');
                x.mark('x');
                var c = Expression.variable('#C');
                c.mark('C');

                var expression = Expression.addition(Expression.multiplication(a, x), c);

                expression.name(Expression.RuleType.AxPlusC);

                return expression;
            },
            Power: function () {
                var n = Expression.variable('n');
                n.mark('n');
                var x = Expression.variable('x');
                x.mark('x');

                var power = Expression.power(x, n);
                x.dependency('grandparent', 'respectTo', Expression.Dependency.VariableRelation);
                n.dependency('grandparent', 'respectTo', Expression.Dependency.ConstRelation);

                var expression = Expression.integral(power, 'x');
                expression.mark('I');

                expression.name(Expression.RuleType.Power);

                return expression
            },
            PowerIntegrate: function () {
                var n = Expression.variable('n');
                n.mark('n_pre');
                var n2 = Expression.variable('n');
                n2.mark('n_post');
                var x = Expression.variable('x');
                x.mark('x');
                x.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var c = Expression.variable('C');
                c.mark('C');

                var exp = Expression.addition(Expression.multiplication(
                                Expression.fraction(
                                    Expression.variable(1),
                                    Expression.addition(
                                        n,
                                        Expression.variable(1)
                                    )
                                ),
                Expression.power(
                    x,
                    Expression.addition(n2, Expression.variable(1)))), c);

                exp.name(Expression.RuleType.PowerIntegrate);

                return exp;
            },
            IntegrationAddition: function () {
                var func = Expression.func('f', 'x');
                func.mark('f');
                func.dependency('grandparent', 'respectTo', Expression.Dependency.VariableRelation);

                var addition = Expression.addition(func);
                addition.mark('A');
                addition.repeat = true;
                var dx = Expression.variable('x');
                dx.mark('dx');
                var integral = Expression.integral(addition, dx);
                integral.mark('I');
                integral.name(Expression.RuleType.IntegrationAddition);
                return integral;
            },
            AdditionIntegral: function () {
                var func = Expression.func('f', 'x');
                func.mark('f');
                func.dependency('parent', 'respectTo', Expression.Dependency.VariableRelation);

                var dx = Expression.variable('x');
                dx.mark('dx');
                var integral = Expression.integral(func, dx);
                integral.mark('I');
                var addition = Expression.addition(integral);
                addition.repeat = true;
                addition.mark('A');
                addition.name(Expression.RuleType.AdditionIntegral);
                return addition;
            },
            IntegrationByParts: function () {
                var dv = Expression.variable('v');
                dv.mark('dv');
                var du = Expression.variable('u');
                du.mark('du');
                var Fx = Expression.func('f', du);
                Fx.dependency('parent', 'respectTo', Expression.Dependency.ConstRelation);
                var integral = Expression.integral(Fx, dv);
                integral.name(Expression.RuleType.IntegrationByParts);
                return integral;
            },
            IntegrationByPartsComplete: function () {
                var u1 = Expression.variable('u');
                u1.mark('u_1');
                var f = Expression.func('f', u1);

                var v1 = Expression.variable('v');
                v1.mark('v_1');
                var g = Expression.func('g', v1);
                f.dependency('sibling', '', Expression.Dependency.SiblingDependence);
                g.dependency('sibling', '', Expression.Dependency.SiblingDependence);

                var mul = Expression.multiplication(f, g);

                var v2 = Expression.variable('v');
                v2.mark('v_2');
                var g2 = Expression.func('g', v2);
                g2.dependency('parent', 'respectTo', Expression.Dependency.VariableRelation);

                var du = Expression.variable('u');
                du.mark('u_2');
                var integral = Expression.integral(g2, du);

                var subtraction = Expression.subtraction(mul, integral);

                subtraction.name(Expression.RuleType.IntegrationByPartsComplete);

                return subtraction;
            },
            Fudx: function () {
                var udx = Expression.variable('x');
                udx.mark('u_dx');

                var u = Expression.func('u', udx);
                u.mark('u');

                var dx = Expression.variable('x');
                dx.mark('dx');

                var fu = Expression.func('f', u);

                var integral = Expression.integral(fu, dx);
                integral.mark('I');

                integral.name(Expression.RuleType.Fudx);

                return integral;
            },
            FuOveruprimedx: function () {
                var du3 = Expression.variable('u');
                du3.mark('du3');

                var FuPrime = Expression.derivative('f', 1, du3);

                var du2 = Expression.variable('u');
                du2.mark('du2');

                var Fu = Expression.func('f', du2);

                var du = Expression.variable('u');
                du.mark('du');

                var fraction = Expression.fraction(Fu, FuPrime);

                var integral = Expression.integral(fraction, du);
                integral.name(Expression.RuleType.FuOveruprimedx);
                return integral;
            },
            OneOverX: function () {

                var x = Expression.variable('x');
                x.mark('x');
                x.dependency('grandparent', 'respectTo', Expression.Dependency.VariableRelation);

                var one = Expression.variable('1');

                var fraction = Expression.fraction(one, x);

                var dx = Expression.variable('x');

                var integral = Expression.integral(fraction, dx);

                integral.name(Expression.RuleType.OneOverX);

                return integral;
            },
            NaturalLogAbsX: function () {

                var x = Expression.variable('x');
                x.mark('x');

                var abs = Expression.abs(x);

                var ln = Expression.ln(abs);
                ln.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var c = Expression.variable('c');

                var addition = Expression.addition(ln, c);

                addition.name(Expression.RuleType.NaturalLogAbsX);

                return addition;
            },
            GeneralFormula8A: function () {
                var a = Expression.variable('a');
                a.mark('a');

                var x = Expression.variable('x');
                x.mark('x');

                var x2 = Expression.power(x, 2);

                var a2 = Expression.power(a, 2);

                var denominator = Expression.addition(x2, a2);
                x2.dependency('sibling', '', Expression.Dependency.SiblingIndependence);
                x2.dependency('parent.parent.parent', 'respectTo', Expression.Dependency.VariableRelation);

                var one = Expression.variable('1');

                var f = Expression.fraction(one, denominator);

                var dx = Expression.variable('x');

                var integral = Expression.integral(f, dx);
                integral.name(Expression.RuleType.GeneralFormula8A);


                return integral;
            },
            GeneralFormula8B: function () {

                var xtan = Expression.variable('x');
                xtan.mark('x');

                var atan = Expression.variable('a');
                atan.mark('a_tan');

                xtan.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var tanexp = Expression.fraction(xtan, atan);

                var tanInv = Expression.tan(tanexp, -1);

                var denominator = Expression.variable('a');
                denominator.mark('a');

                var numerator = Expression.variable('1');

                var fraction = Expression.fraction(numerator, denominator);

                var c = Expression.variable('c');

                var f = Expression.multiplication(fraction, tanInv);

                var addition = Expression.addition(f, c);
                addition.name(Expression.RuleType.GeneralFormula8B);

                return addition;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * General Formula 8 a
             * @return {MEPH.math.Expression}
             **/
            GeneralFormula9A: function () {
                var a = Expression.variable('a');
                a.mark('a');

                var x = Expression.variable('x');
                x.mark('x');

                var a2 = Expression.power(a, 2);
                var x2 = Expression.power(x, 2);
                x2.dependency('sibling', '', Expression.Dependency.SiblingIndependence);
                x2.dependency('parent.parent.parent', 'respectTo', Expression.Dependency.VariableRelation);

                var denominator = Expression.subtraction(x2, a2);

                var numerator = Expression.variable('1');
                var dx = Expression.variable('x');
                var f = Expression.fraction(numerator, denominator);

                var integral = Expression.integral(f, dx);
                integral.name(Expression.RuleType.GeneralFormula9A);

                return integral;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * General Formula 8 b
             * @return {MEPH.math.Expression}
             **/
            GeneralFormula9B: function () {
                var a2 = Expression.variable('a');
                a2.mark('a2');

                var x2 = Expression.variable('x');
                x2.mark('x2');

                x2.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var denominator = Expression.addition(x2, a2);

                var a1 = Expression.variable('a');
                a1.mark('a1');

                var x1 = Expression.variable('x');
                x1.mark('x1');

                x1.dependency('sibling', '', Expression.Dependency.SiblingIndependence);

                var numerator = Expression.subtraction(x1, a1);
                var frac = Expression.fraction(numerator, denominator);

                numerator.dependency('sibling', '', Expression.Dependency.SiblingDependence);

                var abs = Expression.abs(frac);

                var ln = Expression.ln(abs);

                var two = Expression.variable('2');

                var a3 = Expression.variable('a');
                a3.mark('a3');
                var denom = Expression.multiplication(two, a3);

                var num = Expression.variable('1');

                var fraction = Expression.fraction(num, denom);

                var f = Expression.multiplication(fraction, ln);

                var c = Expression.variable('c');

                var addition = Expression.addition(f, c);

                addition.name(Expression.RuleType.GeneralFormula9B);

                return addition;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * Trigonometric Formula 10 a
             * @return {MEPH.math.Expression}
             **/
            TrigonometricFormula10A: function () {
                var dx = Expression.variable('x');
                dx.mark('dx');

                var x = Expression.variable('x');

                x.mark('x');

                var sin = Expression.sin(x);

                var integral = Expression.integral(sin, dx);

                integral.name(Expression.RuleType.TrigonometricFormula10A);

                return integral;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * Trigonometric Formula 10 b
             * @return {MEPH.math.Expression}
             **/
            TrigonometricFormula10B: function () {
                var c = Expression.variable('c');

                var x = Expression.variable('x');
                x.mark('x');

                var cosine = Expression.cos(x);

                var neg1 = Expression.neg(cosine);


                var addition = Expression.addition(neg1, c);

                addition.name(Expression.RuleType.TrigonometricFormula10B);

                return addition;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * Trigonometric Formula 10 a
             * @return {MEPH.math.Expression}
             **/
            TrigonometricFormula11A: function () {
                var dx = Expression.variable('x');
                dx.mark('dx');

                var x = Expression.variable('x');

                x.mark('x');

                var cos = Expression.cos(x);

                var integral = Expression.integral(cos, dx);

                integral.name(Expression.RuleType.TrigonometricFormula11A);

                return integral;
            },
            /**
             * http://myhandbook.info/form_integ.html
             * Trigonometric Formula 10 b
             * @return {MEPH.math.Expression}
             **/
            TrigonometricFormula11B: function () {
                var c = Expression.variable('c');

                var x = Expression.variable('x');
                x.mark('x');

                var sin = Expression.sin(x);

                var addition = Expression.addition(sin, c);

                addition.name(Expression.RuleType.TrigonometricFormula11B);

                return addition;
            }
        },
        /**
         * Flattens an expression.
         * @param {MEPH.math.Expression} expression
         * @param {String} type
         * @return {MEPH.math.Expression}
         **/
        Flatten: function (expression, type, started) {

            switch (type) {
                case Expression.type.power:
                    return Expression.FlattenPower(expression.copy(), type, true);
                default:
                    if (expression.type !== type) {
                        if (started) {
                            return [expression];
                        }
                        else {
                            return expression;
                        }
                    }
                    else {
                        var parts = expression.getValues().concatFluent(function (x) {
                            if (x.type === type) {

                                return Expression.Flatten(x.copy(), type, true);

                            }
                            else {
                                return [x.copy()];
                            }
                        });
                        if (!started) {
                            var copy = expression.copy();

                            copy.clearParts();
                            parts.foreach(function (p) {
                                copy.addInput(p)
                                return p.parent(copy);
                            });

                            return copy;
                        }

                        return parts;
                    }
            }
        },
        /**
         * Flattens a power expression.
         * @param {MEPH.math.Expression} expression
         * @param {String} type
         * @return {MEPH.math.Expression}
         **/
        FlattenPower: function (expression, type, started) {
            //
            //            expression.addPart(Expression.function.base, base);
            //           expression.addPart(Expression.function.power, power);
            var exp = expression.partOrDefault(Expression.function.base),
                variable,
                flattenedPower;
            switch (exp.type) {
                case Expression.type.power:
                    flattenedPower = Expression.FlattenPower(exp.copy(), type, started);
                    break;
                default:
                    return expression;
            }
            var powerval,
                power = flattenedPower.partOrDefault(Expression.function.power);

            if (typeof power === 'object') {
                switch (power.type) {
                    case Expression.type.variable:
                        powerval = power.partOrDefault(Expression.type.variable)
                        powerval = isNaN(powerval) ? powerval : parseFloat(powerval);
                        break;
                }
            }
            else {
                powerval = isNaN(power) ? power : parseFloat(power);;
            }

            var expressionpower = expression.partOrDefault(Expression.function.power);
            var expressionpowerval;
            if (typeof expressionpower === 'object') {
                expressionpowerval = expressionpower.partOrDefault(Expression.type.input) || expressionpower.partOrDefault(Expression.type.variable);
                switch (expressionpower.type) {
                    case Expression.type.variable:
                        expressionpowerval = isNaN(expressionpowerval) ? expressionpowerval : parseFloat(expressionpowerval);
                        break;
                }
            }
            else {
                expressionpowerval = isNaN(expressionpower) ? expressionpower : parseFloat(expressionpower);
            }

            if (!isNaN(powerval) && !isNaN(expressionpowerval)) {
                var part = flattenedPower.partOrDefault(Expression.function.power);
                flattenedPower.remove(part);
                flattenedPower.addPart(Expression.function.power, Expression.variable(powerval * expressionpowerval));
            }
            else {
                var part = flattenedPower.partOrDefault(Expression.function.power);
                flattenedPower.remove(part);
                if (typeof powerval !== 'object') {
                    powerval = Expression.variable(powerval);
                }
                if (typeof expressionpowerval !== 'object') {
                    expressionpowerval = Expression.variable(expressionpowerval);
                }

                flattenedPower.addPart(Expression.function.power, Expression.multiplication(powerval, expressionpowerval));
            }

            return flattenedPower;
        },
        /**
         * Creates associative groupings of a flattened expression.
         * @param {MEPH.math.Expression} expression
         * @returns {Array}
         **/
        createAssociativeGroupings: function (expression) {

            var sagset = MEPH.math.Set.sagset(expression.parts.length);
            return sagset.select(function (sag) {
                var set = sag;
                var perm = MEPH.math.Set.permutate(new Set([].interpolate(0, expression.parts.length, function (x) {
                    return x;
                })));

                var generateSetPermutations = function (set, index, max, $subtree) {
                    var superset = MEPH.math.Set.superset(new Set([].interpolate(0, $subtree.length, function (x) {
                        return $subtree[x];
                    }))).get();
                    var sub_super_set = (superset).where(function (x) {
                        return x.count(function (t) {
                            return t !== null;
                        }) === set[index];
                    });

                    var result = sub_super_set.select(function (y) {
                        return y.select(function (t, i) {
                            return y[i] !== null ? $subtree[i] : false;
                        }).where(function (x) {
                            return x !== false;
                        });
                    });

                    result = result.concatFluent(function (subresult) {
                        var subtree = ($subtree.where(function (x) {
                            return !subresult.contains(function (t) { return t === x; })
                        }));
                        var generatedSubTree;
                        if (index < max - 1 && subtree.length) {
                            return generateSetPermutations(set, index + 1, max, subtree).select(function (st) {
                                return subresult.concat(st);
                            });
                        }

                        return index ? subresult : [subresult];
                    });

                    return result;
                };

                var output = generateSetPermutations(set, 0, expression.parts.length, [].interpolate(0, expression.parts.length, function (x) {
                    return x;
                })).select(function (x, index) {
                    return x.select(function (t) {
                        var val = expression.parts[t].val;
                        return val && val.copy ? val.copy() : val;
                    });
                });


                return {
                    set: set,
                    grouping: output
                }
            });

        },
        /**
         * Convert a grouping to expressions.
         * @param {Object} grouping
         * @param {String} type
         * @return {Array}
         **/
        convertGrouping: function (grouping, type) {
            return grouping.concatFluent(function (group) {
                return group.grouping.select(function (t) {
                    return Expression.convertGroup({ set: group.set, grouping: t }, type);
                });
            })
        },
        /**
         * Convert a grouping to an expression.
         * @param {Object} grouping
         * @param {String} type
         * @return {MEPH.math.Expression}
         **/
        convertGroup: function (grouping, type) {
            var expression,
                index = 0,
                buffer = [],
                parentFunc;
            switch (type) {
                case Expression.type.multiplication:
                    parentFunc = Expression.multiplication;
                    break;
                case Expression.type.addition:
                    parentFunc = Expression.addition;
                    break;
            }
            [].interpolate(0, grouping.set.length, function (_s) {
                var s = grouping.set[_s];
                if (expression) {
                    var temp = grouping.grouping.subset(index, s + index);
                    expression = parentFunc.apply(null, [expression].concat(temp));
                    index = s + index;
                }
                else {
                    if (buffer.length || s > 1) {
                        if (buffer.length) {
                            var temp = grouping.grouping.subset(index, s + index);
                            expression = parentFunc.apply(null, buffer.concat(temp));
                            buffer = [];
                        }
                        else {
                            expression = parentFunc.apply(null, grouping.grouping.subset(index, s + index));
                        }
                        index = s + index;
                    }
                    else {
                        buffer.push(grouping.grouping[index]);
                        index++;
                    }
                }
            });
            return expression;
        },
        matchRule: function (expression, rule, markRule) {
            var res = expression.match(rule, markRule || false);
            if (res) {
                expression.name(rule.name());
            }
            return res;
        },
        getMatch: function (expression) {
            return ExpressionMatch.getMatch(expression);
        },
        integrate: function (expression) {
            return ExpressionMatch.integrate(expression);
        },
        anything: function (v) {
            var expression = new Expression();
            expression.anything = v || null;
            expression.setExp(Expression.type.anything);
            return expression;
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
        /**
         * Math.pow(base , power);
         * @param {MEPH.math.Expression} power
         * @param {MEPH.math.Expression} base
         */
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
        /**
         * An expression representing the value '1'
         * @return {MEPH.math.Expression}
         **/
        one: function () {
            return Expression.variable(1);
        },
        /**
         * If an expression represents the value '1' then true is returned otherwise false.
         * @return {MEPH.math.Expression}
         **/
        isOne: function (exp) {
            return Expression.one().equals(exp, { exact: true });
        },
        /**
         * Removes all the parts of an expression representing one.
         * @param {MEPH.math.Expression} exp
         **/
        removeOne: function (exp) {
            var oneparts = exp.getParts().where(function (x) { return Expression.isOne(x.val); });
            if (oneparts.length === exp.getParts().length) {
                oneparts = oneparts.subset(1);
            }
            oneparts.foreach(function (x) { return exp.remove(x.val); });
            if (exp.getParts().length === 1) {
                return exp.getParts().first().val;
            }
            return exp;
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
        ln: function (x) {
            var expression = new Expression();
            expression.setExp(Expression.type.ln);
            expression.addPart(Expression.function.input, x);
            return expression;
        },
        abs: function (x) {
            var expression = new Expression();
            expression.setExp(Expression.type.abs);
            expression.addPart(Expression.function.input, x);
            return expression;
        },
        neg: function () {
            var expression = new Expression();
            expression.setExp(Expression.type.negative);
            MEPHArray.convert(arguments).foreach(function (x) {
                expression.addPart(Expression.function.input, x);
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
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        cos: function (exp, power) {
            return Expression.trigonometric(Expression.type.cos, exp, power);
        },
        /**
         * Expresses tan
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        tan: function (exp, power) {
            return Expression.trigonometric(Expression.type.tan, exp, power);
        },
        /**
         * Expresses sin
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        sin: function (exp, power) {
            return Expression.trigonometric(Expression.type.sin, exp, power);
        },
        /**
         * Expresses csc
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        csc: function (exp, power) {
            return Expression.trigonometric(Expression.type.csc, exp, power);
        },
        /**
         * Expresses sec
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        sec: function (exp, power) {
            return Expression.trigonometric(Expression.type.sec, exp, power);
        },
        /**
         * Expresses cot
         * @param {MEPH.math.Expression} exp
         * @param {Number} power
         **/
        cot: function (exp, power) {
            return Expression.trigonometric(Expression.type.cot, exp, power);
        },
        /**
         * Expresses a trigonemtric function like, cos, sin and tan
         * @param {String} type
         * @param {MEPH.math.Expression} exp
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
        derivative: function (func, dir) {
            var expression = new Expression();
            expression.setExp(Expression.type.derivative);
            expression.addPart(Expression.function.name, MEPHArray.convert(arguments).first());
            expression.addPart(Expression.function.derivative, dir);
            MEPHArray.convert(arguments).subset(2).foreach(function (x) {
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
        type: null,
        dependencies: null,
        _mark: null,
        _parent: null,
        repeat: false,
        _name: null
    },
    /**
     * @private
     * If the expession is repeating, its repeating parts are returned in an array.
     * @returns {Array}
     **/
    getRepeatParts: function () {
        var me = this;
        if (me.repeat) {
            return me.getParts();
        }
        return [];
    },
    copy: function () {
        var me = this;
        var expression = new Expression();
        expression.type = me.type;
        expression.mark(me.mark());
        expression.name(me.name());
        expression.repeat = me.repeat;
        expression.parts = me.getParts().select(function (x) {
            var copy = x.val.copy ? x.val.copy() : x.val;
            if (x.val.copy) {
                copy.parent(expression);
            }
            return { type: x.type, val: copy };
        });
        expression.expression = me.expression;
        expression.dependencies = me.getDependencies().select();
        return expression;
    },
    mark: function (val) {
        var me = this;
        if (val !== undefined)
            me._mark = val;
        return me._mark;
    },
    name: function (val) {
        var me = this;
        if (val !== undefined) {
            me._name = val;
        }
        return me._name;
    },
    setExp: function (type, val) {
        var me = this;
        me.type = type;
        if (val !== undefined) {
            me.parts.push({ type: type, val: val });
        }
    },
    clearParts: function () {
        var me = this;
        return me.parts.clear();
    },
    /**
     * Set the parts of the expression with the same type.
     * @param {Array} parts
     * @param {String} type
     */
    setParts: function (parts, type) {
        var me = this;
        me.clearParts();
        parts.foreach(function (val) {
            me.addPart(type, val);
        });
    },
    getMark: function (mark) {
        var me = this;
        return me.getMarks()[mark];
    },
    setMark: function (mark, val) {
        var me = this;
        var mark = me.getMark(mark);
        debugger
        mark.parts.removeWhere();
    },
    getMarks: function () {
        var me = this,
            marks = {};

        if (me.mark()) {
            marks[me.mark()] = me;
        }

        me.parts.foreach(function (part) {
            if (part && part.val && part.val.getMarks) {
                var submarks = part.val.getMarks();
                for (var i in submarks) {
                    if (submarks[i])
                        marks[i] = submarks[i];
                }
            }
        });
        return marks;
    },
    /**
     * Gets the list of variables and consts in the expression.
     * @return {Array}
     **/
    respects: function () {
        var me = this;
        var respects = me.getParts().select(function (x) {
            if (x.val) {
                if (x.val instanceof Expression) {
                    return x.val.respects();
                }
                else {
                    if (isNaN(parseFloat(x.val))) {
                        return x.val;
                    }
                    else return null;
                }
            }
            else {
                return null;
            }
        }).concatFluent(function (x) {
            if (x) {
                return Array.isArray(x) ? x : [x];
            }
            return [];
        }).unique();

        return respects;
    },
    addPart: function (type, val) {
        var me = this;
        if (val.parent) {
            val.parent(me);
        }
        me.parts.push({ type: type, val: val });
    },
    addInput: function (val) {
        var me = this;
        me.addPart(Expression.function.input, val);
    },
    parent: function (parent) {
        var me = this;

        if (parent) {
            me._parent = parent;
        }

        return me._parent;
    },
    /**
     * Adds a dependency between itself and another expression relative to it.
     * @param {String} offset
     * @param {String} part
     * @param {Function} ruleFunc
     */
    dependency: function (offset, part, ruleFunc) {
        var me = this;
        me.dependencies.push({ offset: offset, part: part, ruleFunction: ruleFunc });
    },
    /**
     * Gets dependencies
     * @return {Array}
     **/
    getDependencies: function () {
        var me = this;
        return me.dependencies;
    },
    dependenciesAreRespected: function (expression) {
        var me = this;

        return me.getDependencies().all(function (d) {
            var offset, part;
            switch (d.offset) {
                case 'grandparent':
                    offset = expression.parent().parent();
                    part = offset.part(d.part);
                    break;
                case 'parent':
                    offset = expression.parent();
                    part = offset.part(d.part);
                    break
                case 'sibling':
                    offset = expression.parent();
                    var json = JSON.parse('{' + d.part + '}');
                    part = offset.parts.where(function (x) {
                        return x.val !== expression;
                    });
                    break;
                default:
                    if (d.offset.split('.')) {
                        d.offset.split('.').foreach(function (x) {
                            if (x === 'parent') {
                                offset = offset.parent();
                            }
                        });
                        part = offset.part(d.part);
                    } else
                        throw new Error('not handled offset');
                    break;
            }
            if (!offset) {
                throw new Error('no offset found');
            }
            return d.ruleFunction(expression, part);
        });
    },
    /**
     * Converts expressions in to latex format.s
     * @return {String}
     **/
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
                me.partLatex(Expression.function.input) + ' ' +
                '\\,' + ' ' +
                '\\mathrm{d}' +
                me.partLatex(Expression.function.respectTo) + ''
                return result;
            case Expression.type.addition:
                var before = '';
                var after = '';
                if (me.parent()) {
                    before = '(';
                    after = ')';
                }
                return before + me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' + ') + after;
                break;
            case Expression.type.subtraction:
                return me.parts.select(function (x) {
                    return x.val.latex();
                }).join(' - ');
                break;
            case Expression.type.anything:
                return me.anything || 'f(x)';
            case Expression.type.func:
                return me.partLatex(Expression.function.name) + '(' + me.parts.subset(1).select(function (x) {
                    return x.val && x.val.latex ? x.val.latex() : x.val;
                }).join(',') + ')';
                break;
            case Expression.type.derivative:
                return me.partLatex(Expression.function.name) +
                    [].interpolate(0, parseInt(me.parts.nth(2).val), function (x) {
                        return "'";
                    }).join('') +
                    '(' + me.parts.subset(2).select(function (x) {
                        return x.val && x.val.latex ? x.val.latex() : x.val;
                    }).join(',') + ')';
                break;
            case Expression.type.multiplication:
                if (me.parts.unique(function (x) { return x.val.latex(); }).length !== me.parts.length ||
                    me.parts.where(function (x) { return parseFloat(x.val.latex()); }).length !== me.parts.length || x.val.latex() === '0') {
                    return me.parts.orderBy(me.orderParts.bind(me)).select(function (x, index) {
                        return x.val.latex();
                    }).join('');
                }
                else
                    return me.parts.orderBy(me.orderParts.bind(me)).select(function (x, index) {
                        return x.val.latex();
                    }).join(' * ');
                break;
            case Expression.type.modulo:
                return me.latexPart(me.parts.nth(1)) +
                    ' \\bmod ' +
                    me.latexPart(me.parts.nth(2));
                break;
            case Expression.type.negative:
                return '-' + me.parts.orderBy(me.orderParts.bind(me)).select(function (x, index) {
                    return x.val && x.val.latex ? x.val.latex() : x.val;
                }).join('');;
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
            case Expression.type.ln:
                var start = '\\ln ';
                if (me.parts.length > 1) {
                    start += '(';
                }
                var val = me.parts.first().val;
                if (val.latex) {
                    start += val.latex();
                }
                else {
                    start += val;
                }
                if (me.parts.length > 1) {
                    start += ')';
                }
                return start;
            case Expression.type.abs:
                var start = '|';

                var val = me.parts.select(function (x) {
                    return me.latexPart(x);
                }).join('');
                start += val;
                start += '|';
                return start;
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
                return me.partLatex(Expression.function.base) + '^{' + me.partLatex(Expression.function.power) + '}';
                break;
            default:
                throw new Error('unhandled : ' + me.type);
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
    partOrDefault: function (type) {
        var me = this;
        var part = me.part(type)
        return part ? part.val : null;
    },
    part: function (type) {
        var me = this;
        return me.parts.first(function (x) { return x.type === type; });
    },
    /**
     * Swaps the part from the mark.
     ***/
    swap: function (mark, exp) {
        var me = this,
            marks = me.getMarks();
        var parts = me.getParts()
        if (marks[mark]) {
            var parent = marks[mark].parent();
            var part = parent.remove(marks[mark]).first();
            exp.mark(mark);
            parent.addPart(part.type, exp);
        }

    },
    /**
     * @private
     */
    orderParts: function (a, b) {
        var order = {
            variable: 0,
            ln: 8,
            integral: 10,
            addition: 5,
            power: 5,
            limit: 5,
            fraction: 3,
            sin: 5,
            cos: 5,
            tan: 5,
            csc: 5,
            cot: 5,
            sec: 5,
            tan: 5,
            func: 5,
            mod: 5,
            modulo: 5,
            theta: 5,
            subtraction: 5,
            plusminus: 5,
            multiplication: 5,
            division: 5,
            anything: 5
        }

        return (a.val && a.val.type ? order[a.val.type] || 0 : 0) - (b.val && b.val.type ? order[b.val.type] || 0 : 0);
    },
    /**
     * Removes the part.
     * @param {MEPH.math.Expression} part
     * @returns {Array} removed parts.
     **/
    remove: function (part) {
        var me = this;
        return me.getParts().removeWhere(function (x) { return x.val === part; });
    },
    partVal: function (type) {
        var me = this;
        var part = me.part(type);
        if (part) {
            return part.val;
        }
        return null;
    },
    getParts: function () {
        var me = this;
        return me.parts;
    },
    getValues: function () {
        var me = this;
        return me.getParts().select(function (x) { return x.val; });
    },
    initialize: function (type) {
        var me = this;
        me.expression = {
        };
        me.dependencies = [];
        me.parts = [];
    },
    /**
     * Matches an expression to a rule.
     * @param {MEPH.math.Expression} rule
     * @return {Boolean}
     **/
    match: function (rule, markRule) {
        var me = this;
        if (me.type === rule.type && rule.dependenciesAreRespected(me)) {
            var meParts = me.getParts().select();
            var ruleParts = rule.getParts().select();

            var matchParts = function (ruleParts, x) {
                var first = ruleParts.first(function (y) {
                    if (y.type !== x.type) {
                        return false;
                    }
                    if (y.val && x.val && y.val.equals && x.val.equals) {
                        return x.val.match(y.val, markRule);
                    }
                    else if (y.val && !x.val || !y.val && x.val) {
                        return false;
                    }
                    else {
                        return true
                    }
                });
                if (first) {
                    ruleParts.removeFirstWhere(function (t) { return t === first; });
                    return first;
                }
                else return false;
            };
            if (rule.repeat) {
                var repeatedparts = [].interpolate(0, me.getParts().length, function () {
                    return rule.parts.first();
                });
                meParts.foreach(matchParts.bind(me, repeatedparts));
                if (repeatedparts.length === 0) {
                    if (markRule) {
                        me.mark(rule.mark());
                    }
                    me.repeat = rule.repeat;

                    return true;
                }
                return false;
            }
            else if (rule.part(Expression.type.anything)) {

                ruleParts = rule.getParts().select().where(function (x) {
                    return x.type === Expression.type.anything;
                });

                meParts.foreach(matchParts.bind(me, ruleParts));
                if (ruleParts.length === 0) {
                    if (markRule) {
                        me.mark(rule.mark());
                    }
                    return true;
                }
                return false;
            }
            else {
                if (meParts.length !== ruleParts.length) {
                    return false;
                }
                meParts.foreach(matchParts.bind(me, ruleParts));
                if (ruleParts.length > 0) {
                    return false;
                }
                if (markRule) {
                    me.mark(rule.mark());
                }

                return true;
            }
        }
        else if (rule.type === Expression.type.anything && rule.dependenciesAreRespected(me)) {
            if (markRule) {
                me.mark(rule.mark());
            }
            return true;
        }

        return false;
    },
    /**
     * Returns true if the equation are equal
     * @param {Object} options
     * @param {Boolean} options.formEquals
     */
    equals: function (expression, options) {
        var me = this;
        options = options || { formEquals: true, exact: false };

        if (me.type === expression.type) {
            var meparts = me.getParts().select();
            var expparts = expression.getParts().select(function (x) { return x; });
            if (meparts.length !== expparts.length) return false;
            meparts.foreach(function (x) {
                var first = expparts.first(function (y) {
                    if (y.type !== x.type) {
                        return false;
                    }
                    if (y.val && x.val && y.val.equals && x.val.equals) {
                        return y.val.equals(x.val, options);
                    }
                    else if (y.val && !x.val || !y.val && x.val) {
                        return false;
                    }
                    else {
                        if (options.exact) {
                            if (isNaN(x.val) && isNaN(y.val)) {
                                return x.val === y.val;
                            }
                            else {
                                return parseFloat(x.val) === parseFloat(y.val);
                            }
                        }
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