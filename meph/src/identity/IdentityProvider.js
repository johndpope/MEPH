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
    getProviders: function () {
        var me = this;
        return me.$registeredProviders;
    },
    getNameSources: function (observableArray) {
        var me = this;
        return me.ready().then(function (registeredProviders) {
            return registeredProviders.select(function (obj) {
                return obj.p.property('name');
            });
        }).then(function (promises) {
            promises.foreach(function (promise) {
                promise.then(function (obj) {
                    observableArray.removeWhere(function (x) {
                        return x.provider === obj.provider;
                    });
                    if (obj.value !== null && obj.value !== undefined) {
                        obj.label = obj.value + ' (' + obj.type + ')';
                        observableArray.push(obj);
                    }
                })
            })
        });
    },
    ready: function () {
        var me = this;
        me.promise = me.promise.then(function (t) {
            if (me.isReady) {
                return me.$registeredProviders;
            }
            return Promise.all(me.providers.select(function (provider) {
                return MEPH.create(provider.type).then(function ($class) {
                    var p = new $class(provider.args);
                    return p.ready().then(function (key) {
                        return {
                            p: p,
                            type: provider.type,
                            key: key
                        };
                    });
                })
            }));
        }).then(function (providers) {
            me.$registeredProviders = providers;
            me.isReady = true;
            me.fire('isready', { isready: true })
            return me.$registeredProviders;
        });
        return me.promise;
    }
})