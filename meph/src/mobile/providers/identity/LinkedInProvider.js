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
        maxWaitTime: 10000,
        key: 'linkedin',
    },
    initialize: function (args) {
        var me = this;
        me.args = args;
        me.$providerpromise = Promise.resolve();
    },
    contacts: function () {
        return Promise.resolve().then(function () {
            return [];
        });
    },
    property: function (prop) {
        var me = this;
        me.$providerpromise = me.$providerpromise.then(function () {
            return new Promise(function (resolve, f) {
                if (me.cachedResponse) {
                    resolve(me.cachedResponse);
                }
                var $timeout = setTimeout(function () {
                    resolve(null);
                }, LinkedInProvider.maxWaitTime);
                me.contact().then(function (response) {
                    clearTimeout($timeout);
                    resolve(response);
                });

            }).then(function (response) {
                var val = null;
                if (response) {

                    switch (prop) {
                        case 'headline':
                            val = response.headline;;
                            break;
                        case 'name':
                            val = response.firstName + ' ' + response.lastName;
                            break;
                        case 'gender':
                            break;
                        case 'link':
                            break;
                        case 'profileimage':
                            val = response.pictureUrl;
                            break;
                        case 'occupation': 
                            break;
                        case 'skills':
                            if (response.skills && response.skills.values)
                                val = response.skills.values.select(function (skill) { return skill.skill.name }).join();
                            break;
                        case 'url':
                            break;
                    }
                }
                return {
                    provider: me,
                    type: LinkedInProvider.key,
                    response: response,
                    value: val
                };
            });
        });
        return me.$providerpromise;
    },
    contact: function () {
        var me = this;
        return new Promise(function (resolve, fail) {
            try {
                IN.API.Profile("me")
                        .fields('skills', 'positions', 'first-name',
                        'picture-url',
                        'last-name', 'three-current-positions', 'three-past-positions',
                        'phone-numbers')
                       .result(function (result) {

                           me.cachedResponse = result.values.first();
                           resolve(me.cachedResponse);
                       })
                       .error(function (err) {
                           resolve(false);
                       });
            }
            catch (e) {
                MEPH.Log(e);
                fail(e);
            }
        });
    },
    online: function () {
        var me = this;
        return me.ready().then(function () {
            return IN.User.isAuthorized();
        })
    },
    login: function () {
        var me = this;
        if (!IN.User.isAuthorized()) {
            me.$providerpromise = me.$providerpromise.then(function () {
                return new Promise(function (resolve) {

                    var ref = MEPH.subscribe(Connection.constant.Constants.ProviderStatusChange, function (type, res) {
                        IN.API.Profile("me")
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
        debugger;
        throw new Error('Not implemented');
    },
    ready: function () {
        var me = this;
        me.$providerpromise = me.$providerpromise.then(function () {
            if (me.libraryloaded) {
                return LinkedInProvider.key;
            }
            return new Promise(function (resolve) {
                window.OnLinkedInProviderLoad = function () {
                    IN.Event.on(IN, "auth", function () {
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
                    me.libraryloaded = true;
                    resolve(LinkedInProvider.key);
                };

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