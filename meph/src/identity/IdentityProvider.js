/**
 * @class MEPH.identity.IdentityProvider
 **/
MEPH.define('MEPH.identity.IdentityProvider', {
    requires: [],
    properties: {
        promise: null,
        $registeredProviders: null,
        options: null,
        providers: null,
        isReady: false
    },
    initialize: function (options) {
        var me = this;
        MEPH.Events(me);
        me.providers = options.providers;
        me.promise = Promise.resolve();
    },
    getProviders: function(){
        var me = this;
        return me.$registeredProviders;
    },
    ready: function () {
        var me = this;
        return me.promise.then(function (t) {
            return Promise.all(me.providers.select(function (provider) {
                return MEPH.create(provider.type).then(function ($class) {
                    var p = new $class(provider.args);
                    return p.ready().then(function () {
                        return {
                            p: p,
                            type: provider.type
                        };
                    });
                })
            }));
        }).then(function (providers) {
            me.$registeredProviders = providers;
            me.isReady = true;
            me.fire('isready', { isready: true })
        });
    }
})