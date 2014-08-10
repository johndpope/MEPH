MEPH.define('MEPH.math.ExpressionTranslation', {
    alternateNames: 'ExpressionTranslation',
    statics: {
        translate: function (a, b) {
            switch (a.name()) {
                case Expression.IntegralConstMultiply:
                    return ExpressionTranslation.translateIntegralConstMultiply(a, b);
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
                    b_copy.swap(bi, a_copy.getMark(ai));
                }
            }
            return b_copy;
        },
        /**
         * Translates the IntegralConstMultiply
         * @param {MEPH.math.Expression} a
         * @param {MEPH.math.Expression} b
         **/
        translateIntegralConstMultiply: function (a, b) {
            a = a.copy();
            b = b.copy();
            var a_marks = a.getMarks();
            var result = b.copy();
            var b_marks = result.getMarks();
            switch (b.name()) {
                case Expression.MultiplyIntegralofFx:

                    break;
                default: return null;
            }
        }
    }
});