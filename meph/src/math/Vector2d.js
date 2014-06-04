﻿
MEPH.define('MEPH.math.Vector2d', {
    alternateNames: 'Vector2d',
    statics: {
        Id: 0,
        Create: function (obj) {
            if (Array.isArray(obj) || obj instanceof J3DIVector3) {
                return new Vector2d(obj[0], obj[1], obj[2]);
            }
            return new Vector2d(obj.x, obj.y, obj.z);
        },
        Lerp: function (thrustAmount, to, percentage) {
            return thrustAmount + (to - thrustAmount) * percentage;
        },
        Lerp2D: function (vect1, vect2, percentage) {
            return new Vector2d(Vector2d.Lerp(vect1._x, vect2._x, percentage), Vector2d.Lerp(vect1._y, vect2._y, percentage))
        },
        Lerp3D: function (vect1, vect2, percentage) {
            return new Vector2d(Vector2d.Lerp(vect1._x, vect2._x, percentage), Vector2d.Lerp(vect1._y, vect2._y, percentage), Vector2d.Lerp(vect1._z, vect2._z, percentage))
        }
    },
    initialize: function (x, y, z, useBinaryHeap) {
        if (useBinaryHeap)
            this._id = Vector2d.Id++;
        if (arguments.length > 0) {
            this._x = x;
            this._y = y;
            this._z = 0;
            if (z != undefined)
                this._z = z;
            if (useBinaryHeap)
                this._adjacentEdges = new BinaryHeap(function (node) {
                    return node.length();
                });
        }
        Object.defineProperty(this, 'x', {
            get: function () {
                return this._x;
            }
        });
        Object.defineProperty(this, 'y', {
            get: function () {
                return this._y;
            }
        });
        Object.defineProperty(this, 'z', {
            get: function () {
                return this._z;
            }
        });
    },
    ToDebug: function () { return "x : " + this._x + "y : " + this._y + "z : " + this._z },
    equals: function (that) {
        if (this._x == that._x && this._y == that._y)
            return true;
        return false;
    },
    equals3d: function (that) {
        if (this._x == that._x && this._y == that._y && this._z == that._z)
            return true;
        return false;
    },
    get_id: function () { return this._id; },
    copy: function () {
        return new Vector2d(this._x, this._y, this._z);
    },

    destroy: function (edge) {
        this.remove_adjacentEdge(edge);
    },
    consume: function (that) {
        while (that.get_adjacentEdges().size() > 0) {
            var edge = that.get_adjacentEdges().pop();
            edge.swapVertex(that, this);
            this.add_adjacentEdge(edge);
        }
    },
    add_adjacentEdge: function (edge) {
        this._adjacentEdges.push(edge);
    },
    get_adjacentEdges: function () {
        return this._adjacentEdges;
    },
    remove_adjacentEdge: function (edge) {
        this._adjacentEdges.remove(edge);
    },
    reset: function () {
        this._adjacentEdges.clear();
    },
    length: function () {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    },
    distance: function (that) {
        var x = this._x - that._x;
        var y = this._y - that._y;
        return Math.sqrt(x * x + y * y);
    },
    distanceSquared: function (that) {
        var x = this._x - that._x;
        var y = this._y - that._y;
        var v = Math.sqrt(x * x + y * y);
        return v * v;
    },
    set: function (x, y, z) {
        this.setX(x);
        this.setY(y);
        this.setZ(z);
    },
    setZ: function (z) {
        this._z = z;
    },
    setY: function (y) {
        this._y = y;
    },
    setX: function (x) {
        this._x = x;
    },
    setXY: function (x, y) {
        this.setX(x);
        this.setY(y);
    },
    dot: function (that) {
        return this._x * that._x + this._y * that._y;
    },
    cross: function (that) {
        return this._x * that._y - this._y * that._x;
    },
    unit: function () {
        return this.divide(this.length());
    },
    getVectorOfLength: function (length) {
        return this.divide(this.length() / length);
    },
    unitEquals: function () {
        this.divideEquals(this.length());

        return this;
    },
    add: function (that) {
        return new Vector2d(this._x + that._x, this._y + that._y, this._z + that._z);
    },
    addEquals: function (that) {
        this._x += that._x;
        this._y += that._y;

        return this;
    },
    subtract: function (that) {
        return new Vector2d(this._x - that._x, this._y - that._y, this._z - that._z);
    },
    subtractEquals: function (that) {
        this._x -= that._x;
        this._y -= that._y;
        return this;
    },
    mapdivide: function (that) {
        return new Vector2d(this._x / that._x, this._y / that._y);
    },
    mapmultiply: function (that) {
        return new Vector2d(this._x * that._x, this._y * that._y);
    },
    square: function () {
        return this._x * this._x + this._y * this._y;
    },
    multiply: function (scalar) {
        return new Vector2d(this._x * scalar, this._y * scalar);
    },
    multiplyEquals: function (scalar) {
        this._x *= scalar;
        this._y *= scalar;
        return this;
    },
    divide: function (scalar) {
        if (scalar == 0) {
            return new Vector2d(0, 0);
        }
        return new Vector2d(this._x / scalar, this._y / scalar);
    },
    divideEquals: function (scalar) {
        this._x /= scalar;
        this._y /= scalar;
        return this;
    },
    perp: function () {
        return new Vector2d(-this._y, this._x);
    },
    perpendicular: function (that) {
        return this.subtract(this.project(that));
    },
    project: function (that) {
        var percent = this.dot(that) / that.dot(that);

        return that.multiply(percent);
    },
    toString: function () {
        return this._x + "," + this._y;
    },
    fromPoints: function (p1, p2) {
        return new Vector2D(
        p2.x - p1.x,
        p2.y - p1.y);
    },
    angleBetween: function (that) {
        return Math.acos(this.dot(that) / (this.length() * that.length()));
    },
    rotate: function (angle) {
        var ca = Math.cos(angle);
        var sa = Math.sin(angle);
        var rx = this._x * ca - this._y * sa;
        var ry = this._x * sa + this._y * ca;
        return new Vector2d(rx, ry);
    },
    random: function () {
        return new Vector2d(2 * (Math.random() - .5), 2 * (Math.random() - .5));
    }
}).then(function () {

    $v2 = Vector2d;
    Vector2d.Zero = new Vector2d(0, 0, 0);
});