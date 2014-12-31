/**
 * @class MEPH.mobile.providers.identity.FacebookProvider
 * A base class for identity providers.
 */
MEPH.define('MEPH.mobile.providers.identity.FacebookProvider', {
    alternateNames: ['FacebookProvider'],
    extend: 'MEPH.mobile.providers.identity.IdentityProvider',
    properties: {
    },
    statics: {
        key: 'facebook',
        maxWaitTime: 10000,
        login: function () {
            return new Promise(function (r, f) {
                var $timeout = setTimeout(function () {
                    r(false);
                }, FacebookProvider.maxWaitTime);

                FB.login(function (response) {
                    FacebookProvider.response = response;
                    MEPH.publish(MEPH.Constants.provider.IDENTITY_STATUS_CHANGE, {
                        status: response.status
                    });
                    MEPH.publish('facebook_provider_response', {
                        type: 'facebook', response: response
                    });

                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        r(true);
                    } else if (response.status === 'not_authorized') {
                        r(false);;
                        // The person is logged into Facebook, but not your app.
                    } else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.

                        r(false);;
                    }
                });
            });
        },
        online: function () {
            return new Promise(function (resolve, f) {
                var $timeout = setTimeout(function () {
                    resolve(true);
                }, FacebookProvider.maxWaitTime);
                FB.getLoginStatus(function (response) {
                    clearTimeout($timeout);
                    resolve(response && (response.status === 'connected'));
                });

            })
        },
        init: function (args) {
            return new Promise(function (promiseresponse, f) {
                if (!MEPH.mobile.providers.identity.FacebookProvider.initStarted && args && args.appId) {
                    window.fbAsyncInit = window.fbAsyncInit || function () {
                        try {
                            FB.init({
                                cookie: true,  // enable cookies to allow the server to access 
                                // the session
                                appId: args.appId,
                                xfbml: true,
                                version: 'v2.2'
                            });

                            //FB.getLoginStatus(function (response) {
                            //    statusChangeCallback(response);
                            //}, true);
                            MEPH.publish('facebook_provider_inited', { type: 'facebook' });
                        } catch (e) {
                            MEPH.Log(e);
                            f(e);
                        }

                    };

                    //function statusChangeCallback(response) {
                    //    // The response object is returned with a status field that lets the
                    //    // app know the current login status of the person.
                    //    // Full docs on the response object can be found in the documentation
                    //    // for FB.getLoginStatus().
                    //    MEPH.publish(MEPH.Constants.provider.IDENTITY_STATUS_CHANGE, {
                    //        status: response.status
                    //    });
                    //    if (response) {
                    //        if (response.status === 'connected') {
                    //            //FB.api('/me', function (response) {
                    //            //    console.log('Successful login for: ' + response.name);
                    //            //});

                    //            MEPH.publish('facebook_provider_response', { type: 'facebook', response: response });
                    //        }
                    //        else {
                    //            f({ type: 'facebook', response: response });
                    //        }
                    //    }
                    //}
                    // This function is called when someone finishes with the Login
                    // Button.  See the onlogin handler attached to it in the sample
                    // code below.
                    function checkLoginState() {
                        //FB.getLoginStatus(function (response) {
                        //    statusChangeCallback(response);
                        //});
                    }

                    MEPH.mobile.providers.identity.FacebookProvider.checkLoginState = checkLoginState;
                    if (args.loginbtn) {
                        var loginbtn;
                        if (typeof args.loginbtn === 'string') {
                            loginbtn = document.querySelector(args.loginbtn);
                        }
                        else {
                            loginbtn = args.loginbtn;

                        }
                        if (loginbtn)
                            loginbtn.innerHTML = '<fb:login-button scope="public_profile,email" onlogin="MEPH.mobile.providers.identity.FacebookProvider.checkLoginState();"></fb:login-button>';
                    }
                    if (!MEPH.mobile.providers.identity.FacebookProvider.libraryLoaded) {
                        (function (d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) { return; }
                            js = d.createElement(s); js.id = id;
                            js.src = "//connect.facebook.net/en_US/sdk.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }(document, 'script', 'facebook-jssdk'));
                        MEPH.mobile.providers.identity.FacebookProvider.libraryLoaded = true;
                    }
                    MEPH.mobile.providers.identity.FacebookProvider.initStarted = true;
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
                }, FacebookProvider.maxWaitTime);
                me.contact().then(function (response) {
                    resolve(response);
                });
            }).then(function (response) {
                var val = null;
                if (response)
                    if (response.error) {
                        val = null;
                    }
                    else
                        switch (prop) {
                            case 'name':
                                val = response.name;
                                break;
                            case 'gender':
                                val = response.gender;
                                break;
                            case 'link':
                                val = response.link;
                                break;
                            case 'profileimage':
                                val = 'https://graph.facebook.com/' + response.id + '/picture'
                                break;
                        }
                return {
                    provider: me,
                    type: FacebookProvider.key,
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
            return new Promise(function (resolve, fail) {
                try {
                    if (me.cachedResponse) {
                        return me.cachedResponse;
                    }

                    FB.api('/me', function (response) {
                        if (response.error) {
                            me.cachedResponse = null;
                            fail(null);
                        }
                        console.log('Successful login for: ' + response.name);
                        me.cachedResponse = response;
                        resolve(response);
                    });
                }
                catch (e) {
                    fail(e);
                }
            })
        })
    },
    online: function () {
        var me = this;
        return me.ready().then(function () {
            return me.$online();
        })
    },
    login: function () {
        var me = this;
        return me.ready().then(function () {
            return FacebookProvider.login();
        })
    },
    $online: function () {
        return new Promise(function (resolve, f) {
            var $timeout = setTimeout(function () {
                resolve(false);
            }, FacebookProvider.maxWaitTime);
            FB.getLoginStatus(function (response) {
                clearTimeout($timeout);
                resolve(response && (response.status === 'connected'));
            });

        })
    },
    ready: function () {
        var me = this;
        me.$providerpromise = me.$providerpromise.then(function () {

            return new Promise(function (r) {
                if (me.isReady) {
                    r(FacebookProvider.key);
                    return;
                }

                var ref = MEPH.subscribe('facebook_provider_response', function (type, res) {
                    me.$response = res.response;
                    MEPH.unsubscribe(ref);
                });

                var refinit = MEPH.subscribe('facebook_provider_inited', function (type) {

                    me.isReady = true;
                    MEPH.unsubscribe(refinit);
                    r(FacebookProvider.key);
                });

                return FacebookProvider.init(me.args)
            });
        });
        return me.$providerpromise;
    }
});