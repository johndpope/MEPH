﻿/**
 * @class MEPH.math.Util
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.Util', {
    statics: {
        cachedPrimes: null,
        sec: function (num) {
            return 1 / Math.cos(num);
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
        }
    }
}).then(function (x) {
    if (!Math.sec) {
        Math.sec = MEPH.math.Util.sec;
    }
});;