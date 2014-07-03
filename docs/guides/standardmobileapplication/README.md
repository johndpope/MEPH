# Standard mobile application configuration

A guide about setting up a minimal mobile application

 
## I'm lazy, what's the least I have to do

			var index = location.pathname.indexOf('dev-harness')
			var rel = location.pathname.substr(0, index);
			var path = rel + 'MEPH/src';
			var mobileexample = 'dev-harness/u4-mobile-example/';
			var MEPHControlsPath = rel + mobileexample + 'controlExamples';
			MEPHFrameWork('MEPH', path);
			MEPH.ready().then(function () {
				MEPH.setPath(path, 'MEPH');
				MEPH.setPath(MEPHControlsPath, 'MEPHControls');
				MEPH.setPath(rel + mobileexample + 'data', 'dataviews');
				MEPH.create('MEPH.mobile.MobileApplication').then(function () {
					var app = MEPH.MobileApp.mobileApplication({
						product: 'UNIT4',
						applicationName: 'Riksbyggen Agresso Pro',
						applicationSelector: 'agreesmobileplatform',
						appPath: rel + mobileexample + '/index.html?',
						homeView: {
							viewId: 'MEPH001',
							'path': '/mobile/home'
						},
						ioc: {
							viewProvider: {
								'static': true,
								type: 'MEPH.mobile.providers.viewprovider.MobileViewProvider',
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
								'static': true,
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
									providers: ['activityMenuProvider']
								}
							},
							activityMenuProvider: {
								'static': true,
								type: 'MEPH.mobile.application.menu.ActivityMenuProvider',
								config: {
								}
							}
						}
					}).ready().then(function (x) {
						window.Application = x;
					}).catch(function (error) {
						 console.log(error)
					});
				});
			}); 

### Let's break it down

There seems to be a lot going on in the 'shortest example possible'. There is a lot going on, but it all has a purpose. For an explanation of each part [click here](#!/guide/getting_started).