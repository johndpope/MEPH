MEPH.define('MEPH.math.Matrix', {
    alternateNames: 'Matrix',
    requires: ['MEPH.math.Vector'],
    properties: {
        columns: 0,
        rows: 0,
        matrix: null
    },
    initialize: function (rows, cols) {
        var me = this;
        me.columns = cols || me.columns;
        me.rows = rows || me.rows;
        me.matrix = [].interpolate(0, me.rows * me.columns, function () { return 0; });
    },
    set: function (array) {
        var me = this;
        array.foreach(function (x, index) {
            me.matrix[index] = x;
        });
    },
    get: function (row, col) {
        var me = this;
        return me.matrix[(row * me.columns + col)];
    },
    setCell: function (row, col, value) {
        var me = this;
        me.matrix[(row * me.columns + col)] = value;
    },
    row: function (ith) {
        var me = this;
        return new Vector(me.matrix.subset(ith * me.columns, (ith + 1) * me.columns));
    },
    column: function (ith) {
        var me = this;
        return new Vector([].interpolate(0, me.rows, function (x) {
            return me.matrix[x * me.columns + ith];
        }));
    },

    addRow: function (vector) {
        var me = this;
        if (me.columns === 0 && me.rows === 0) {
            vector.vector.foreach(function (x) {
                me.matrix.push(x);
            });
            me.columns = vector.dimensions();
            me.rows++;
        }
        else if (me.rows > 0 && me.columns === vector.dimensions()) {
            vector.vector.foreach(function (x) {
                me.matrix.push(x);
            });
            me.rows++;
        }
    },

    add: function (matrix) {
        var me = this;
        var res = me.matrix.select(function (x, index) {
            return x + matrix.matrix[index];
        });

        var result = new MEPH.math.Matrix(me.rows, me.columns);
        result.set(res);
        return result;
    },
    mul: function (scalar) {
        var me = this,
            result;

        if (typeof (scalar) === 'number') {
            result = me.scalarMul(scalar);
        }
        else {
            result = me.matMul(scalar);
        }
        return result;
    },
    matMul: function (that) {
        var me = this,
            result;

        if (me.columns === that.rows) {
            result = new Matrix(me.rows, that.columns);
            for (var i = me.rows; i--;) {
                var row = me.row(i);
                for (var j = that.columns ; j--;) {
                    var col = that.column(j);
                    result.setCell(i, j, row.dot(col));
                }
            }
        }
        else {
            throw new Error('not a valid matrix multiplication');
        }
        return result;
    },
    scalarMul: function (scalar) {
        var me = this;
        var res = me.matrix.select(function (x, index) {
            return x * scalar;
        });

        var result = new MEPH.math.Matrix(me.rows, me.columns);
        result.set(res);
        return result;
    },
    transpose: function () {
        var me = this;

        var result = new MEPH.math.Matrix(me.columns, me.rows);
        for (var i = 0 ; i < me.columns ; i++) {
            for (var j = 0 ; j < me.rows; j++) {
                result.setCell(i, j, me.get(j, i));
            }
        }
        return result;
    }
});