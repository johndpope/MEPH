MEPH.define('MEPH.math.Expression', {
    alternateNames: 'Expression',
    statics: {
        type: {
            variable: 'variable',
            integral: 'integral'
        },
        'function': {
            start: 'start',
            end: 'end',
            respectTo: 'respectTo'
        },
        variable: function (variable) {
            var expression = new Expression();
            expression.setExp(Expression.type.variable, variable);
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
        me.parts.push({ type: type, val: val });
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