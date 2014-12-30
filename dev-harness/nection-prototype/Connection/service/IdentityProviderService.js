MEPH.define('Connection.service.IdentityProviderService', {
    injections: ['identityProvider'],
    properties: {
        providers: null,
        $promise: null
    },
    requires: ['MEPH.mixins.Injections'],
    mixins: {
        injectable: 'MEPH.mixins.Injections'
    },
    initialize: function () {
        var me = this;
        me.$promise = Promise.resolve();
        me.mixins.injectable.init.apply(me);
        me.providers = [{ type: 'facebook', name: 'Facebook', $iconclass: 'facebook' },
        { type: 'google', name: 'Google', $iconclass: 'google-plus' },
        { type: 'twitter', name: 'Twitter', $iconclass: 'twitter' },
        { type: 'paypal', name: 'Paypal' },
        { type: 'yahoo', name: 'Yahoo', $iconclass: 'yahoo' },
        { type: 'linkedin', name: 'LinkedIn', $iconclass: 'linkedin' },
        { type: 'microsoft account', name: 'Microsoft Account', $iconclass: 'microsoft' },
        { type: 'salesforce', name: 'Salesforce' },
        { type: 'foursquare', name: 'Foursquare', $iconclass: 'foursquare' },
        { type: 'amazon', name: 'Amazon' },
        { type: 'disqus', name: 'Disqus' },
        { type: 'instagram', name: 'Instagram', $iconclass: 'instagram' },
        { type: 'github', name: 'Github', $iconclass: 'github' },
        { type: 'bitbucket', name: 'Bitbucket', $iconclass: 'bitbucket' },
        { type: 'pinterest', name: 'Pinterest', $iconclass: 'pinterest' },
        { type: 'mixi', name: 'Mixi' },
        { type: 'mydigipass', name: 'MYDIGIPASS' },
        { type: 'renren', name: 'Renren' },
        { type: 'sinawelbo', name: 'Sin Welbo' },
        { type: 'soundcloud', name: 'Soundcloud', $iconclass: 'soundcloud' },
        { type: 'tumblr', name: 'Tumblr', $iconclass: 'tumblr' },
        { type: 'vk', name: 'VK', $iconclass: 'vk' },
        { type: 'xing', name: 'Xing' },
        { type: 'tencentweibo', name: 'Tencent Weibo' },
        { type: 'qq', name: 'QQ' },
        { type: 'aol', name: 'AOL' },
        { type: 'blogger', name: 'Blogger' },
        { type: 'flickr', name: 'Flickr', $iconclass: 'flickr' },
        { type: 'reddit', name: 'Reddit', $iconclass: 'reddit' },
        { type: 'livejournal', name: 'LiveJournal' },
        { type: 'netlog', name: 'Netlog' },
        { type: 'openid', name: 'OpenID', $iconclass: 'openid' },
        { type: 'verisign', name: 'Verisign' },
        { type: 'wordpress', name: 'WordPress' }]
            .where(function (x) { return x.$iconclass; })
        .select(function (x) {
            var te = x.$iconclass;
            x.online = false;
            x.using = false;
            x.retrieving = false;
            x.error = '';
            x.$iconclass = 'fa fa-' + te;
            x.$btnclass = 'btn btn-block btn-social btn-' + te;
            MEPH.util.Observable.observable(x);
            return x;
        });
    },
    onInjectionsComplete: function () {
        var me = this, identityProvider;
        return me.updateProviders();
    },
    updateProviders: function () {
        var me = this;
        if (me.$inj && me.$inj.identityProvider) {
            identityProvider = me.$inj.identityProvider;
            me.$promise = me.$promise.then(function () {
                return identityProvider.ready().then(function () {
                    var providers = identityProvider.getProviders();
                    // Nice flutter effect for testing .
                    //me.providers.foreach(function (prov) {
                    //    setInterval(function (prov) {
                    //        prov.online = !prov.online;
                    //    }.bind(me, prov), Math.random() * 10000 + 2000);
                    //})
                    return Promise.all(providers.select(function (obj) {
                        var prov = me.providers.first(function (x) { return x.type === obj.key; });
                        if (prov) {
                            return obj.p.online().then(function (online) {
                                prov.online = online;
                            })
                        }
                    }).where());
                });
            });
        }
    },
    getIdentityProviders: function () {
        var me = this;
        return Promise.resolve().then(function () {
            return me.providers.select(function (x) { return x; });
        })
    }
});