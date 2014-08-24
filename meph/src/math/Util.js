/**
 * @class MEPH.math.Util
 * Describes mathematical expressions.
 *
 **/
MEPH.define('MEPH.math.Util', {
    statics: {
        factorial: function (num) {
            var result = 1;
            [].interpolate(1, num + 1, function (x) {
                result = result * x;
            });
            return result;
        }
    }
});