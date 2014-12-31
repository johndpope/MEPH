MEPH.define('MEPH.mobile.providers.identity.GooglePlusProvider', {
    alternateNames: ['GooglePlusProvider'],
    extend: 'MEPH.mobile.providers.identity.IdentityProvider',
    statics: {
        key: 'google',
        maxWaitTime: 10000,
        online: function () {
            return new Promise(function (r, f) {
                r(GooglePlusProvider.response ? GooglePlusProvider.response['status']['signed_in'] : false);
            })
        },
        logoff: function (provider) {
            window.open('https://accounts.google.com/logout', "");

            MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                provider: provider,
                online: false
            });
        },
        login: function (provider) {
            return new Promise(function (r, f) {
                var additionalParams = {
                    callback: function (authResult) {
                        GooglePlusProvider.response = authResult;
                        if (authResult['status']['signed_in']) {
                            // Update the app to reflect a signed in user
                            gapi.client.load('plus', 'v1').then(function () {
                                // Hide the sign-in button now that the user is authorized, for example:
                                MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                                    provider: provider,
                                    online: true
                                });
                                r(true);
                            });
                        } else {
                            MEPH.publish(Connection.constant.Constants.ProviderStatusChange, {
                                provider: provider,
                                online: false
                            });
                            // Update the app to reflect a signed out user
                            // Possible error values:
                            //   "user_signed_out" - User is signed-out
                            //   "access_denied" - User denied access to your app
                            //   "immediate_failed" - Could not automatically log in the user
                            r(false);
                        }
                    }
                }
                gapi.auth.signIn(additionalParams);
            })
        },
        init: function (args) {
            return new Promise(function (promiseresponse, f) {
                if (!MEPH.mobile.providers.identity.GooglePlusProvider.initStarted && args && args.clientId) {
                    //<meta name="google-signin-clientid" content="CLIENT_ID" />
                    //<meta name="google-signin-scope" content="https://www.googleapis.com/auth/plus.login" />
                    //<meta name="google-signin-requestvisibleactions" content="http://schema.org/AddAction" />
                    //<meta name="google-signin-cookiepolicy" content="single_host_origin" />

                    var meta = document.createElement('meta');
                    meta.setAttribute('name', 'google-signin-clientid');
                    meta.setAttribute('content', args.clientId);
                    document.head.appendChild(meta);

                    meta = document.createElement('meta');
                    meta.setAttribute('name', 'google-signin-scope');
                    meta.setAttribute('content', 'https://www.googleapis.com/auth/plus.login');
                    document.head.appendChild(meta);

                    meta = document.createElement('meta');
                    meta.setAttribute('name', 'google-signin-requestvisibleactions');
                    meta.setAttribute('content', 'http://schema.org/AddAction');
                    document.head.appendChild(meta);

                    meta = document.createElement('meta');
                    meta.setAttribute('name', 'google-signin-cookiepolicy');
                    meta.setAttribute('content', 'single_host_origin');
                    document.head.appendChild(meta);

                    GooglePlusProvider.Callback = function () {
                        MEPH.Log('GooglePlusProvider.Callback ');
                    }
                    var filename = "https://apis.google.com/js/client:platform.js?onload=GooglePlusProvider.Callback";
                    MEPH.loadJSCssFile(filename, '.js', function () {
                        // Additional params including the callback, the rest of the params will
                        // come from the page-level configuration.
                        var additionalParams = {
                            'callback': signinCallback
                        }; //debugger
                        // gapi.client.load('plus', 'v1').then(function () {

                        promiseresponse();
                        MEPH.publish('googleplus_provider_inited', { type: GooglePlusProvider.key });
                        //});
                    });

                    function signinCallback(response) {

                        MEPH.publish('google_plus_provider_response', { type: GooglePlusProvider.key, response: response });

                    }
                    MEPH.mobile.providers.identity.GooglePlusProvider.initStarted = true;
                    //window.fbAsyncInit();
                }
            });
        }

    },
    properties: {
        isReady: false,
        $providerpromise: null,
        $response: null
    },
    initialize: function (args) {
        var me = this;
        me.args = args;
        me.$providerpromise = Promise.resolve();
    },
    contacts: function () {
        var me = this;
        if (me.isReady) {
            return new Promise(function (r, f) {
                /* make the API call */
                FB.api(
                    "/me/friends",
                    function (response) {
                        if (response && !response.error) {
                            r(response)
                        }
                    }
                );
            })
        }
        return false;
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
                }, GooglePlusProvider.maxWaitTime);
                me.contact().then(function (response) {
                    resolve(response);
                });
            }).then(function (response) {
                var val = null;
                if (response) {

                    switch (prop) {
                        case 'name':
                            val = response.displayName;
                            break;
                        case 'gender':
                            val = response.gender;
                            break;
                        case 'link':
                            val = response.link;
                            break;
                        case 'profileimage':
                            val = response.image.url
                            break;
                        case 'occupation':
                            val = response.occupation;
                            break;
                        case 'skills':
                            val = response.skills;
                            break;
                        case 'url':
                            val = response.url;
                            break;
                    }
                }
                return {
                    provider: me,
                    type: GooglePlusProvider.key,
                    response: response,
                    value: val
                };
            });
        });
        return me.$providerpromise;
    },
    contact: function () {
        var me = this;
        return (!me.isReady ? me.ready() : Promise.resolve()).then(function () {
            // This sample assumes a client object has been created.
            // To learn more about creating a client, check out the starter:
            //  https://developers.google.com/+/quickstart/javascript
            if (me.cachedResponse) {
                return me.cachedResponse;
            }
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            return new Promise(function (resolve, fail) {
                try {
                    request.execute(function (resp) {
                        me.cachedResponse = resp;
                        resolve(resp);
                    });
                } catch (e) {
                    fail(e);
                }
            })
        })
    },
    online: function () {
        var me = this;
        return me.ready().then(function () {
            return GooglePlusProvider.online();
        })
    },
    login: function () {
        var me = this;
        return me.ready().then(function () {
            return GooglePlusProvider.login(me);
        })
    },
    logoff: function () {

        var me = this;
        return me.ready().then(function () {
            return GooglePlusProvider.logoff(me);
        })
    },
    ready: function () {
        var me = this;
        me.$providerpromise = me.$providerpromise.then(function () {

            return new Promise(function (r) {
                if (me.isReady) {
                    r(GooglePlusProvider.key);
                    return;
                }

                var ref = MEPH.subscribe('google_plus_provider_response', function (type, res) {
                    me.$response = res.response;
                    MEPH.unsubscribe(ref);
                });

                var refinit = MEPH.subscribe('googleplus_provider_inited', function (type) {

                    me.isReady = true;
                    MEPH.unsubscribe(refinit);
                    r(GooglePlusProvider.key);
                });

                GooglePlusProvider.init(me.args)
            });
        });
        return me.$providerpromise;
    }
})