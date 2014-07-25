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
    }
});