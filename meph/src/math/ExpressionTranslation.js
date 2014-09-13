/**
 * @class MEPH.math.ExpressionTranslation
 *
 **/
MEPH.define('MEPH.math.ExpressionTranslation', {
    alternateNames: 'ExpressionTranslation',
    statics: {
        translate: function (a, b) {
            switch (a.name()) {
                case Expression.RuleType.IntegralConst:
                    return ExpressionTranslation.translateIntegralConst(a, b);
                case Expression.RuleType.IntegralConstMultiply:
                    return ExpressionTranslation.translateIntegralConstMultiply(a, b);
                case Expression.RuleType.Power:
                case Expression.RuleType.PowerIntegrate:
                    return ExpressionTranslation.translatePowerIntegrate(a, b);
                case Expression.RuleType.IntegrationAddition:
                    return ExpressionTranslation.translateIntegrationAddition(a, b);
                case Expression.RuleType.IntegrationByParts:
                    return ExpressionTranslation.translateIntegrationByParts(a, b);
                case Expression.RuleType.OneOverX:
                    return ExpressionTranslation.translateOneOverX(a, b);
                case Expression.RuleType.GeneralFormula8A:
                case Expression.RuleType.GeneralFormula8B:
                    return ExpressionTranslation.translateGeneralFormula8(a, b);
                case Expression.RuleType.GeneralFormula9A:
                case Expression.RuleType.GeneralFormula9B:
                    return ExpressionTranslation.translateGeneralFormula9(a, b);
                case Expression.RuleType.TrigonometricFormula10A:
                case Expression.RuleType.TrigonometricFormula10B:
                    return ExpressionTranslation.translateGeneralFormula10(a, b);
                case Expression.RuleType.TrigonometricFormula11A:
                case Expression.RuleType.TrigonometricFormula11B:
                    return ExpressionTranslation.translateGeneralFormula11(a, b);
                case Expression.RuleType.Derivation.GeneralFormula1a:
                case Expression.RuleType.Derivation.GeneralFormula1b:
                    return ExpressionTranslation.derivation.translateGeneralFormula1(a, b);
                case Expression.RuleType.Derivation.GeneralFormula2a:
                case Expression.RuleType.Derivation.GeneralFormula2b:
                    return ExpressionTranslation.derivation.translateGeneralFormula2(a, b);
                case Expression.RuleType.Derivation.GeneralFormula3a:
                case Expression.RuleType.Derivation.GeneralFormula3b:
                    return ExpressionTranslation.derivation.translateGeneralFormula3(a, b);
            }
        },
        /**
         * Returns an array of translation sets.
         * @returns {Array}
         ***/
        translationPool: function () {
            var res = [];

            //Integration
            res.push([Expression.RuleType.IntegralConst, Expression.RuleType.AxPlusC]);
            res.push([Expression.RuleType.IntegralConstMultiply, Expression.RuleType.MultiplyIntegralofFx]);
            res.push([Expression.RuleType.PowerIntegrate, Expression.RuleType.Power]);
            res.push([Expression.RuleType.IntegrationAddition, Expression.RuleType.AdditionIntegral]);

            //Derivatives
            res.push([Expression.RuleType.Derivation.GeneralFormula1a, Expression.RuleType.Derivation.GeneralFormula1b]);
            res.push([Expression.RuleType.Derivation.GeneralFormula2a, Expression.RuleType.Derivation.GeneralFormula2b]);
            res.push([Expression.RuleType.Derivation.GeneralFormula3a, Expression.RuleType.Derivation.GeneralFormula3b]);

            return res;
        },
        /**
         * Transforms a expression a in to expression b
         * @param {Object} transform
         * @param {MEPH.math.Expression} a
         * @param {MEPH.math.Expression} b
         */

        transform: function (transform, a, b) {
            var a_copy = a.copy();
            var b_copy = b.copy();
            var a_marks = a_copy.getMarks();
            var b_marks = b_copy.getMarks();
            var tranformedRepeats;
            if (transform.repeat) {

                for (var i in transform.repeat) {
                    var transFormInfo = transform.repeat[i];
                    if (transFormInfo.trans) {
                        var a_repeat = a_marks[i];
                        var b_repeat = b_marks[transFormInfo.target];
                        var repeatPartsA = a_repeat.getRepeatParts();
                        var repeatPartsB = b_repeat.getRepeatParts();

                        if (repeatPartsB.length > 1) {
                            throw 'not handled';
                        }
                        else {
                            tranformedRepeats = repeatPartsA.select(function (a) {
                                var tempA = a.val.copy();
                                return ExpressionTranslation.transform(transFormInfo.trans, tempA, repeatPartsB.first().val);
                            });
                        }
                    }
                    else if (transFormInfo.scatter) {
                        tranformedRepeats = tranformedRepeats.select(function (x) {
                            a_copy = a_copy.copy();
                            return ExpressionTranslation.transform(transFormInfo.scatter, a_copy, x);
                        });
                    }
                }
                b_copy.getMark(transform.transform.to).clearParts();
                b_copy.getMark(transform.transform.to).setParts(tranformedRepeats, Expression.function.input);
                return b_copy;
            }
            else {
                for (var i in transform) {
                    if (i !== 'transformation' && i !== 'repeat') {
                        var ai;
                        var bi;
                        if (transform.transformation.from === a.name()) {
                            ai = i;
                            bi = transform[i];
                        }
                        else {
                            ai = transform[i];
                            bi = i;
                        }
                        a_copy = a.copy();
                        var a_mark = a_copy.getMark(ai);
                        if (Array.isArray(a_mark)) {
                            a_mark = ExpressionTranslation.convertSiblingsToAnExpression(a_mark);
                        }
                        b_copy.swap(bi, a_mark);

                        if (b_copy === b_copy.getMark(bi)) {
                            b_copy = a_mark;
                        }
                    }
                }
                return b_copy;
            }
        },
        /**
         * Convers siblings to an expression of the same type as the parent.
         * @param {Array} siblings
         ***/
        convertSiblingsToAnExpression: function (siblings) {
            var sibling = siblings.first();
            var parent = sibling.parent();
            switch (parent.type) {
                case Expression.type.multiplication:
                    return Expression.multiplication.apply(this, siblings);
                case Expression.type.subtraction:
                    return Expression.subtraction.apply(this, siblings);
                case Expression.type.addition:
                    return Expression.addition.apply(this, siblings);
                case Expression.type.division:
                    return Expression.division.apply(this, siblings);
            }
        },

        derivation: {

            translateGeneralFormula1: function (a, b) {
                var transformation = {
                    transformation: {
                        from: Expression.RuleType.Derivation.GeneralFormula1a,
                        to: Expression.RuleType.Derivation.GeneralFormula1b
                    }
                };
                var result = Expression.translation.Transform(transformation, a, b);
                return result;
            },
            translateGeneralFormula2: function (a, b) {

                var transformation = {
                    transformation: {
                        from: Expression.RuleType.Derivation.GeneralFormula2a,
                        to: Expression.RuleType.Derivation.GeneralFormula2b
                    },
                    C: 'C'
                };
                var result = Expression.translation.Transform(transformation, a, b);
                return result;

            },
            translateGeneralFormula3: function (a, b) {
                var transformation = {
                    transformation: {
                        from: Expression.RuleType.Derivation.GeneralFormula3a,
                        to: Expression.RuleType.Derivation.GeneralFormula3b
                    },
                    C: 'C',
                    U: 'U',
                    dx: 'dx'
                };
                var result = Expression.translation.Transform(transformation, a, b);
                return result;
            }
        },
        translateGeneralFormula8: function (a, b) {

            var transformation = {
                transformation: {
                    from: Expression.RuleType.GeneralFormula8B,
                    to: Expression.RuleType.GeneralFormula8A
                },
                x: 'x',
                a_tan: 'a',
                a: 'a'
            };
            var result = Expression.translation.Transform(transformation, a, b);
            return result;
        },
        translateGeneralFormula11: function (a, b) {
            var transformation = {
                transformation: {
                    from: Expression.RuleType.GeneralFormula11A,
                    to: Expression.RuleType.GeneralFormula11B
                },
                x: 'x',
            };
            var result = Expression.translation.Transform(transformation, a, b);
            return result;
        },
        translateGeneralFormula10: function (a, b) {
            var transformation = {
                transformation: {
                    from: Expression.RuleType.GeneralFormula10B,
                    to: Expression.RuleType.GeneralFormula10A
                },
                x: 'x',
            };
            var result = Expression.translation.Transform(transformation, a, b);
            return result;

        },
        translateGeneralFormula9: function (a, b) {
            var transformation = {
                transformation: {
                    from: Expression.RuleType.GeneralFormula9B,
                    to: Expression.RuleType.GeneralFormula9A
                },
                x1: 'x',
                x2: 'x',
                a1: 'a',
                a2: 'a',
                a3: 'a'
            };
            var result = Expression.translation.Transform(transformation, a, b);
            return result;

        },
        translateOneOverX: function (a, b) {
            var transformation = {
                transformation: {
                    from: Expression.RuleType.OneOverX,
                    to: Expression.RuleType.NaturalLogAbsX
                },
                x: 'x'
            };

            var result = Expression.translation.Transform(transformation, a, b);
            return result;
        },
        translateIntegrationByParts: function (a, b) {
            var transformation = {
                transformation: {
                    from: Expression.RuleType.IntegraionByPartsComplete,
                    to: Expression.RuleType.IntegrationByParts
                },
                v_2: 'dv',
                v_1: 'dv',
                u_1: 'du',
                u_2: 'du'
            };

            var result = Expression.translation.Transform(transformation, a, b);

            return result;
        },
        translateIntegrationAddition: function (a, b) {
            switch (b.name()) {
                case Expression.RuleType.AdditionIntegral:
                    var transformation = {
                        repeat: {
                            A: {
                                target: 'A',

                                trans: {
                                    transformation: {
                                        from: Expression.RuleType.IntegrationAddition,
                                        to: Expression.RuleType.AdditionIntegral
                                    },
                                    f: 'f'
                                }
                            },
                            dx: {
                                scatter: {
                                    transformation: {
                                        from: Expression.RuleType.IntegrationAddition,
                                        to: Expression.RuleType.AdditionIntegral
                                    },
                                    dx: 'dx'
                                }
                            }
                        },
                        transform: {
                            from: 'A',
                            to: 'A'
                        }
                    };
                    var result = Expression.translation.Transform(transformation, a, b);

                    return result;
            }
        },
        translateIntegralConst: function (a, b) {
            a = a.copy();
            b = b.copy();
            var a_marks = a.getMarks();
            var result = b.copy();
            var b_marks = result.getMarks();
            switch (b.name()) {
                case Expression.RuleType.AxPlusC:
                    var transformation = {
                        transformation: {
                            from: Expression.RuleType.IntegralConst,
                            to: Expression.RuleType.AxPlusC
                        },
                        C: 'A',
                        dx: 'x'
                    };
                    return Expression.translation.Transform(transformation, a, b);
                default: return null;
            }
        },
        translateIntegralConst: function (a, b) {
            a = a.copy();
            b = b.copy();
            var a_marks = a.getMarks();
            var result = b.copy();
            var b_marks = result.getMarks();
            switch (b.name()) {
                case Expression.RuleType.AxPlusC:
                    var transformation = {
                        transformation: {
                            from: Expression.RuleType.IntegralConst,
                            to: Expression.RuleType.AxPlusC
                        },
                        C: 'A',
                        dx: 'x'
                    };
                    return Expression.translation.Transform(transformation, a, b);
                default: return null;
            }
        },
        /**
         * Translates the IntegralConstMultiply
         * @param {MEPH.math.Expression} a
         * @param {MEPH.math.Expression} b
         * @return {MEPH.math.Expression}
         **/
        translateIntegralConstMultiply: function (a, b) {
            a = a.copy();
            b = b.copy();
            var a_marks = a.getMarks();
            var result = b.copy();
            var b_marks = result.getMarks();
            switch (b.name()) {
                case Expression.RuleType.MultiplyIntegralofFx:
                    var transformation = {
                        transformation: {
                            from: Expression.RuleType.IntegralConstMultiply,
                            to: Expression.RuleType.MultiplyIntegralofFx
                        },
                        C: 'C',
                        A: 'A'
                    };
                    return Expression.translation.Transform(transformation, a, b);
                default: return null;
            }
        },
        /**
      * Translates the PowerIntegrate
      * @param {MEPH.math.Expression} a
      * @param {MEPH.math.Expression} b
      * @return {MEPH.math.Expression}
      **/
        translatePowerIntegrate: function (a, b) {
            var name = a.name();
            if (Expression.RuleType.PowerIntegrate !== a.name()) {
                name = b.name();
            }
            a = a.copy();
            b = b.copy();
            var a_marks = a.getMarks();
            var result = b.copy();
            var b_marks = result.getMarks();
            switch (name) {
                case Expression.RuleType.PowerIntegrate:
                case Expression.RuleType.Power:
                    var transformation = {
                        transformation: {
                            from: Expression.RuleType.PowerIntegrate,
                            to: Expression.RuleType.Power
                        },
                        n_pre: 'n',
                        n_post: 'n',
                        x: 'x'
                    };
                    return Expression.translation.Transform(transformation, a, b);
                default: return null;
            }
        }
    }
});