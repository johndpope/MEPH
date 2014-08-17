﻿/**
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
            }
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

            if (transform.repeat) {
                for (var i in transform.repeat) {
                    var a_repeat = a_marks[i];
                    var b_repeat = b_marks[transform.repeat[i]];
                    var repeatPartsA = a_repeat.getRepeatParts();
                }
            }
            for (var i in transform) {
                if (i !== 'transformation') {
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
                    b_copy.swap(bi, a_copy.getMark(ai));
                }
            }
            return b_copy;
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