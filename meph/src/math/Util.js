/**
 * @class MEPH.math.Util
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.Util', {
    statics: {
        cachedPrimes: null,
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
        }
    }
});