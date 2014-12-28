/**
 * @class MEPH.mobile.providers.identity.FacebookProvider
 * A base class for identity providers.
 */
MEPH.define('MEPH.mobile.providers.identity.FacebookProvider', {
    alternateNames: ['FacebookProvider'],
    properties: {
    },
    statics: {
        init: function (args) {
            return new Promise(function (promiseresponse, f) {
                if (!MEPH.mobile.providers.identity.FacebookProvider.initStarted && args && args.appId) {
                    window.fbAsyncInit = window.fbAsyncInit || function () {
                        FB.init({
                            cookie: true,  // enable cookies to allow the server to access 
                            // the session
                            appId: args.appId,
                            xfbml: true,
                            version: 'v2.2'
                        });

                        FB.getLoginStatus(function (response) {
                            statusChangeCallback(response);
                        });

                    };

                    function statusChangeCallback(response) {
                        // The response object is returned with a status field that lets the
                        // app know the current login status of the person.
                        // Full docs on the response object can be found in the documentation
                        // for FB.getLoginStatus().
                        MEPH.publish(MEPH.Constants.provider.IDENTITY_STATUS_CHANGE, {
                            status: response.status
                        });
                        if (response) {
                            if (response.status === 'connected') {
                                FB.api('/me', function (response) {
                                    console.log('Successful login for: ' + response.name);
                                    document.querySelector(args.loginbtn).innerHTML =
                                      'Thanks for logging in, ' + response.name + '!';
                                });

                                MEPH.publish('facebook_provider_response', { type: 'facebook', response: response });
                            }
                            else {
                                f({ type: 'facebook', response: response });
                            }
                        }
                    }
                    // This function is called when someone finishes with the Login
                    // Button.  See the onlogin handler attached to it in the sample
                    // code below.
                    function checkLoginState() {
                        FB.getLoginStatus(function (response) {
                            statusChangeCallback(response);
                        });
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
                    window.fbAsyncInit();
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
                        debugger
                        if (response && !response.error) {
                            r(response)
                        }
                    }
                );
            })
        }
        return false;
    },
    ready: function () {
        var me = this;
        return me.$providerpromise.then(function () {
            return new Promise(function (r) {
                var ref = MEPH.subscribe('facebook_provider_response', function (type, res) {
                    
                    me.$response = res.response;
                    me.isReady = true;
                    MEPH.unsubscribe(ref);
                    r(res);
                });
                return FacebookProvider.init(me.args)
            })
        });
    }
});