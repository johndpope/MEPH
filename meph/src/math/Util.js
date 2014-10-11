/**
 * @class MEPH.math.Util
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.Util', {
    statics: {
        cachedPrimes: null,
        polar: function (x, y) {
            return {
                radius: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                theta: Math.atan2(y, x)
            }
        },
        rectangular: function (theta, radius) {
            return {
                x: radius * Math.cos(theta),
                y: radius * Math.sin(theta)
            }
        },
        sec: function (num) {
            return 1 / Math.cos(num);
        },
        csc: function (num) {
            return 1 / Math.sin(num);
        },
        cot: function (num) {
            return 1 / Math.tan(num);
        },
        sinh: function (num) {
            return (Math.exp(num) - Math.exp(-num)) / 2;
        },
        cosh: function (num) {
            return (Math.exp(num) + Math.exp(-num)) / 2;
        },
        tanh: function (x) {
            return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
        },
        sech: function (num) {
            return 1 / MEPH.math.Util.cosh(num);
        },
        coth: function (num) {
            return 1 / MEPH.math.Util.tanh(num);
        },
        csch: function (num) {
            return 1 / MEPH.math.Util.sinh(num);
        },
        /**
         * n mathematics, the factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.
         * http://en.wikipedia.org/wiki/Factorial
         * Calculates the factorial of num.
         **/
        factorial: function (num) {
            var result = 1;
            [].interpolate(1, num + 1, function (x) {
                result = result * x;
            });
            return result;
        },
        /**
         * Returns the primes up to the passed value.
         * @param {Number} val
         **/
        primes: function (val) {
            MEPH.math.Util.cachedPrimes = MEPH.math.Util.cachedPrimes || [2, 3];
            var cachedPrimes = MEPH.math.Util.cachedPrimes;
            var last = MEPH.math.Util.cachedPrimes.last();
            if (last >= val) {
                return MEPH.math.Util.cachedPrimes.where(function (x) { return val >= x; });
            }
            for (var i = last + 2; i <= (val) ; i = i + 2) {
                if (cachedPrimes.all(function (x) { return i % x !== 0; })) {
                    cachedPrimes.push(i);
                }
            }
            return cachedPrimes;
        },
        /**
         * Factors an integer into its basic parts.
         * @param {Number} val
         * @returns {Array}
         **/
        factor: function (val) {
            var Util = MEPH.math.Util,
                result = [1];
            var primes = Util.primes(val);
            var v = val;
            while (!primes.contains(function (x) { return x === v; }) && v % 1 == 0) {
                var prime = primes.first(function (x) { return v % x === 0; });
                result.push(prime);
                v /= prime;
            }
            result.push(v);
            return result;
        },
        window: {
            /**
             * http://en.wikipedia.org/wiki/Window_function#Spectral_analysis
             * Triangular windows are given by: w(n)=1 - \left|\frac{n-\frac{N-1}{2}}{\frac{L}{2}}\right|,
             * where L can be N,[8][16] N+1,[17] or N-1.[18] The last one is also known as Bartlett window. All three definitions converge at large N.
             * The triangular window is the 2nd order B-spline window and can be seen as the convolution of two half-sized rectangular windows, giving it twice the width of the regular windows.
             ****/
            Triangle: function (plus, y, index, end) {
                var L = end + plus;
                var v = 1 - Math.abs(((index - ((end - 1) / 2)) / (L / 2)));
                return y * v;
            },
            Rectangle: function (y, index, end) {
                return y;
            }
        },
        windowjoin: {
            Triangle: function (plus, index, end) {
                var L = end + plus;
                var v = 1 - Math.abs(((index - ((end - 1) / 2)) / (L / 2)));
                return v;
            },
            Rectangle: function (y, index, end) {
                return 1;
            }
        }
    }
}).then(function (x) {
    if (!Math.sec) {
        Math.sec = MEPH.math.Util.sec;
    }
    if (!Math.csc) {
        Math.csc = MEPH.math.Util.csc;
    }
    if (!Math.cot) {
        Math.cot = MEPH.math.Util.cot;
    }
    if (!Math.sinh) {
        Math.sinh = MEPH.math.Util.sinh;
    }
    if (!Math.cosh) {
        Math.cosh = MEPH.math.Util.cosh;
    }
    if (!Math.sech) {
        Math.sech = MEPH.math.Util.sech;
    }
    if (!Math.csch) {
        Math.csch = MEPH.math.Util.csch;
    }
    if (!Math.coth) {
        Math.coth = MEPH.math.Util.coth;
    }
    if (!Math.tanh) {
        Math.tanh = MEPH.math.Util.tanh;
    }
});;