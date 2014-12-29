var index = location.pathname.indexOf('dev-harness')
var rel = location.pathname.substr(0, index);
var path = rel + 'meph/src';
var mobileexample = 'dev-harness/nection-prototype/';
var MEPHControlsPath = rel + mobileexample + 'Connection';
mephFrameWork('MEPH', path);
MEPH.ready().then(function () {
    MEPH.setPath(path, 'MEPH');
    MEPH.setPath(MEPHControlsPath, 'Connection');
    //MEPH.setPath(ProvidersPath, 'Providers');
    MEPH.setPath(rel + mobileexample + 'data', 'dataviews');
    MEPH.create('Connection.application.Application').then(function () {
        var app = MEPH.App.mobileApplication({
            product: 'Connection',
            applicationName: 'Connection Mobile',
            applicationSelector: 'mephplatform',
            appPath: rel + mobileexample + '/index.html?',
            homeView: {
                viewId: 'FirstTimePage',
                'path': '/first/time/login'
            },
            ioc: {
                sessionManager: {
                    'static': true,
                    type: 'MEPH.session.SessionManager',
                    config: {
                        loginRequired: false
                    }
                },
                identityProvider: {
                    'static': true,
                    type: 'MEPH.identity.IdentityProvider',
                    config: {
                        providers: [{
                            type: 'MEPH.mobile.providers.identity.FacebookProvider',
                            args: {
                                appId: '414352408719933',
                                loginbtn: '#facebooklogin'
                            }
                        }]
                    }
                },
                contactService: {
                    'static': true,
                    type: 'Connection.service.ContactService',
                    config: {}
                },
                contactProvider: {
                    'static': true,
                    type: 'MEPH.identity.ContactProvider',
                    config: {
                    }
                },
                audioResources: {
                    'static': true,
                    type: 'MEPH.audio.AudioResources'
                },
                fileSaver: {
                    'static': true,
                    type: 'MEPH.file.FileSaver'
                },
                recorder: {
                    'static': true,
                    type: 'MEPH.audio.Recorder'
                },
                scheduler: {
                    'static': true,
                    type: 'MEPH.audio.Scheduler',
                    config: {
                        init: true
                    }
                },
                viewProvider: {
                    type: 'MEPH.mobile.providers.viewprovider.ViewProvider',
                    config: {
                        viewsResource: {
                            uri: 'Views.json',
                            path: 'dataviews',
                            preload: false
                        },
                        root: 'views'
                    }
                },
                menuProvider: {
                    type: 'MEPH.mobile.providers.menuprovider.MenuProvider',
                    config: {
                        viewsResource: {
                            uri: '/Menu.json',
                            path: 'dataviews',
                            preload: false
                        },
                        root: 'menu'
                    }
                },
                applicationMenuProvider: {
                    'static': true,
                    type: 'MEPH.mobile.application.menu.ApplicationMenuProvider',
                    config: {
                        providers: ['activityMenuProvider', 'remoteUserProvider']
                    }
                },
                userService: {
                    'static': true,
                    type: 'Connecion.service.UserService',
                    config: {

                    }
                },
                //remoteUserProvider: {
                //    'static': true,
                //    type: 'Providers.remoteUser.RemoteProvider',
                //    config: {
                //    }
                //},
                activityMenuProvider: {
                    'static': true,
                    type: 'MEPH.mobile.application.menu.ActivityMenuProvider',
                    config: {
                    }
                },
                remotingController: {
                    'static': true,
                    type: 'MEPH.remoting.RemotingController',
                    config: {
                        autoRtc: true,
                        peerConnectionConstraints: {
                            'optional': [
                              { 'DtlsSrtpKeyAgreement': true },
                              { 'RtpDataChannels': true }
                            ]
                        },
                        peerConnectionConfiguration: {
                            'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]
                        },
                    }
                },
                signalService: {
                    'static': true,
                    type: 'MEPH.service.SignalRService',
                    config: {
                    }
                }
            }
        }).ready().then(function (x) {

        }).catch(function (error) {
            MEPH.Log(error);
        });

    });
    MEPH.loadScripts(['/signalr/hubs']);

});
//webrtcDetectedBrowser === 'firefox' ? {
//    'iceServers': [{ 'url': 'stun:23.21.150.121' }]
//} : 