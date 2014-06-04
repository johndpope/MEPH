var index = location.pathname.indexOf('dev-harness')
var rel = location.pathname.substr(0, index);
var path = rel + 'meph/src';
var riksbyggenexample = 'dev-harness/riksbyggen-example/';
var MEPHRiks = rel + riksbyggenexample + 'Riks';
var authorizationPath = location.origin + '/AuthorizationServer/OAuth/Authorize';//'http://localhost:52154/OAuth/Authorize'
var signPath = location.origin + rel + 'signin/signin.html';
var resourcePath = location.origin + '/ResourceServer/';//'http://localhost:51103/MEPH/signin/signin.html',
mephFrameWork('MEPH', path);
MEPH.ready().then(function () {
    MEPH.setPath(path, 'MEPH');
    MEPH.setPath(MEPHRiks, 'Riks');
    MEPH.setPath(rel + riksbyggenexample + 'data', 'dataviews');
    MEPH.create('MEPH.mobile.Application').then(function () {
        var app = MEPH.App.mobileApplication({
            product: 'UNIT4',
            applicationName: 'Riksbyggen Agresso Pro',
            applicationSelector: 'mephplatform',
            appPath: rel + riksbyggenexample + '/RiksbyggenApplication.html?',
            homeView: {
                viewId: 'MEPH001',
                'path': '/mobile/home'
            },
            ioc: {
                sessionManager: {
                    'static': true,
                    type: 'MEPH.session.SessionManager',
                    config: {
                        loginRequired: true,
                        'authorizationPath': authorizationPath,
                        'clientId': 'AgressoMobile2',
                        'returnUri': signPath,
                        'state': 'state',
                        'scope': 'agresso',
                        'client_secret': 'secret',
                        'response_type': 'token'
                    }
                },
                serviceCaller: {
                    type: 'MEPH.service.ServiceCaller',
                    config: {
                        'static': true,
                        apiPath: 'api/',
                        defaultResourceEndpoint: resourcePath//'http://localhost:2071/'
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
                }
            }
        }).ready().then(function (x) {
            window.Application = x;
        });

    });
});