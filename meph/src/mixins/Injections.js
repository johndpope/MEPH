/* @class
* Reads controls from the dom which should be created, and associated with there js objects. 
**/
MEPH.define('MEPH.mixins.Injections', {
    requires: ['MEPH.mobile.services.MobileServices'],
    statics: {
        injectFunctions: {
            onInjectionsComplete: function () {
            },
        }
    },
    init: function () {
        var me = this,
           i,
           referrerFunctions = MEPH.mixins.Injections.injectFunctions;

        for (i in referrerFunctions) {
            me[i] = referrerFunctions[i].bind(me);
        }

        if (me.injections) {
            me.$inj = {};
            Promise.all(me.injections.select(function (injection) {
                return MEPH.MobileServices.get(injection).then(function (provider) {
                    me.$inj[injection] = provider;
                });
            })).then(function () {
                me.onInjectionsComplete();
            });
        }
    }
});