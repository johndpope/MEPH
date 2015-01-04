/**
 * @class MEPH.mobile.providers.identity.LinkedInProvider
 * @extend MEPH.mobile.providers.identity.IdentityProvider
 * A base class for the LinkedIn identity providers.
 */
MEPH.define('MEPH.mobile.providers.identity.LinkedInProvider', {
    extend: 'MEPH.mobile.providers.identity.IdentityProvider',
    alternateNames: ['LinkedInProvider'],
    properties: {
        isReady: false,
        $providerpromise: null,
        $response: null
    },
    statics: {
        key: 'linkedin',
    },
    initialize: function (args) {
        var me = this;
        me.args = args;
        me.$providerpromise = Promise.resolve();
    },
    contacts: function () {
        throw new Error('Not implemented.')
    },
    property: function () {
        throw new Error('Not implemented');
    },
    contact: function () {
        throw new Error('Not implemented');
    },
    online: function () {

        throw new Error('Not implemented');
    },
    login: function () {
        var me = this;
        if (!IN.User.isAuthorized()) {
            me.$providerpromise = me.$providerpromise.then(function () {
                return new Promise(function (resolve) {
                    
                    var ref = MEPH.subscribe(Connection.constant.Constants.ProviderStatusChange, function (type, res) {
                        debugger
                        IN.API.Profile("me")
                            .fields(["id", "firstName", "lastName", "pictureUrl", "publicProfileUrl"])
                            .result(function (result) {
                                resolve(res.online);
                            })
                            .error(function (err) {
                                resolve(false);
                            });
                        MEPH.unsubscribe(ref);
                    })
                    IN.UI.Authorize().place();
                });
            });
            return me.$providerpromise;
        }
        else {
            return Promise.resolve().then(function () {
                return new Promise(function (resolve) {
                    IN.API.Profile("me")
                           .fields(["id", "firstName", "lastName", "pictureUrl", "publicProfileUrl"])
                           .result(function (result) {
                               resolve(true);
                           })
                           .error(function (err) {
                               resolve(false);
                           });
                })
            })
        }
    },
    $online: function () {

        throw new Error('Not implemented');
    },
    ready: function () {
        var me = this;
        me.$providerpromise = me.$providerpromise.then(function () {
            if (me.libraryloaded) {
                return LinkedInProvider.key;
            }
            return new Promise(function (resolve) {

                //  <script type="text/javascript" src="http://platform.linkedin.com/in.js">
                //      api_key:    [API_KEY]
                //  onLoad:     [ONLOAD]
                //  authorize:  [AUTHORIZE]
                //  lang:       [LANG_LOCALE]
                //</script>
                window.OnLinkedInProviderLoad = function () {
                    IN.Event.on(IN, "auth", function () {
                        //IN.API.Profile("me")
                        //    .fields(["id", "firstName", "lastName", "pictureUrl", "publicProfileUrl"])
                        //    .result(function (result) {
                        //        resolve(true);
                        //    })
                        //    .error(function (err) {
                        //        resolve(false);
                        //    });
                        MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                            provider: me,
                            online: true
                        });
                    });
                    IN.Event.on(IN, "logout", function () {
                        MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                            provider: me,
                            online: false
                        });
                    });
                    resolve(LinkedInProvider.key);
                    me.libraryloaded = true;
                };
                //window.LinkedInProviderCallback = function (response) {
                //    IN.init({
                //        onLoad: "OnLinkedInProviderLoad"
                //        // any other parameters you'd normally put beneath the script element would be here
                //    });
                //    resolve(LinkedInProvider.key);
                //    me.libraryloaded = true;
                //}

                var file = 'http://platform.linkedin.com/in.js?async=true';
                MEPH.loadJSCssFile(file, '.js', function () {
                    IN.init({
                        onLoad: "OnLinkedInProviderLoad"
                        // any other parameters you'd normally put beneath the script element would be here
                    });
                }, null
                ,
                ['api_key: ' + me.args['API Key'],
                    'onLoad: LinkedInProviderCallback',
                'authorize: true'].join('\r\n')
                );
            });
        });
        return me.$providerpromise;
    }
});