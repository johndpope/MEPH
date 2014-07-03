# IOC

Let's talk about IOC, let's talk about you and me, let's talk about all the good things and there are no bad things about IOC.

## A short story

In software engineering, inversion of control(IOC), describes a design in which custom written portions of a computer program receives the flow of control from a generic, reusable library. That's straight from [wikipedia](http://en.wikipedia.org/wiki/Inversion_of_control), read about it there.


## How do I set up my IOC

As seen in the [getting started with U4M](#!/guide/getting_started) guide, ioc is a critical portion of the U4M framework. Setting up your IOC container is pretty straightforward. In the ioc section of the configuration, add your keys that will be used to fetch an instance or instances of your "interface".

In the example below, 'viewProvider' is fully configured as a U4M.mobile.providers.viewprovider.MobileViewProvider. There is a more through explanation about the [MobileViewProvider configuration here](#!/api/U4M.mobile.providers.viewprovider.MobileViewProvider).




		 U4M.create('U4M.mobile.MobileApplication').then(function () {
				var app = U4M.MobileApp.mobileApplication({
					...,
					ioc: {
						sessionManager: {
							...
						},
						viewProvider: {
							static: true,
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
							...
						},
						...
					}
				});
			});

## How do I retrieve an instance

The following is an example of how to get an instance of the viewprovider. The [U4M.MobileServices](#!/api/U4M.mobile.services.MobileServices) is a static object which is used to retrieve references to instances.

		 U4M.MobileServices.get('viewProvider').then(function (viewProvider) {
           // viewProvider is an instance of the specified type from the IOC.
        });

## Standard options for IOC entries

The view provider's configuration shares a few things in common with all the other possible IOC configurations. 

-  static : if true, the [U4M.MobileServices](#!/api/U4M.mobile.services.MobileServices), will return the same instance everytime it is requested. If false, it will return a new instance everytime it is requested. If static is not set at all, it is assumed false.
-  type : the fully qualified name of the class which will be created.
-  config : the configuration will be passed to the constructore of the specified type.


					viewProvider: {
							static: true,
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
