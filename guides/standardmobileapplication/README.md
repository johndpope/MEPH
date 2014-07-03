# Standard mobile application configuration

A guide about setting up a minimal mobile application


## I'm lazy, what's the least I have to do

			var index = location.pathname.indexOf('dev-harness')
			var rel = location.pathname.substr(0, index);
			var path = rel + 'u4m/src';
			var mobileexample = 'dev-harness/u4-mobile-example/';
			var U4MControlsPath = rel + mobileexample + 'controlExamples';
			u4mFrameWork('U4M', path);
			U4M.ready().then(function () {
				U4M.setPath(path, 'U4M');
				U4M.setPath(U4MControlsPath, 'U4MControls');
				U4M.setPath(rel + mobileexample + 'data', 'dataviews');
				U4M.create('U4M.mobile.MobileApplication').then(function () {
					var app = U4M.MobileApp.mobileApplication({
						product: 'UNIT4',
						applicationName: 'Riksbyggen Agresso Pro',
						applicationSelector: 'agreesmobileplatform',
						appPath: rel + mobileexample + '/index.html?',
						homeView: {
							viewId: 'U4M001',
							'path': '/mobile/home'
						},
						ioc: {
							viewProvider: {
								'static': true,
								type: 'U4M.mobile.providers.viewprovider.MobileViewProvider',
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
								type: 'U4M.mobile.providers.menuprovider.MenuProvider',
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
								type: 'U4M.mobile.application.menu.ApplicationMenuProvider',
								config: {
									providers: ['activityMenuProvider']
								}
							},
							activityMenuProvider: {
								'static': true,
								type: 'U4M.mobile.application.menu.ActivityMenuProvider',
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